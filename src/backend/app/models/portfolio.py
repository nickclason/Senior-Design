from app import db

from flask_sqlalchemy import SQLAlchemy


transactions = db.Table('transactions',
    db.Column('portfolio_id', db.Integer, db.ForeignKey('portfolio.id')),
    db.Column('transaction_id', db.Integer, db.ForeignKey('transaction.id'))
)

class Portfolio(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    transactions = db.relationship('Transaction', secondary=transactions, backref='portfolio', lazy='dynamic')


    def __rep__(self):
        return f'<Portfolio {self.id}, user_id{self.user_id}>'

