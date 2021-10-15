from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo


app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/myDatabase"
mongo = PyMongo(app)
CORS(app)

@app.route("/")
def home():
    return "home"


@app.route("/auth/login", methods=['GET'])
def login():
    return "login"


@app.route("/auth/register", methods=['POST'])
def register():
    return "register"


@app.route("/auth/logout", methods=['GET'])
def logout():
    return "logout"


if __name__ == "__main__":
    # app.run(host="0.0.0.0", port="5000", debug=True)
    app.run(debug=True)