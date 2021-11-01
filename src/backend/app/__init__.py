from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy 

app = Flask(__name__)
app.secret_key = 'super secret key'

CORS(app)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.sqlite3' # users is the table name?
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # turn off flask-sqlalchemy modification tracker

db = SQLAlchemy(app)

from app import api
