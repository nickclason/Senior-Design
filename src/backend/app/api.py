from flask import jsonify

from app import app

@app.route("/")
def home():
    return jsonify(message="This is coming from the Flask API")


@app.route("/auth/login", methods=['GET'])
def login():
    return jsonify(message="This message is from the Flask backend API: Login Successful")


@app.route("/auth/register", methods=['POST'])
def register():
    return "register"


@app.route("/auth/logout", methods=['GET'])
def logout():
    return "logout"
