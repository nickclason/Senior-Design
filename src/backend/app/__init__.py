from flask import Flask, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy 

# General Flask app
app = Flask(__name__)
app.secret_key = 'super secret key'

# Add CORS support
CORS(app)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

# Connect Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.sqlite3' # users is the table name?
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # turn off flask-sqlalchemy modification tracker

db = SQLAlchemy(app)

from app import api
