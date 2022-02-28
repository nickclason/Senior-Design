from app.env import *
from os import path

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


# Import and register all the routes
from .api import api, auth_api, data_api, portfolio_api, watchlist_api, prediction_api
app.register_blueprint(api.api_bp, url_prefix='/api')
app.register_blueprint(auth_api.auth_bp, url_prefix='/auth')
app.register_blueprint(portfolio_api.portfolio_bp, url_prefix='/portfolio')
app.register_blueprint(data_api.data_bp, url_prefix='/data')
app.register_blueprint(watchlist_api.watchlist_bp, url_prefix='/watchlist')
app.register_blueprint(prediction_api.prediction_bp, url_prefix='/prediction')

from app import errors
