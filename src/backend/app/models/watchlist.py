from app import db

from flask_sqlalchemy import SQLAlchemy


watch_stocks = db.Table('watch_stocks',
    db.Column('watchlist_id', db.Integer, db.ForeignKey('watchlist.id')),
    db.Column('stock_id', db.Integer, db.ForeignKey('stock.id'))
)

class Watchlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    watch_stocks = db.relationship('Stock', secondary=watch_stocks, backref='watchlist', lazy='dynamic')


    def __rep__(self):
        return f'<Watchlist {self.id}, user_id{self.user_id}>'