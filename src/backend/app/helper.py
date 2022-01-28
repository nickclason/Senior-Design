# Assorted helper functions for the backend
import datetime

def convert_timeseries_daily_to_chart_data(timeseries):
    chart_data = []
    for date, values in timeseries['Time Series (Daily)'].items():
        chart_data.append({
            'date': datetime.datetime.strptime(date, '%Y-%m-%d').timestamp(),
            'open': values['1. open'],
            'high': values['2. high'],
            'low': values['3. low'],
            'close': values['4. close'],
            'volume': values['5. volume'],
        })
    return chart_data


def convert_timeseries_weekly_to_chart_data(timeseries):
    chart_data = []
    for x in timeseries['Weekly Time Series'].items():
        chart_data.append({
            'date': datetime.datetime.strptime(x[0], '%Y-%m-%d').timestamp(),
            'open': x[1]['1. open'],
            'high': x[1]['2. high'],
            'low': x[1]['3. low'],
            'close': x[1]['4. close'],
            'volume': x[1]['5. volume'],
        })
    return chart_data