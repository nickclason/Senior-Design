from flask import *
from flask_sqlalchemy import SQLAlchemy

from app import app, db
from app.models.user import User

#
# TODO: Add authentication to /api/auth/login
# TODO: implement blueprints for the various API endpoints and create new files as needed
# TODO: Hash the passwords in the frontend, and store them in the database, when checking passwords for login, check if the hashes match.
# TODO: define a set of error codes to throw that the frontend can then react to in order to display the correct error message
# TODO: write a script to inject a bunch of test data into the db on creation
#


@app.route("/api")
def home():
    return jsonify(message="This is coming from the Flask API")


@app.route("/api/auth/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST': 
        json_data = request.get_json()
        email = json_data['email']
        password = json_data['password']

        # this SHOULD only return 1 user as we don't allow duplicate emails so i think it's safe for now
        user = User.query.filter_by(email=email, password=password).first()
        if user:
            db.session.add(user)
            db.session.commit()

            session['user'] = email

            return jsonify(message="Login successful")
        else:
            return jsonify(message="Login failed")
    else:
        if 'user' in session:
            return jsonify(message="Already logged in", id=session['user'])

        return jsonify(message="Not logged in")



@app.route("/api/auth/register", methods=['GET', 'POST'])
def register():
    if request.method == 'POST':

        json_data = request.get_json()  # get data from POST request
        email = json_data['email']
        password = json_data['password']
        firstName = json_data['firstName']
        lastName = json_data['lastName']

        user = User.query.filter_by(email=email).first()
        if user:
            return jsonify(message="Registration Failed: Email already exists")
        else:
            new_user = User(email, password, firstName, lastName)            
            db.session.add(new_user)
            db.session.commit()
            
            return jsonify(message="Registration Successful")

    return jsonify(message="Registration Failed: Unknown cause")


@app.route("/api/auth/logout", methods=['GET'])
def logout():
    session.pop('user')
    return jsonify({'result': 'Logout Successful'})


@app.route("/api/profile", methods=['GET'])
def view_users():
    if 'user' in session:
        resp = {"result": 200, "data": {"message": "TODO: add user profile data. this is their main dashboad", "id": session['user']}}
    else:                                                                                                                    
        resp = {"result": 401, "data": {"message": "user no login"}}
    
    return jsonify(**resp)

