from flask import *
from flask_sqlalchemy import SQLAlchemy

from app import app, db
from app.models.user import User

#
# TODO: implement blueprints for the various API endpoints and create new files as needed
# TODO: Hash the passwords in the frontend, and store them in the database, when checking passwords for login, check if the hashes match.
# TODO: define a set of error codes to throw that the frontend can then react to in order to display the correct error message
# TODO: write a script to inject a bunch of test data into the db on creation
#


@app.route("/api")
def home():
    return jsonify(message="This is coming from the Flask API")


@app.route("/api/auth/login", methods=['POST'])
def login():
    json_data = request.get_json()
    user = User.query.filter_by(email=json_data['email']).first()
    
    if user and (user.password == json_data['password']):
        session['logged_in'] = True
        status = True
    else:
        status = False
    
    return jsonify({'result': status})


@app.route("/api/auth/register", methods=['POST', 'GET'])
def register():
    if request.method == 'POST':

        json_data = request.get_json()  # get data from POST request
        email = json_data['email']
        password = json_data['password']
        firstName = json_data['firstName']
        lastName = json_data['lastName']

        found_email = User.query.filter_by(email=email).first()
        if found_email:
            return jsonify(message="Registration Failed: Email already exists")
        else:
            new_user = User(email, password, firstName, lastName)            
            db.session.add(new_user)
            db.session.commit()
            
            return jsonify(message="Registration Successful")
    # else:  # GET request
    #     if "user" in session:
    #         flash("You are already logged in")
    #         return jsonify(message="Registration Unsuccessful)

    return jsonify(message="Registration Failed: Unknown cause")


@app.route("/api/auth/logout", methods=['GET'])
def logout():
    session.pop('logged_in', None)
    return jsonify({'result': 'success'})



# test to see if db is working
# @app.route("/api/view_users", methods=['GET'])
# def view_users():
#     users_data = User.query.all()

#     for user in users_data:
#         print(user.email)
#         print(user.password)

#     return jsonify(message="View Users Successful")

