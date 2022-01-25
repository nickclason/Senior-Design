
import requests

from flask import Flask, jsonify, make_response, abort, request
from flask_sqlalchemy import SQLAlchemy
from hashlib import sha256

from app import app, db
from app.auth import authenticate_user, deauthenticate_user,  refresh_authentication, get_authenticated_user, auth_required, auth_refresh_required, AuthenticationError
from app.env import *
from app.models.user import User


# Verify API works
@app.route("/api")
def home():
    return jsonify(message="This is coming from the Flask API")


@app.route("/api/auth/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        try:
            email = request.json['email']
            plaintext_password = request.json['password']
            
            h = sha256()
            h.update(plaintext_password.encode('utf-8'))
            password = h.hexdigest()
            
            access_token, refresh_token = authenticate_user(email, password)

            return make_response(jsonify({'accessToken': access_token, 'refreshToken': refresh_token}))
        except AuthenticationError as error:
            print('authentication error: %s', error)
            abort(403)
    else: # GET
        return make_response(jsonify({'message': 'TODO: implement already logged in check'}))


@app.route("/api/auth/register", methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        json_data = request.get_json()  # get data from POST request
        email = json_data['email']
        plaintext_password = json_data['password'] 
        firstName = json_data['firstName']
        lastName = json_data['lastName']

        user = User.query.filter_by(email=email).first()
        if user:
            return jsonify(message="Registration Failed: Email already exists")
        else:

            h = sha256()
            h.update(plaintext_password.encode('utf-8'))
            password = h.hexdigest()

            new_user = User(email, password, firstName, lastName)            
            db.session.add(new_user)
            db.session.commit()
            
            return jsonify(message="Registration Successful")

    return jsonify(message="Registration Failed: Unknown cause")


@app.route("/api/auth/logout", methods=['GET', 'POST'])
def logout():
    if request.method == 'POST':
        try:
            deauthenticate_user()
            return jsonify(message="Logout Successful")
        except AuthenticationError as error:
            print('authentication error: %s', error)
            abort(403)
    else:
        return make_response() # TODO: implement something here idk what yet


@app.route('/api/auth/refresh', methods=['POST'])
@auth_refresh_required
def refresh_api():
    try:
        access_token = refresh_authentication()
        return make_response(jsonify({'accessToken': access_token}))
    except AuthenticationError as error:
        print('authentication error %s', error)
        abort(403)


@app.route("/api/profile", methods=['GET'])
@auth_required
def view_users():
    try:
        user = get_authenticated_user()
        return make_response(jsonify( {'email': user.email, 'firstName': user.firstName, 'lastName': user.lastName} ))
    except AuthenticationError as error:
        print('authentication error: %s', error)
        abort(403)


######################################################
## This stuff should probably be in a separate file ##
######################################################
@app.route("/api/stocks/validate_ticker", methods=['GET'])
def validate_ticker():
    if request.method == 'GET':
        ticker = request.args.get('ticker')
        if ticker is None:
            abort(400)
        else:
            try:
                url = 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords={}&apikey={}'.format(ticker.upper(), ALPHA_VANTAGE_API_KEY) # search endpoint
                r = requests.get(url)
                data = r.json()

                for symbol in data['bestMatches']:
                    if symbol['1. symbol'] == ticker.upper():
                        return jsonify(message="Valid Ticker", symbol=symbol, statusCode = 200)
                
                abort(400)

            except Exception as e:
                print(e)
                abort(400)
    else:
        abort(400)


# Useful endpoints
                # ts = TimeSeries(key=os.environ["ALPHAVANTAGE_API_KEY"], indexing_type='date')
                # data, meta_data = ts.get_intraday(symbol=ticker.upper(), interval='1min')

                # ts = TimeSeries(key=app.ALPHAVANTAGE_API_KEY, indexing_type='integer')
                # data, meta_data = ts.get_intraday(symbol=ticker.upper(), interval='1min', outputsize='full')

                # pprint(data.head(2))
                # pprint(data)
                
                # url = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={}&apikey={}'.format(ticker.upper(), os.environ["ALPHAVANTAGE_API_KEY"]) # basic data