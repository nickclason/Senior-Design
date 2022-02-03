from app import db

from flask_sqlalchemy import SQLAlchemy

class Stock(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(10), unique=True, nullable=False) # ticker symbol
    latest_price = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)

    # transaction_id = db.Column(db.Integer, db.ForeignKey('transaction.id'), nullable=False)

    def __init__(self, symbol, latest_price, timestamp):
        self.symbol = symbol
        self.latest_price = latest_price
        self.timestamp = timestamp

    def __repr__(self):
        return f'<Stock {self.symbol}>'