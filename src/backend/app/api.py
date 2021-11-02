from flask import *
from flask_sqlalchemy import SQLAlchemy

from app import app, db
from app.models.user import User


@app.route("/api")
def home():
    return jsonify(message="This is coming from the Flask API")


@app.route("/api/auth/login", methods=['GET'])
def login():
    # print(session)
    # if "user" in session:
    #     return jsonify(message="You are already logged in")
    # else:
    #     return jsonify(message="You are not logged in")

    return jsonify(message="This is the login API")


@app.route("/api/auth/register", methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        session.permanent = True

        json_data = request.get_json()  # get data from POST request
        email = json_data['email']
        password = json_data['password']
        firstName = json_data['firstName']
        lastName = json_data['lastName']

        usr = {'email': email, 'password': password, 'firstName': firstName, 'lastName': lastName}
        # session['user'] = usr
        # print(session)

        found_email = User.query.filter_by(email=email).first()
        if found_email:
            return jsonify(message="Email already exists")
        else:
            usr = User(email, password, firstName, lastName)
            
            db.session.add(usr)
            db.session.commit() # save to database
            
            return jsonify(message="Registration Successful")  # this is just a placeholder, it should redirect to home or user page somehow
    # else:
    #     if "user" in session:
    #         flash("You are already logged in")
    #         return jsonify(message="Registration Unsuccessful: TODO: Redirect/send redirect code to frontend?")

    return jsonify(message="Registration Unsuccessful: TODO: Redirect/send redirect code to frontend?")


@app.route("/api/auth/logout", methods=['GET'])
def logout():
    return "logout"


# test to see if db is working
# @app.route("/api/view_users", methods=['GET'])
# def view_users():
#     users_data = User.query.all()

#     for user in users_data:
#         print(user.email)
#         print(user.password)

#     return jsonify(message="View Users Successful")


