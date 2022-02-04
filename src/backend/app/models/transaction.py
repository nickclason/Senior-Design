from app import db

from flask_sqlalchemy import SQLAlchemy


class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    
    quantity = db.Column(db.Float, nullable=False)
    price = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    buy = db.Column(db.Boolean, nullable=False)

    stock_id = db.Column(db.Integer, db.ForeignKey('stock.id'))
    stock = db.relationship("Stock")

    def __init__(self, quantity, timestamp, buy, stock, price):
        self.quantity = quantity
        self.price = price
        self.timestamp = timestamp
        self.buy = buy
        self.stock = stock
        

    
    def __repr__(self):
        return f'<Transaction:{self.id}, BUY:{self.buy}. stock:{self.stock}, quantity:{self.quantity}, price:{self.price}, date:{self.timestamp}>'
