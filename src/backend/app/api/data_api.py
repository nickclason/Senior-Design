from flask import abort, Blueprint, jsonify, make_response, request
from itsdangerous import json

from app.env import *
from app.helper import *

# This file should contain any requests made to get data from outside sources
# any internal operations should be handled in api/portfolio_api.py


# '''
# Description:
#     Input: 
#     Output:
# '''

# Define stock data blueprint
data_bp = Blueprint('/data', __name__)

# TODO: Make function types and all that an enum?

ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query?function='

@data_bp.route("/get_timeseries", methods=['GET'])
def get_timeseries():
    '''
    Description: endpoint that returns a timeseries of data for a given stock
        Input: 
            function - string of the function to use for the data
            symbol - string of the stock symbol to get data for
            
            interval (optional) - string of the interval to use for the data (default is '60min)'
            outputsize (optional) - string of the output size to use for the data (default is 'compact')
            adjusted (optional) - boolean of whether or not to use adjusted data (default is True)

        Output: 
            chart_data - list of dictionaries, each dictionary is a single data point for the given function
    '''
    if request.method == 'GET':
        function = request.args.get('function').upper() # Intraday, Daily, Weekly (Adjusted), Monthly (Adjusted)
        symbol = request.args.get('symbol')
        interval = request.args.get('interval') # Intraday only - 1min, 5min, 15min, 30min, 60min
        outputsize = request.args.get('outputsize') # Intraday, Daily,  Default=compact (100 datapoints), full (20+ years of data)
        adjusted = request.args.get('adjusted') # Intraday only - Default is true

    if function is None or symbol is None:
        abort(400)
    else:
        try:
            
            if function == 'INTRADAY': # Example: "localhost:5000/data/get_timeseries?function=INTRADAY&symbol=AAPL"
                outputsize = 'compact' if outputsize is None else outputsize
                adjusted = 'true' if adjusted is None else adjusted
                interval = '60min' if interval is None else interval

                url = ALPHA_VANTAGE_BASE_URL + 'TIME_SERIES_INTRADAY&symbol={}&interval={}&adjusted={}&outputsize={}&apikey={}'.format(symbol.upper(), interval, adjusted, outputsize, ALPHA_VANTAGE_API_KEY)
                raw = make_request(url)

            elif function == 'DAILY': # Example: "localhost:5000/data/get_timeseries?function=DAILY&symbol=AAPL"
                outputsize = 'compact' if outputsize is None else outputsize

                url = ALPHA_VANTAGE_BASE_URL + 'TIME_SERIES_{}&symbol={}&outputsize={}&apikey={}'.format(function, symbol.upper(), outputsize, ALPHA_VANTAGE_API_KEY)
                raw = make_request(url)

            elif function in ['WEEKLY', 'WEEKLY_ADJUSTED', 'MONTHLY', 'MONTHLY_ADJUSTED']: # Example: "localhost:5000/data/get_timeseries?function=WEEKLY&symbol=AAPL"
                url = ALPHA_VANTAGE_BASE_URL + 'TIME_SERIES_{}&symbol={}&apikey={}'.format(function, symbol.upper(), ALPHA_VANTAGE_API_KEY)
                raw = make_request(url)

            chartData = convert_timeseries_to_chartdata(raw, function, interval)
            return make_response(jsonify(message="Valid Ticker", statusCode = 200, chartData=chartData))

        except Exception as e:
            print(e)
            abort(400)
        

@data_bp.route("/get_quote", methods=['GET'])
def get_quote():
    '''
    Description: Endpoint that returns the current quote for a given stock
        Input: N/A
        Output: Most recent price for the given stock
    '''
    if request.method == 'GET':
        symbol = request.args.get('symbol')
    
    if symbol is None:
        abort(400)
    else:
        try:
            url = ALPHA_VANTAGE_BASE_URL + 'GLOBAL_QUOTE&symbol={}&apikey={}'.format(symbol.upper(), ALPHA_VANTAGE_API_KEY)
            raw = make_request(url)
            quote = clean_quote(raw)
            return make_response(jsonify(message="Valid Ticker", statusCode = 200, quote=quote))
        except Exception as e:
            print(e)
            abort(400)
        

@data_bp.route("/search", methods=['GET'])
def search():
    '''
    Description: Endpoint that allows us to search for stocks, i.e if enter "apple" it will return most likely matches
        Input: keywords - string of keywords to search for
        Output: list of dictionaries, each dictionary is a single stock, containing the stock symbol and the stock name, as well as likelihood it is a match
    '''
    if request.method == 'GET':
        keywords = request.args.get('keywords')

    if keywords is None:
        return make_response(jsonify(message="No keywords provided", statusCode = 200, results = []))
    else:
        try:
            url = ALPHA_VANTAGE_BASE_URL + 'SYMBOL_SEARCH&keywords={}&apikey={}'.format(keywords, ALPHA_VANTAGE_API_KEY)
            raw = make_request(url)
            cleaned = clean_results(raw)
            return make_response(jsonify(message="Valid keywords", statusCode = 200, results=cleaned))
        except Exception as e:
            print(e)
            abort(400)


@data_bp.route("/get_price_on_day", methods=['GET'])
def get_price_on_day():

    if request.method == 'GET':
        try:

            symbol = request.args.get('symbol')
            date = request.args.get('date')
            date_str = datetime.datetime.fromtimestamp(int(date)/1000).strftime('%Y-%m-%d')

            url = ALPHA_VANTAGE_BASE_URL + 'TIME_SERIES_DAILY&symbol={}&apikey={}'.format(symbol.upper(), ALPHA_VANTAGE_API_KEY) 
            resp = make_request(url)['Time Series (Daily)'][date_str]['4. close']

            return make_response(jsonify(price=resp, statusCode = 200))

        except Exception as e:
            print(e)
            abort(400)