from csv import excel_tab
from time import strptime
from tracemalloc import start
from flask import abort, Blueprint, jsonify, make_response, request

import yfinance as yf

from app.env import *
from app.helper import *

from datetime import datetime, timedelta


# This file should contain any requests made to get data from outside sources
# any internal operations should be handled in api/portfolio_api.py


# '''
# Description:
#     Input: 
#     Output:
# '''

# Define stock data blueprint
data_bp = Blueprint('/data', __name__)

ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query?function='


# Gets timeseries data for a single stock
@data_bp.route("/get_timeseries", methods=['GET'])
def get_timeseries():
    if request.method == 'GET':
        try:
            ticker = request.args.get('ticker').upper() # Ex. MSFT, AAPL, etc.
            period = request.args.get('period') # default is '1mo', valid periods: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
            start_date = request.args.get('start_date') # format: YYYY-MM-DD
            end_date = request.args.get('end_date') # format: YYYY-MM-DD
            interval = request.args.get('interval') # default is '1d', valid intervals: 1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo

            if period: # If period is specified, use it 
                interval='1d' if not interval else interval
                raw = yf.download(ticker, period=period, interval=interval)
                raw.reset_index(level=0, inplace=True)
                raw = raw.to_dict(orient='records')
                # print(raw)
                # data={}
                data = []
                for entry in raw:
                    data.append({
                            'date': entry['Date'].to_pydatetime().date().strftime('%Y-%m-%d'),
                            'open': entry['Open'],
                            'high': entry['High'],
                            'low': entry['Low'],
                            'close': entry['Close'],
                            'volume': entry['Volume'],
                            'adj_close': entry['Adj Close']
                        })
                return make_response(jsonify(data=data, statusCode=200))

                # return make_response(jsonify(data=data, statusCode=200))
            elif start_date and end_date: # If start and end date are specified, use them
                interval='1d' if not interval else interval
                raw = yf.download(ticker, start=start_date, end=end_date, interval=interval)
                raw.reset_index(level=0, inplace=True)
                raw = raw.to_dict(orient='records')

                data={}
                for entry in raw:
                    data[entry['Date'].to_pydatetime().date().strftime('%Y-%m-%d')] = {
                            'open': entry['Open'],
                            'high': entry['High'],
                            'low': entry['Low'],
                            'close': entry['Close'],
                            'volume': entry['Volume'],
                            'adj_close': entry['Adj Close']
                        }

                return make_response(jsonify(data=data, statusCode=200))
            else:
                raw = yf.download(ticker, period = '1mo')
                raw.reset_index(level=0, inplace=True)
                raw = raw.to_dict(orient='records')
                
                data={}
                for entry in raw:
                    data[entry['Date'].to_pydatetime().date().strftime('%Y-%m-%d')] = {
                            'open': entry['Open'],
                            'high': entry['High'],
                            'low': entry['Low'],
                            'close': entry['Close'],
                            'volume': entry['Volume'],
                            'adj_close': entry['Adj Close']
                        }

                return make_response(jsonify(data=data, statusCode=200))
            
        except Exception as e:
            print(e)
            # Handle error in front, maybe try again?
            return make_response(jsonify(error=str(e), statusCode=400))


# Might be able to remove this/update it
@data_bp.route("/current_price", methods=['GET'])
def current_price():
    if request.method == 'GET':
        try:
            ticker = request.args.get('ticker').upper() # Ex. MSFT, AAPL, etc.
            stock = yf.Ticker(ticker)
            price = stock.history(period='1d')['Close'][0]

            return make_response(jsonify(price=price, statusCode=200))
        except Exception as e:
            print(e)
            return make_response(jsonify(error=str(e), statusCode=400))



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


# Gets price on specified date, if date is not a valid trading day, gets most recent closing price
@data_bp.route("/price_on_day", methods=['GET'])
def price_on_day():
    try:
        ticker = request.args.get('ticker').upper() # Ex. MSFT, AAPL, etc.
        end_date = request.args.get('end_date') # format: YYYY-MM-DD
        print(end_date)
        url = 'http://localhost:5000/data/get_timeseries?ticker={}&end_date={}&interval=1d'.format(ticker, end_date)
        resp = make_request(url)
        data = resp['data']

        if end_date in data:
            return make_response(jsonify(statusCode = 200, price=data[end_date]['close']))
        
        else:
            while end_date not in data:

                start_date = datetime.strptime(end_date, '%Y-%m-%d') - timedelta(days=1)
                start_date = start_date.strftime('%Y-%m-%d')
                url = 'http://localhost:5000/data/get_timeseries?ticker={}&start_date={}&end_date={}&interval=1d'.format(ticker, start_date, end_date)
                resp = make_request(url)
                data = resp['data']

                if start_date in data:
                    return make_response(jsonify(statusCode = 200, price=data[start_date]['close']))
                
                end_date = datetime.strptime(end_date, '%Y-%m-%d') - timedelta(days=1)
                end_date = end_date.strftime('%Y-%m-%d')

            return make_response(jsonify(statusCode = 200, price=None))

        
        return make_response(jsonify(price='price', statusCode=200))
    except Exception as e:
        print(e)
        return make_response(jsonify(error=str(e), statusCode=400))