from flask import Blueprint, jsonify


# define main api blueprint - this is mainly going to be used just for testing
# or very general/simple endpoints
#
api_bp = Blueprint('api', __name__)


@api_bp.route('/', methods=['GET'])
def api():
    return jsonify(statusCode=200, message='This message is coming from the Flask API')


@api_bp.route('/api_test', methods=['GET'])
def test_api():
    return jsonify(statusCode=200, message='This message is coming from the api/api_test endpoint')
