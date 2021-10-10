from flask import Flask, jsonify, request, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return render_template("Welcome to the Flask Server")
    

@app.route("/hello-name", methods=['POST'])
def test_api():
    if request.method == 'POST':
        data = request.json
        name = "Hello, {}".format(data["name"])
        return jsonify(name)


if __name__ == "__main__":
    # app.run(host="0.0.0.0", port="5000", debug=True)
    app.run(debug=True)