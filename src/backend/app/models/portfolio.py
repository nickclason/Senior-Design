from app import db

from flask_sqlalchemy import SQLAlchemy


stocks = db.Table('stocks', 
    db.Column('portfolio_id', db.Integer, db.ForeignKey('portfolio.id')),
    db.Column('stock_id', db.Integer, db.ForeignKey('stock.id'))
)


class Portfolio(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    holdings = db.relationship('Stock', secondary=stocks, backref='portfolios')


    def __rep__(self):
        return f'<Portfolio {self.id}, user_id{self.user_id}>'

