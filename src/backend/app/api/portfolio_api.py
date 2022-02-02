from flask import abort, Blueprint, jsonify, make_response, request

from app import db
from app.auth import *
from app.env import *
from app.helper import *

from app.models.user import User
from app.models.portfolio import Portfolio
from app.models.stock import Stock

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
@portfolio_bp.route('/add_holding', methods=['POST'])
@auth_required
def add_holding():
    if request.method == 'POST':
        try:
            json_data = request.get_json()  # get data from POST request
            print(json_data)
            symbol = json_data['symbol'].upper()
            # quantity = json_data['quantity'] # TODO: implement with TX's
            # price = json_data['price'] # TODO: implement with TX's

            user = get_authenticated_user() # Get the user
            portfolio = user.portfolio # Get the user's portfolio

            # could make this more logical (if stock exists add it, if not then add to db)
            add_stock_to_db(symbol) # Add the stock to the database if it doesn't exist
            stock = Stock.query.filter_by(symbol=symbol).first() # Get the stock from the database

            portfolio.holdings.append(stock) # Add the stock to the user's portfolio
            db.session.commit() # Commit the changes to the database

            print(portfolio.holdings)

            return make_response(jsonify({'message': 'TODO: implement add_holding', 'statusCode': 200}))
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

            holdings = []
            for holding in portfolio.holdings:
                holdings.append({
                    'symbol': holding.symbol,
                    'price': holding.latest_price,
                    # 'quantity': holding.quantity, # TODO: implement with TX's
                    
                })

            return make_response(jsonify({'holdings': holdings, 'statusCode': 200}))
        except Exception as error:
            print(error)
            abort(400)