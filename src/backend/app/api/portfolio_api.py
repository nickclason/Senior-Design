from flask import abort, Blueprint, jsonify, make_response, request

from app import db
from app.auth import *
from app.env import *
from app.helper import *

from app.models.user import User
from app.models.portfolio import Portfolio
from app.models.stock import Stock
from app.models.transaction import Transaction

import datetime
from time import sleep

# '''
# Description:
#     Input: 
#     Output:
# '''
ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query?function='


# Define portfolio blueprint
portfolio_bp = Blueprint('/portfolio', __name__)

# 1. new transaction (buy or sell?)
#
# 2. check if stock exists, if not, create it
#
# I think thats it...???
# I think the workflow would be: add_stock --> add_transaction --> update_portfolio


# This should become "create_transaction"
@portfolio_bp.route('/create_transaction', methods=['POST'])
@auth_required
def add_holding():
    if request.method == 'POST':
        try:
            json_data = request.get_json()  # get data from POST request
            symbol = json_data['symbol'].upper()
            quantity = json_data['quantity']
            buy = True if json_data['buy'] == 1 else False
            date = json_data['date']
            print(date)

            user = get_authenticated_user() # Get the user
            portfolio = user.portfolio # Get the user's portfolio

            add_stock_to_db(symbol) # Add the stock to the database if it doesn't exist
            stock = Stock.query.filter_by(symbol=symbol).first() # Get the stock from the database

            price = make_request('http://localhost:5000/data/get_price_on_day?symbol={}&date={}'.format(symbol, int(date/1000.0))) # Get the price of the stock on the given date
            
            if buy:
                price = price['price']
            else:
                price = stock.latest_price

            time = datetime.date.fromtimestamp(int(date)/1000) # Convert the timestamp to a datetime object
            # new_time = datetime.datetime(time.year, time.month, time.day) # Create a new datetime object with the same date
            # print(new_time)
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
            user = get_authenticated_user() # Get the user
            portfolio = user.portfolio # Get the user's portfolio
            transactions = portfolio.transactions # Get the user's transactions

            # time to do it the dirty way
            holdings={}
            for tx in transactions:
                if tx.buy:
                    if tx.stock.symbol in holdings:
                        holdings[tx.stock.symbol] += tx.quantity
                    else:
                        holdings[tx.stock.symbol] = tx.quantity
                else: # sell
                    if tx.stock.symbol in holdings:
                        holdings[tx.stock.symbol] -= tx.quantity
                        if holdings[tx.stock.symbol] == 0: # shouldn't every allow them to sell more than they own so this is "fine"
                            holdings.pop(tx.stock.symbol)

            
            data = []
            for stock in holdings:
                curr_price = Stock.query.filter_by(symbol=stock).first().latest_price # idk if this is the "latest" but for now its fine...

                data.append({    
                    'symbol': stock,
                    'quantity': holdings[stock],
                    'current_value': curr_price, 
                    'total_value': curr_price*holdings[stock]
                })
                
            return make_response(jsonify({'holdings': data, 'statusCode': 200}))
        except Exception as error:
            print(error)
            abort(400)


@portfolio_bp.route('/get_timeseries', methods=['GET'])
@auth_required
def get_portfolio_timeseries():

    # Daily Portfolio Value
    if request.method == 'GET':
        # try:
            user = get_authenticated_user() # Get the user
            portfolio = user.portfolio
            transactions = portfolio.transactions


            data=[]
            date1 = datetime.datetime(2022, 1, 1, 0, 0, 0) # These should become inputs from the frontend
            date2 = datetime.datetime(2022, 2, 4, 0, 0, 0) # ^^^
            day = datetime.timedelta(days=1) # ^^^

            req_count = 0
            price_cache = {}
            while date1 < date2:

                url = ALPHA_VANTAGE_BASE_URL + 'TIME_SERIES_DAILY&symbol={}&apikey={}'
                txs = transactions.filter(Transaction.timestamp == date1).all()
                for tx in txs:
                    symbol = tx.stock.symbol
                    if symbol not in price_cache:

                        resp = make_request(url.format(symbol, ALPHA_VANTAGE_API_KEY) )
                        req_count+=1
                        
                        # I don't think this is the issue, its most likely an API limit problem actually, even caching
                        # like I am can't get around 5 calls/min limit
                        if 'Time Series (Daily)' in resp:
                            price_cache[symbol] = resp['Time Series (Daily)']
                        else:
                            price_cache[symbol] = resp['Time Series (Daily)	']
                        

                date1 += day

            date1 = datetime.datetime(2022, 1, 1, 0, 0, 0) # These should become inputs from the frontend
            date2 = datetime.datetime(2022, 2, 4, 0, 0, 0) # ^^^
            holdings = {}
            while date1 <= date2:
                value = 0

                txs = transactions.filter(Transaction.timestamp == date1).all() # Get all transactions on the given date
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
                            
          
                for stock in holdings:
                    if stock not in price_cache:
                        print("Error: Stock {} not in price cache".format(stock))
                        abort(400)
                    
                    if date1.strftime('%Y-%m-%d') in price_cache[stock]:
                        price = float(price_cache[stock][date1.strftime('%Y-%m-%d')]['4. close'])
                    else:
                        temp_date = date1 - day
                        while temp_date.strftime('%Y-%m-%d') not in price_cache[stock]:
                            temp_date -= day
                        
                        price = float(price_cache[stock][temp_date.strftime('%Y-%m-%d')]['4. close'])

                    value += holdings[stock] * price

                data.append({'date' : date1.timestamp(), 
                            'open' : value,
                            'close' : value,
                            'high' : value,
                            'low' : value })   


                date1 = date1 + day
                # sleep(5)
            
            return make_response(jsonify({'data': data, 'statusCode': 200}))


