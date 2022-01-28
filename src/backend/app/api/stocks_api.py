from flask import abort, Blueprint, jsonify, make_response, request

from app.env import *
from app.helper import *

import requests


# Define stock data blueprint
stocks_bp = Blueprint('/stocks', __name__)


# We could make this much more general, but for now, we'll just create 
# a route for each time series time frame we want to track.
@stocks_bp.route("/get_timeseries_daily", methods=['GET'])
def get_timeseries_daily():
    if request.method == 'GET':
        ticker = request.args.get('ticker')
        if ticker is None:
            abort(400)
        else:
            try:
                # outputsize=compact/full, compact=100 datapoints, full=20+ yrs of data
                url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={}&apikey={}'.format(ticker.upper(), ALPHA_VANTAGE_API_KEY)
                r = requests.get(url)
                raw = r.json()

                chart_data = convert_timeseries_daily_to_chart_data(raw)

                return make_response(jsonify(message="Valid Ticker", statusCode = 200, chartData=chart_data))

            except Exception as e:
                print(e)
                abort(400)


@stocks_bp.route("/get_timeseries_weekly", methods=['GET'])
def get_timeseries_weekly():
    if request.method == 'GET':
        ticker = request.args.get('ticker')
        if ticker is None:
            abort(400)
        else:
            try:
                # outputsize=compact/full, compact=100 datapoints, full=20+ yrs of data
                url = 'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol={}&apikey={}'.format(ticker.upper(), ALPHA_VANTAGE_API_KEY)
                r = requests.get(url)
                raw = r.json()
                chart_data = convert_timeseries_weekly_to_chart_data(raw)

                return make_response(jsonify(message="Valid Ticker", statusCode = 200, chartData=chart_data))

            except Exception as e:
                print(e)
                abort(400)