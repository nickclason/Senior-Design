from app import db

from flask_sqlalchemy import SQLAlchemy

class User(db.Model):
    _id = db.Column("id", db.Integer, primary_key=True)

    email = db.Column("email", db.String(254))  # max email length is apparently 254 chars
    password = db.Column("password", db.String(32))
    firstName = db.Column("firstName", db.String(64))
    lastName = db.Column("lastName", db.String(64))

    def __init__(self, email, password, firstName, lastName):
        self.email = email
        self.password = password  # need to hash this shit later if we really care
        self.firstName = firstName
        self.lastName = lastName
