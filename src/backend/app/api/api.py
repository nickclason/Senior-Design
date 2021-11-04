from logging import error
from os import access
from flask import Flask, jsonify, make_response, abort, request
from flask_sqlalchemy import SQLAlchemy

from app.auth import authenticate_user, deauthenticate_user,  refresh_authentication, get_authenticated_user, auth_required, auth_refresh_required, AuthenticationError
from app import app, db
from app.models.user import User

#
# TODO: implement blueprints for the various API endpoints and create new files as needed
# TODO: Hash the passwords in the frontend, and store them in the database, when checking passwords for login, check if the hashes match.
# TODO: define a set of error codes to throw that the frontend can then react to in order to display the correct error message
# TODO: write a script to inject a bunch of test data into the db on creation
# TODO: write some documentation explaining how the auth process works
#


# Verify API works
@app.route("/api")
def home():
    return jsonify(message="This is coming from the Flask API")


@app.route("/api/auth/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        try:
            email = request.json['email']
            password = request.json['password']
            access_token, refresh_token = authenticate_user(email, password)

            return make_response(jsonify({'accessToken': access_token, 'refreshToken': refresh_token}))
        except AuthenticationError as error:
            print('authentication error: %s', error)
            abort(403)
    else: # GET
        return make_response(jsonify({'message': 'TODO: implement already logged in check'}))


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


# @app.route("/api/auth/logout", methods=['GET'])
@app.route("/api/auth/logout", methods=['GET', 'POST'])
def logout():
    deauthenticate_user()
    return make_response()


@app.route('/api/auth/refresh', methods=['POST'])
@auth_refresh_required
def refresh_api():
    try:
        access_token = refresh_authentication()
        return make_response(jsonify({'accessToken': access_token}))
    except AuthenticationError as error:
        print('authentication error %s', error)
        abort(403)


@app.route("/api/profile", methods=['GET'])
@auth_required
def view_users():
    try:
        user = get_authenticated_user()
        return make_response(jsonify( {'email': user.email, 'firstName': user.firstName, 'lastName': user.lastName} ))
    except AuthenticationError as error:
        print('authentication error: %s', error)
        abort(403)