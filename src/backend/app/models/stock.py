from app import db

from flask_sqlalchemy import SQLAlchemy

class Stock(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(10), unique=True, nullable=False) # ticker symbol
    latest_price = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    
    website = db.Column(db.String(256), nullable=False)
    industry = db.Column(db.String(256), nullable=False)
    sector = db.Column(db.String(256), nullable=False)
    logo_url = db.Column(db.String(256), nullable=False)
    company_name = db.Column(db.String(256), nullable=False)
    

    def __init__(self, symbol, latest_price, timestamp, website, industry, sector, logo_url, company_name):
        self.symbol = symbol
        self.latest_price = latest_price
        self.timestamp = timestamp
        self.website = website
        self.industry = industry
        self.sector = sector
        self.logo_url = logo_url
        self.company_name = company_name


    def __repr__(self):
        return f'<Stock {self.symbol}>'



