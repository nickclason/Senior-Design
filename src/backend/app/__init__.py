from app.env import *
from os import path, environ

from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy 
from flask_jwt_extended import JWTManager



# General Flask app
app = Flask(__name__)
app.config.from_json(path.join('resources', 'config.json'))


# Set up JWT package
jwt = JWTManager(app)


# Add CORS support
CORS(app)
cors = CORS(app, resources={r"/*": {"origins": "*"}})


# Set up SQLAlchemy
db = SQLAlchemy(app)


# environ['APCA_API_KEY_ID'] = ALPACA_API_KEY
# environ['APCA_API_SECRET_KEY'] = ALPACA_SECRET_KEY


# Import and register all the routes
from .api import api, auth_api, portfolio_api, stocks_api
app.register_blueprint(api.api_bp, url_prefix='/api')
app.register_blueprint(auth_api.auth_bp, url_prefix='/auth')
app.register_blueprint(portfolio_api.portfolio_bp, url_prefix='/portfolio')
app.register_blueprint(stocks_api.stocks_bp, url_prefix='/stocks')


from app import errors
