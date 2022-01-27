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


environ['APCA_API_KEY_ID'] = ALPACA_API_KEY
environ['APCA_API_SECRET_KEY'] = ALPACA_SECRET_KEY


# Import all the routes
from .api import *
from app import errors
