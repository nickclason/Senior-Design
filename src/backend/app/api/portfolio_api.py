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


@portfolio_bp.route('/add_stock', methods=['POST'])
# @auth_required
def add_stock():
    if request.method == 'POST':
        json_data = request.get_json()  # get data from POST request
        symbol = json_data['symbol']

        resp = make_request('http://localhost:5000/data/get_quote?symbol=' + symbol.upper())
        latest_price = resp['quote'][0]['price']
        timestamp = datetime.datetime.fromtimestamp(resp['quote'][0]['latest_trading_day'])
        
        stock = Stock.query.filter_by(symbol=symbol.upper()).first()
        if stock:
            # update stock 
            
            stock.latest_price = latest_price
            stock.timestamp = timestamp

            db.session.commit()

            return jsonify(message="Stock already exists", statusCode=200)
        else:
            new_stock = Stock(symbol.upper(), latest_price, timestamp)
            db.session.add(new_stock)
            db.session.commit()
            return jsonify(message="Stock added", statusCode=200)

    else:
        abort(404)
