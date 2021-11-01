from flask import *
from flask_sqlalchemy import SQLAlchemy

from app import app, db
from app.models.user import User


@app.route("/api")
def home():
    return jsonify(message="This is coming from the Flask API")


@app.route("/api/auth/login", methods=['GET'])
def login():
    return jsonify(message="Login Successful")


@app.route("/api/auth/register", methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        session.permanent = True

        json_data = request.get_json()  # get data from POST request
        email = json_data['email']
        username = json_data['username']
        password = json_data['password']
        firstName = json_data['firstName']
        lastName = json_data['lastName']

        usr = {'email': email, 'username': username, 'password': password, 'firstName': firstName, 'lastName': lastName}
        session['user'] = usr

        found_username = User.query.filter_by(username=username).first()
        found_email = User.query.filter_by(email=email).first()
        if found_username:
            return jsonify(message="Username already exists")
        elif found_email:
            return jsonify(message="Email already exists")
        else:
            usr = User(email, username, password, firstName, lastName)
            
            db.session.add(usr)
            db.session.commit() # save to database
            
            return jsonify(message="Registration Successful")  # this is just a placeholder, it should redirect to home or user page
    else:
        if "user" in session:
            flash("You are already logged in")
            return jsonify(message="Registration Unsuccessful: TODO: Redirect/send redirect code to frontend?")

        return jsonify(message="Registration Unsuccessful: TODO: Redirect/send redirect code to frontend?")



@app.route("/api/auth/logout", methods=['GET'])
def logout():
    return "logout"
