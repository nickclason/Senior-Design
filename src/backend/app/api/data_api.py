from csv import excel_tab
from time import strptime
from tracemalloc import start
from flask import abort, Blueprint, jsonify, make_response, request

import yfinance as yf

from app.env import *
from app.helper import *

from datetime import datetime, timedelta, date
from bs4 import BeautifulSoup


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
            ticker = request.args.get('ticker').upper()  # Ex. MSFT, AAPL, etc.
            # default is '1mo', valid periods: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
            period = request.args.get('period')
            start_date = request.args.get('start_date')  # format: YYYY-MM-DD
            end_date = request.args.get('end_date')  # format: YYYY-MM-DD
            # default is '1d', valid intervals: 1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo
            interval = request.args.get('interval')

            if period:  # If period is specified, use it
                interval = '1d' if not interval else interval
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
            elif start_date and end_date:  # If start and end date are specified, use them
                interval = '1d' if not interval else interval
                raw = yf.download(ticker, start=start_date,
                                  end=end_date, interval=interval)
                raw.reset_index(level=0, inplace=True)
                raw = raw.to_dict(orient='records')

                data = {}
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
                raw = yf.download(ticker, period='1mo')
                raw.reset_index(level=0, inplace=True)
                raw = raw.to_dict(orient='records')

                data = {}
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
            ticker = request.args.get('ticker').upper()  # Ex. MSFT, AAPL, etc.
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
        return make_response(jsonify(message="No keywords provided", statusCode=200, results=[]))
    else:
        try:
            url = ALPHA_VANTAGE_BASE_URL + \
                'SYMBOL_SEARCH&keywords={}&apikey={}'.format(
                    keywords, ALPHA_VANTAGE_API_KEY)
            raw = make_request(url)
            cleaned = clean_results(raw)
            return make_response(jsonify(message="Valid keywords", statusCode=200, results=cleaned))
        except Exception as e:
            print(e)
            abort(400)


# Gets price on specified date, if date is not a valid trading day, gets most recent closing price
@data_bp.route("/price_on_day", methods=['GET'])
def price_on_day():
    try:
        ticker = request.args.get('ticker').upper()  # Ex. MSFT, AAPL, etc.
        end_date = request.args.get('end_date')  # format: YYYY-MM-DD
        print(end_date)
        url = 'http://localhost:5000/data/get_timeseries?ticker={}&end_date={}&interval=1d'.format(
            ticker, end_date)
        resp = make_request(url)
        data = resp['data']

        if end_date in data:
            return make_response(jsonify(statusCode=200, price=data[end_date]['close']))

        else:
            while end_date not in data:

                start_date = datetime.strptime(
                    end_date, '%Y-%m-%d') - timedelta(days=1)
                start_date = start_date.strftime('%Y-%m-%d')
                url = 'http://localhost:5000/data/get_timeseries?ticker={}&start_date={}&end_date={}&interval=1d'.format(
                    ticker, start_date, end_date)
                resp = make_request(url)
                data = resp['data']

                if start_date in data:
                    return make_response(jsonify(statusCode=200, price=data[start_date]['close']))

                end_date = datetime.strptime(
                    end_date, '%Y-%m-%d') - timedelta(days=1)
                end_date = end_date.strftime('%Y-%m-%d')

            return make_response(jsonify(statusCode=200, price=None))

    except Exception as e:
        print(e)
        return make_response(jsonify(error=str(e), statusCode=400))


@data_bp.route("/get", methods=['GET'])
def get():
    try:
        symbol = request.args.get('symbol').upper()  # Ex. MSFT, AAPL, etc.
        ticker = yf.Ticker(symbol)
        stats = ticker.stats()
        news = ticker.news

        stock = Stock.query.filter_by(symbol=symbol).first()
        if stock is None:
            current_price = stats['financialData']['currentPrice']
            website = stats['summaryProfile']['website']
            idx = website.find('.') + 1
            logo_url = "https://logo.clearbit.com/{}".format(website[idx:])
            industry = stats['summaryProfile']['industry']
            sector = stats['summaryProfile']['sector']
            longName = stats['price']['longName']
            
            new_stock = Stock(symbol.upper(), current_price, datetime.now(), website,
                              industry, sector, logo_url, longName)

            db.session.add(new_stock)
            db.session.commit()

        data = {'stats': stats, 'name': stock.company_name,
            'logo_url': stock.logo_url, 'news': news}

        return jsonify(data)

    except Exception as e:
        print(e)
        return make_response(jsonify(error=str(e), statusCode=400))


@data_bp.route("/get_news", methods=['GET'])
def get_news():
    try:
        resp = make_request(
            'https://api.marketaux.com/v1/news/all?api_token=f4FMt1n7cSE463zCwcviLS5SdDt3VuXFp9LrvBEn&countries=us')
        return jsonify(resp)

    except Exception as e:
        print(e)
        return make_response(jsonify(error=str(e), statusCode=400))

def sort_change(e):
    return e['chg']
def sort_symbol(e):
    return e['symbol']

def get_days_of_month(month, year):
    if (month == 1 or month == 3 or month == 5 or month == 7 or month == 8 or month == 10 or month == 12):
        return 31
    elif (month == 4 or month == 6 or month == 9 or month == 11):
        return 30
    else:
        if (year % 4 == 0):
            return 29
        return 28
    #python 3.10
    # match month:
    #     case 1, 3, 5, 7, 8, 10, 12: 
    #         return 31
    #     case 4, 6, 9, 11:
    #         return 30
    #     case 2: 
    #         if year % 4 == 0:
    #             return 29
    #         return 28
    #python 3.9

def get_previous_week():
    today = datetime.today()
# today_formatted = today.strftime("%Y-%m-%d")
    if (today.weekday() > 4): #if it is a weekend
        extra_subtract = 6 - today.weekday() #additional days depending if it is Sat/Sun
        if (today.day < 8): #and we are earlier than the eigthth day of the month
            if (today.month == 1): #if january
                temp_year = today.year - 1
                temp_month = 12
                max_days = 31
                temp_date = date(temp_year, temp_month, max_days - extra_subtract + (today.day - 7))
                return temp_date
            else:
                temp_month = today.month - 1 #decrement the month
                temp_day = today.day - 7 #get the number to subtract from the max days
                max_days = get_days_of_month(today.month - 1, today.year)
                max_days = max_days + temp_day - extra_subtract
                temp_date = date(today.year, today.month - 1, max_days)
                return temp_date
        else: #if it is past the eigthth of the month and it is a weekend
            temp_day = today.day - 7 - extra_subtract
            temp_date = date(today.year, today.month, temp_day)
            return temp_date
    else: #weekday
        if (today.day < 8): #beginning of month
            if (today.month == 1): #january
                temp_year = today.year - 1
                temp_month = 12
                max_days = 31
                temp_day = today.day - 7
                temp_date = date(temp_year, temp_month, max_days + temp_day)
                return temp_date
            else:
                max_days = get_days_of_month(today.month - 1, today.year)
                new_day = max_days + (today.day - 7)
                temp_date = date(today.year, today.month - 1, new_day)
                return temp_date
        else: #base case
            temp_date = date(today.year, today.month, today.day - 7)
            return temp_date

@data_bp.route("/get_weekly_data", methods=['GET'])
def get_weekly_data():
    try:
        print("GET - WEEKLY DATA")
        stocks = Stock.query.all()
        symbols = []
 
        for stock in stocks:
            symbols.append(stock.symbol)
        week_date = get_previous_week()
        print("Week Old Date: {}".format(week_date))
        temp_data = yf.download(symbols, week_date.strftime("%Y-%m-%d"))['Adj Close']
        # print(temp_data.iloc[0])
 
        old_week_data = temp_data.iloc[0]
        data_current = []
        for stock in stocks:
            ticker = yf.Ticker(stock.symbol)
            stats = ticker.stats()
            data_current.append( {'symbol': stock.symbol, 'current_price': stats['financialData']['currentPrice'], 'logo_url': stock.logo_url})
 
        current_sorted = sorted(data_current, reverse=False, key=sort_symbol)
        weekly_data = []
        count = 0
        for item in current_sorted:
            # print("Current Price: {}, Week Old Price: {}".format(item['current_price'], old_week_data[count]))
            calculation = (item['current_price'] - old_week_data[count])
            weekly_data.append(
                {'symbol': item['symbol'], 'chg': calculation / old_week_data[count], 'logo_url': item['logo_url']})
            count += 1
 
        sorted_items = sorted(weekly_data, reverse=True, key=sort_change)
        winners = sorted_items[0:5]
        losers = sorted_items[-5:]
        losers = sorted(losers, key=lambda loser: loser['chg'])
        return jsonify(winners=winners, losers=losers)
    except Exception as e:
        print(e)
        return make_response(jsonify(error=str(e), statusCode=400))

@data_bp.route("/get_daily_data", methods=['GET'])
def get_daily_data():
    try:
        stocks = Stock.query.all()
        data = {}
        for stock in stocks:
            ticker = yf.Ticker(stock.symbol)
            stats = ticker.stats()
            data[stock.symbol] = {'daily_change': stats['price']
                ['regularMarketChangePercent'], 'logo_url': stock.logo_url}

        items = sorted(data.items(), reverse=True,
                       key=lambda tup: (tup[1]["daily_change"]))

        new_items = []
        for item in items:
            new_items.append(
                {'symbol': item[0], 'chg': item[1]['daily_change'], 'logo_url': item[1]['logo_url']})

        winners = new_items[0:5]
        losers = new_items[-5:]

        losers = sorted(losers, key=lambda loser: loser['chg'])

        return jsonify(winners=winners, losers=losers)
    except Exception as e:
        print(e)
        return make_response(jsonify(error=str(e), statusCode=400))


@data_bp.route("/get_house_info", methods=['GET'])
def get_house_info():
    try:
        date = request.args.get('date')  # format: MM-DD-YYYY
        if date is None:
            date = datetime.today().strftime('%m_%d_%Y')

        url = 'https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/transaction_report_for_{}.json'.format(
            date)
        resp = make_request(url)

        if resp is None:
            return jsonify(data=-1)

        # clean data up to work with tables better
        formatted_resp = []
        for item in resp:
            for transaction in item['transactions']:

                formatted_resp.append({
                    'amount': transaction['amount'],
                    'cap_gains_over_200': transaction['cap_gains_over_200'],
                    'description': transaction['description'],
                    'owner': clean_owner(transaction['owner']),
                    'ticker': transaction['ticker'],
                    'transaction_date': transaction['transaction_date'],
                    'transaction_type': clean_transaction_type(transaction['transaction_type']),
                    'district': item['district'],
                    'name': item['name'],
                    'filing_date': item['filing_date'],
                    })

        return jsonify(data=formatted_resp)

    except Exception as e:
        print(e)
        return make_response(jsonify(error=str(e), statusCode=400))


@data_bp.route("/get_senate_info", methods=['GET'])
def get_senate_info():
    try:
        date = request.args.get('date')  # format: MM-DD-YYYY
        if date is None:
            date = datetime.today().strftime('%m_%d_%Y')

        url = 'https://senate-stock-watcher-data.s3-us-west-2.amazonaws.com/data/transaction_report_for_{}.json'.format(
            date)
        resp = make_request(url)

        if resp is None:
            return jsonify(data=-1)

        formatted_resp = []
        for item in resp:
            for transaction in item['transactions']:
                ticker = clean_ticker(transaction['ticker'])


                formatted_resp.append({
                    'senator': item['first_name'] + ' ' + item['last_name'],
                    'amount': transaction['amount'],
                    'disclosure_date': item['date_recieved'],
                    'asset_type': '--' if transaction['asset_type'] is None else transaction['asset_type'],
                    'description': transaction['asset_description'],
                    'owner': transaction['owner'],
                    'comment': transaction['comment'],
                    'ticker': ticker,
                    'transaction_date': transaction['transaction_date'],
                    'transaction_type': clean_senate_transaction_type(transaction['type']),
                })

        return jsonify(data=formatted_resp)
    except Exception as e:
        print(e)
        return make_response(jsonify(error=str(e), statusCode=400))

@data_bp.route("/add_to_db", methods=['GET'])
def add_to_db():
    try:
        ticker = request.args.get('ticker')
        add_if_needed(ticker.upper())
        return jsonify(data='ticker added')
    except Exception as e:
        print(e)
        return make_response(jsonify(error=str(e), statusCode=400))


def clean_transaction_type(str):
    if str == 'purchase':
        return 'Purchase'
    elif str == 'sale_full':
        return 'Full Sale'
    elif str == 'sale_partial':
        return 'Partial Sale'
    elif str == 'exchange':
        return 'Exchange'
    else:
        return '--'

def clean_owner(str):
    if str == 'self':
        return 'Self'
    elif str == 'joint':
        return 'Joint'
    elif str == 'dependent':
        return 'Dependent'
    else:
        return '--'

def clean_senate_transaction_type(str):
    if str == 'N/A':
        return '--'
    elif str == 'Sale (Full)':
        return 'Full Sale'
    elif str == 'Sale (Partial)':
        return 'Partial Sale'
    else:
        return '--'

def clean_senate_owner(str):
    if str == 'N/A':
        return '--'
    else:
        return str

def clean_ticker(str):
    if str[0] == '<':
        parsed_html = BeautifulSoup(str, features='lxml')
        return parsed_html.body.find('a').text

    return str

def add_if_needed(str):
    stock = Stock.query.filter_by(symbol=str).first()
    if stock is None:
        add_stock_to_db(str)
