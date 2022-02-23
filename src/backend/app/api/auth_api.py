from flask import abort, Blueprint, jsonify, make_response, request # Flask 
from flask_sqlalchemy import SQLAlchemy

from app import db # Database
from app.auth import * # Authentication
from app.models.user import User # User model
from app.models.portfolio import Portfolio # Portfolio model
from app.models.watchlist import Watchlist # Watchlist model

from hashlib import sha256 # Hashing



# Define authentication blueprint
auth_bp = Blueprint('/auth', __name__)

@auth_bp.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        try:
            email = request.json['email']
            plaintext_password = request.json['password']
            
            h = sha256()
            h.update(plaintext_password.encode('utf-8'))
            password = h.hexdigest()
            
            access_token, refresh_token = authenticate_user(email, password)

            return make_response(jsonify({'accessToken': access_token, 'refreshToken': refresh_token}))
        except AuthenticationError as error:
            print('authentication error: %s', error)
            abort(403)
    else: # GET
        return make_response(jsonify({'message': 'TODO: implement already logged in check'}))


@auth_bp.route("/register", methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        json_data = request.get_json()  # get data from POST request
        email = json_data['email']
        plaintext_password = json_data['password'] 
        firstName = json_data['firstName']
        lastName = json_data['lastName']

        user = User.query.filter_by(email=email).first()
        if user:
            return jsonify(message="Registration Failed: Email already exists")
        else:

            h = sha256()
            h.update(plaintext_password.encode('utf-8'))
            password = h.hexdigest()

            new_user = User(email, password, firstName, lastName, Portfolio(), Watchlist())            
            db.session.add(new_user)
            db.session.commit()
            
            return jsonify(message="Registration Successful")

    return jsonify(message="Registration Failed: Unknown cause")


@auth_bp.route("/logout", methods=['GET', 'POST'])
def logout():
    if request.method == 'POST':
        try:
            deauthenticate_user()
            return jsonify(message="Logout Successful")
        except AuthenticationError as error:
            print('authentication error: %s', error)
            abort(403)
    else:
        return make_response(jsonify({'message': 'TODO: implement something here'})) # TODO: implement something here idk what yet


@auth_bp.route('/refresh', methods=['POST'])
@auth_refresh_required
def refresh_api():
    try:
        access_token = refresh_authentication()
        return make_response(jsonify({'accessToken': access_token}))
    except AuthenticationError as error:
        print('authentication error %s', error)
        abort(403)


@auth_bp.route("/dashboard", methods=['GET'])
@auth_required
def dashboard():
    try:
        user = get_authenticated_user()

        return make_response(jsonify( {'email': user.email, 'firstName': user.firstName, 'lastName': user.lastName} ))
    except AuthenticationError as error:
        print('authentication error: %s', error)
        abort(403)
