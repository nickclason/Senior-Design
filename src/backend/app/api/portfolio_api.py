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

# '''
# Description:
#     Input: 
#     Output:
# '''


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
         

            user = get_authenticated_user() # Get the user
            portfolio = user.portfolio # Get the user's portfolio

            add_stock_to_db(symbol) # Add the stock to the database if it doesn't exist
            stock = Stock.query.filter_by(symbol=symbol).first() # Get the stock from the database

            price = make_request('http://localhost:5000/data/get_price_on_day?symbol={}&date={}'.format(symbol, date)) # Get the price of the stock on the given date
            price = price['price']

            tx = Transaction(quantity=quantity, timestamp=datetime.datetime.fromtimestamp(int(date)/1000), buy=buy, stock=stock, price=price) 
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