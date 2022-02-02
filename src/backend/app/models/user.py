from app import db

from flask_sqlalchemy import SQLAlchemy

#
# TODO: Add a time_registered field to the User table
# TODO: Add a time_last_login field to the User table
#

class User(db.Model):
    id = db.Column("id", db.Integer, primary_key=True)
    email = db.Column("email", db.String(254), unique=True, nullable=False)  # max email length is apparently 254 chars
    password = db.Column("password", db.String(32), nullable=False)
    firstName = db.Column("firstName", db.String(64), nullable=False)
    lastName = db.Column("lastName", db.String(64), nullable=False)

    portfolio = db.relationship('Portfolio', backref='user', uselist=False) # uselist=False means that there is only one portfolio per user (1:1 relationship)

    def __init__(self, email, password, firstName, lastName, portfolio):
        self.email = email
        self.password = password
        self.firstName = firstName
        self.lastName = lastName
        self.portfolio = portfolio

    def __repr__(self):
        return '<User %r>' % (self.email)