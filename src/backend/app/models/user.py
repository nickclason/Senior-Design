from app import db

from flask_sqlalchemy import SQLAlchemy

#
# TODO: Add a time_registered field to the User table
# TODO: Add a time_last_login field to the User table
#

class User(db.Model):
    id = db.Column("id", db.Integer, primary_key=True)
    email = db.Column("email", db.String(254), unique=True)  # max email length is apparently 254 chars
    password = db.Column("password", db.String(32))
    firstName = db.Column("firstName", db.String(64))
    lastName = db.Column("lastName", db.String(64))

    def __init__(self, email, password, firstName, lastName):
        self.email = email
        self.password = password
        self.firstName = firstName
        self.lastName = lastName

    def __repr__(self):
        return '<User %r>' % (self.email)