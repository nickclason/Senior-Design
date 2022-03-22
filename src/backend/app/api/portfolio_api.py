from flask import abort, Blueprint, jsonify, make_response, request

from app import db
from app.auth import *
from app.env import *
from app.helper import *

from app.models.user import User
from app.models.portfolio import Portfolio
from app.models.stock import Stock
from app.models.transaction import Transaction

import yfinance as yf

import datetime
from datetime import timedelta
# from time import sleep

# '''
# Description:
#     Input: 
#     Output:
# '''



# Define portfolio blueprint
portfolio_bp = Blueprint('/portfolio', __name__)


@portfolio_bp.route('/create_transaction', methods=['POST'])
@auth_required
def create_transaction():
    if request.method == 'POST':
        try:
            json_data = request.get_json()  # get data from POST request
            symbol = json_data['symbol'].upper()
            quantity = json_data['quantity']
            buy = True if json_data['buy'] == 1 else False
            date = json_data['date']

            user = get_authenticated_user() # Get the user
            portfolio = user.portfolio # Get the user's portfolio

            add_stock_to_db(symbol) # Add the stock to the database if it doesn't exist
            stock = Stock.query.filter_by(symbol=symbol).first() # Get the stock from the database

            d = datetime.date.fromtimestamp(date/1000.0)
            d=d.strftime('%Y-%m-%d')

            price = make_request('http://localhost:5000/data/price_on_day?ticker={}&end_date={}'.format(symbol, d)) # Get the price of the stock on the given date
            
            if buy:
                price = price['price']
            else:
                price = stock.latest_price

            time = datetime.date.fromtimestamp(int(date)/1000) # Convert the timestamp to a datetime object

            tx = Transaction(quantity=quantity, timestamp=time, buy=buy, stock=stock, price=price) 
            portfolio.transactions.append(tx) # Add the transaction to the user's portfolio
            
            
            # TODO: If selling we need to check that the user has enough shares to sell, for now its fine


            db.session.commit() # Commit the changes to the database

            return make_response(jsonify({'message': 'Transaction Added', 'statusCode': 200}))
        except Exception as error:
            print(error)
            abort(400)


@portfolio_bp.route('/get_holdings', methods=['GET'])
@auth_required
def get_holdings():
    if request.method == 'GET':
        try:
            resp = get_holdings_logic()
            return jsonify(resp.json)
        except Exception as error:
            print(error)
            abort(400)


@portfolio_bp.route('/timeseries', methods=['GET'])
@auth_required
def timeseries():
    if request.method == 'GET':
        try:
            # period = request.args.get('period').lower()
            end_date = datetime.datetime.today().strftime('%Y-%m-%d')
            # if period == '1w':
            #    days = timedelta(days=7)
            # elif period == '1mo':
            #     days = timedelta(days=30)
            # elif period == '6mo':
            #     days = timedelta(days=30*6)
            # elif period == '1y':
            #     days = timedelta(days=365)
            # elif period == '5y':
            #     days = timedelta(days=365*5)
            # elif period == 'max': # just doing 10 yrs for now idc anymore
            #     days = timedelta(days=365*10)
            # else: # 1yr by default
            #     days = timedelta(days=365)
            
            start_date = datetime.datetime.strptime(end_date, '%Y-%m-%d') - timedelta(days=90)
            start_date = start_date.strftime('%Y-%m-%d')
            # print(start_date, end_date)

            user = get_authenticated_user() # Get the user
            portfolio = user.portfolio # Get the user's portfolio]
            transactions = portfolio.transactions # Get the user's transactions

            # no transactions, no point in processing further
            if transactions.count() == 0:
                return make_response(jsonify(data=[], statusCode=200))

            holdings = {}
            date1=datetime.datetime.strptime(start_date, '%Y-%m-%d')
            date2=datetime.datetime.strptime(end_date, '%Y-%m-%d')
            day = datetime.timedelta(days=1)

            while date1 <= date2:
                txs = transactions.filter(Transaction.timestamp == date1).all() 
                
                # Get all transactions on the given date
                # we can eventually even filter by just specific stocks at certain times, etc...
                # could even add high, low, open, close, etc to get candle stick data
                for tx in txs:
                    if tx.buy:
                        if tx.stock.symbol in holdings:
                            holdings[tx.stock.symbol] += tx.quantity
                        else:
                            holdings[tx.stock.symbol] = tx.quantity
                    else:
                        if tx.stock.symbol in holdings:
                            holdings[tx.stock.symbol] -= tx.quantity  

                date1 += day

            # no holdings, no point in processing further
            if len(holdings) == 0:
                return make_response(jsonify(data=[], statusCode=200))

            tickers = [str(key) for key in holdings]
            raw = yf.download(tickers, start=start_date, end=end_date, group_by='tickers')

            # the way yf.download works, is that if there is more than 1 ticker, it will return a dataframe grouped
            # by the name of the ticker, otherwise it will return a dataframe with a single "row"
            # so we need to check if the dataframe is grouped or not
            data_cache = {}
            if len(tickers) > 1:
                for ticker in tickers:
                    data={}
                    ticker_data = raw[ticker]
                    ticker_data.reset_index(level=0, inplace=True)
                    ticker_data = ticker_data.to_dict(orient='records')
                    for entry in ticker_data:
                        data[entry['Date'].to_pydatetime().date().strftime('%Y-%m-%d')] = {
                            'open': entry['Open'],
                            'high': entry['High'],
                            'low': entry['Low'],
                            'close': entry['Close'],
                            'volume': entry['Volume'],
                            'adj_close': entry['Adj Close']
                        }
                    data_cache[ticker] = data
            else:
                data={}
                ticker_data = raw
                ticker_data.reset_index(level=0, inplace=True)
                ticker_data = ticker_data.to_dict(orient='records')
                for entry in ticker_data:
                    data[entry['Date'].to_pydatetime().date().strftime('%Y-%m-%d')] = {
                        'open': entry['Open'],
                        'high': entry['High'],
                        'low': entry['Low'],
                        'close': entry['Close'],
                        'volume': entry['Volume'],
                        'adj_close': entry['Adj Close']
                    }
                data_cache[tickers[0]] = data
    
            data=[]
            holdings = {}
            date1=datetime.datetime.strptime(start_date, '%Y-%m-%d')
            date2=datetime.datetime.strptime(end_date, '%Y-%m-%d')
            while date1 <= date2:
                value = 0

                txs = transactions.filter(Transaction.timestamp == date1).all()
                for tx in txs:
                    if tx.buy:
                        if tx.stock.symbol in holdings:
                            holdings[tx.stock.symbol] += tx.quantity
                        else:
                            holdings[tx.stock.symbol] = tx.quantity
                    else:
                        if tx.stock.symbol in holdings:
                            holdings[tx.stock.symbol] -= tx.quantity

                for stock in holdings:
                    curr_cache = data_cache[stock]

                    if stock not in data_cache:
                        print("Error: Stock {} not in price cache".format(stock))
                        abort(400)
                    
                    if date1.strftime('%Y-%m-%d') in curr_cache:
                        price = float(curr_cache[date1.strftime('%Y-%m-%d')]['close'])
                    else:
                        temp_date = date1 - day
                        while temp_date.strftime('%Y-%m-%d') not in curr_cache:
                            temp_date -= day
                        
                        price = float(curr_cache[temp_date.strftime('%Y-%m-%d')]['close'])

                    value += holdings[stock] * price

                data.append({'date' : date1.timestamp(), 
                            'open' : value,
                            'close' : value,
                            'high' : value,
                            'low' : value })   


                date1 = date1 + day

            
            # return make_response(jsonify(data=data, statusCode=200))
            return jsonify(data)

        except Exception as e:
            print(e)
            return make_response(jsonify(message='Something went wrong...', statusCode=400))


@portfolio_bp.route('/holdings_by_sector', methods=['GET'])
@auth_required
def holdings_by_sector():
    if request.method == 'GET':
        try:
            holdings = get_holdings_logic()
            holdings = holdings.json

            sector_data = {}
            for holding in holdings:
                if holding['sector'] not in sector_data:
                    sector_data[holding['sector']] = {
                        'sector': holding['sector'],
                        'value': holding['total_value']
                    }
                else:
                    sector_data[holding['sector']]['value'] += holding['total_value']


            data = []
            for sector in sector_data:
                data.append(sector_data[sector])

            return jsonify(data)
        except Exception as error:
            print(error)
            abort(400)


def get_holdings_logic():
    user = get_authenticated_user()  # Get the user
    portfolio = user.portfolio  # Get the user's portfolio
    transactions = portfolio.transactions  # Get the user's transactions

    # no transactions, no point in processing further
    if transactions.count() == 0:
        return make_response(jsonify(holdings=[], statusCode=200))

    # time to do it the dirty way
    holdings = {}
    for tx in transactions:
        if tx.buy:
            if tx.stock.symbol in holdings:
                holdings[tx.stock.symbol] += tx.quantity
            else:
                holdings[tx.stock.symbol] = tx.quantity
        else:  # sell
            if tx.stock.symbol in holdings:
                holdings[tx.stock.symbol] -= tx.quantity
                # shouldn't every allow them to sell more than they own so this is "fine"
                if holdings[tx.stock.symbol] == 0:
                    holdings.pop(tx.stock.symbol)

    # no holdings, no point in processing further
    if len(holdings) == 0:
        return make_response(jsonify(holdings=[], statusCode=200))

    data = []
    for stock in holdings:
        # TODO: (def not latest...) idk if this is the "latest" but for now its fine...
        s = Stock.query.filter_by(symbol=stock).first()

        data.append({
            'symbol': stock,
            'quantity': holdings[stock],
            'current_value': s.latest_price,
            'total_value': round(s.latest_price*holdings[stock], 2),
            'logo_url': s.logo_url,
            'industry': s.industry,
            'sector': s.sector,
            'company_name': s.company_name,
            'website': s.website,
        })

    return jsonify(data)


