from app import db

from flask_sqlalchemy import SQLAlchemy

class User(db.Model):
    _id = db.Column("id", db.Integer, primary_key=True)

    email = db.Column("email", db.String(254))  # max email length is apparently 254 chars
    username = db.Column("username", db.String(16))  # other params??? unique=True, nullable=False)
    password = db.Column("password", db.String(32))

    # collect gender, age, relationship status, mothers maiden name, ssn, etc. for maximum data mining

    def __init__(self, email, username, password):
        self.email = email
        self.username = username
        self.password = password  # need to hash this shit later
