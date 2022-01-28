# Assorted helper functions for the backend
import datetime
import requests

# '''
# Description:

#     Input: 

#     Output:
# '''



def convert_timeseries_intraday_to_chart_data(timeseries, interval):
    chart_data = []
    for x in timeseries['Time Series ({})'.format(interval)].items():
        chart_data.append({
            'date': datetime.datetime.strptime(x[0], '%Y-%m-%d %H:%M:%S').timestamp(),
            'open': x[1]['1. open'],
            'high': x[1]['2. high'],
            'low': x[1]['3. low'],
            'close': x[1]['4. close'],
            'volume': x[1]['5. volume'],
        })

    return chart_data

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

def convert_timeseries_weekly_to_chart_data(timeseries, adjusted=False):
    chart_data = []

    if adjusted:
        for x in timeseries['Weekly Adjusted Time Series'].items():
            chart_data.append({
                'date': datetime.datetime.strptime(x[0], '%Y-%m-%d').timestamp(),
                'open': x[1]['1. open'],
                'high': x[1]['2. high'],
                'low': x[1]['3. low'],
                'close': x[1]['4. close'],
                'adjusted_close': x[1]['5. adjusted close'],
                'volume': x[1]['6. volume'],
                'dividend_amount': x[1]['7. dividend amount']
            })
        return chart_data

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

def convert_timeseries_monthly_to_chart_data(timeseries, adjusted=False):
    chart_data = []
    
    if adjusted:
        for x in timeseries['Monthly Adjusted Time Series'].items():
            chart_data.append({
                'date': datetime.datetime.strptime(x[0], '%Y-%m-%d').timestamp(),
                'open': x[1]['1. open'],
                'high': x[1]['2. high'],
                'low': x[1]['3. low'],
                'close': x[1]['4. close'],
                'adjusted_close': x[1]['5. adjusted close'],
                'volume': x[1]['6. volume'],
                'dividend_amount': x[1]['7. dividend amount']
            })
        return chart_data


    for x in timeseries['Monthly Time Series'].items():
        chart_data.append({
            'date': datetime.datetime.strptime(x[0], '%Y-%m-%d').timestamp(),
            'open': x[1]['1. open'],
            'high': x[1]['2. high'],
            'low': x[1]['3. low'],
            'close': x[1]['4. close'],
            'volume': x[1]['5. volume'],
        })
    return chart_data


def convert_timeseries_to_chartdata(timeseries, function, interval):
    '''
    Description: Helper function to assist in converting all data into a single format, using epoch time
   
    Input: timeseries - json data from alpha vantage endpoints
          function - string of the function to use for the data
          interval - string of the interval to use for the data

    Output: chart_data - list of dictionaries, each dictionary is a single data point for the given function '''

    if function == 'INTRADAY':
        return convert_timeseries_intraday_to_chart_data(timeseries, interval)
    elif function == 'DAILY':
        return convert_timeseries_daily_to_chart_data(timeseries)
    elif function == 'WEEKLY':
        return convert_timeseries_weekly_to_chart_data(timeseries)
    elif function == 'WEEKLY_ADJUSTED':
        return convert_timeseries_weekly_to_chart_data(timeseries, True)
    elif function == 'MONTHLY':
        return convert_timeseries_monthly_to_chart_data(timeseries)
    elif function == 'MONTHLY_ADJUSTED':
        return convert_timeseries_monthly_to_chart_data(timeseries, True)
    
    return None


def make_request(url):
    '''
    Description: Handle making requests

        Input: url - string of the url to make the request to

        Output: json data from the request
    '''

    try:
        r = requests.get(url)
        if r.status_code != 200:
            raise Exception("Invalid Response")
        return r.json()
    except Exception as e:
        print(e)
        return None


