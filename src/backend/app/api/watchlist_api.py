from flask import abort, Blueprint, jsonify, make_response, request

from app import db
from app.auth import *
from app.env import *
from app.helper import *

from app.models.stock import Stock



# Define watchlist blueprint
watchlist_bp = Blueprint('/watchlist', __name__)

@watchlist_bp.route('/add', methods=['POST'])
@auth_required
def add_to_watchlist():
    if request.method == 'POST':
        try:
            json_data = request.get_json()  # get data from POST request
            symbol = json_data['symbol'].upper()

            user = get_authenticated_user() # Get the user
            watchlist = user.watchlist # Get the user's watchlist

            add_stock_to_db(symbol) # Add the stock to the database if it doesn't exist
            stock = Stock.query.filter_by(symbol=symbol).first() # Get the stock from the database

            watchlist.watch_stocks.append(stock) # Add the stock to the user's watchlist
        
            db.session.commit() # Commit the changes to the database

            return make_response(jsonify({'message': 'Watch Added', 'statusCode': 200}))
        except Exception as error:
            print(error)
            abort(400)

@watchlist_bp.route('/get', methods=['GET'])
@auth_required
def get_watchlist():
    if request.method == 'GET':
        try:
            user = get_authenticated_user() # Get the user
            watchlist = user.watchlist.watch_stocks # Get the user's portfolio

            data = []
            for stock in watchlist:
                s = Stock.query.filter_by(id=stock.id).first() # TODO: (def not latest...) idk if this is the "latest" but for now its fine...

                data.append({    
                    'symbol': s.symbol,
                    'current_value': round(s.latest_price, 2),
                    'logo_url': s.logo_url,
                    'industry': s.industry,
                    'sector': s.sector,
                    'company_name': s.company_name,
                    'website': s.website,
                })

            return jsonify(data)
        except Exception as error:
            print(error)
            abort(400)


@watchlist_bp.route('/remove', methods=['POST'])
@auth_required
def remove_from_watchlist():
    if request.method == 'POST':
        try:
            json_data = request.get_json()  # get data from POST 
            symbol = json_data['symbol'].upper()

            user = get_authenticated_user() # Get the user
            watchlist = user.watchlist # Get the user's watchlist

            stock = Stock.query.filter_by(symbol=symbol).first() # Get the stock from the database

            watchlist.watch_stocks.remove(stock) # Remove the stock from the user's watchlist

            db.session.commit() # Commit the changes to the database

            return make_response(jsonify({'message': 'Watch Removed', 'statusCode': 200}))
        except Exception as error:
            print(error)
            abort(400)