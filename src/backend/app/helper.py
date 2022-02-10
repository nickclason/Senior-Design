# Assorted helper functions for the backend
import datetime
import requests

from app import db
from app.models.stock import Stock

import yfinance as yf

# '''
# Description:

#     Input: 

#     Output:
# '''


def clean_results(results):
    cleaned = []
    
    for match in results['bestMatches']:
        cleaned.append({
            'symbol': match['1. symbol'],
            'name': match['2. name'],
            'type': match['3. type'],
            'region': match['4. region'],
            'currency': match['8. currency'],
            'match_score': match['9. matchScore']
        })


    return cleaned

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

####
def convert_time_str_to_epoch(time_str):
    '''
    Description: Helper function to convert a string of time into epoch time

        Input: time_str - string of the time to convert

        Output: epoch time
    '''

    return datetime.datetime.strptime(time_str, '%Y-%m-%d').timestamp()


####
def add_stock_to_db(symbol):
    '''
    Description: Helper function to add a stock to the database

        Input: stock - dictionary of the stock to add to the database
              db - database to add the stock to

        Output: True if successful, False otherwise
    '''
    try:
        stock = Stock.query.filter_by(symbol=symbol.upper()).first()
        if stock:

            # update stock         
            current_price = make_request('http://localhost:5000/data/current_price?{}'.format(symbol.upper()))['price']
            
            stock.latest_price = current_price
            stock.timestamp = datetime.datetime.now()
            db.session.commit()
            
            return True
        else:
            # TODO: Fix this for ETFS/Mutual Funds, don't add those to your portfolio right now pls
            ticker = yf.Ticker(symbol.upper())
            stats = ticker.stats()

            current_price = stats['financialData']['currentPrice']
            website = stats['summaryProfile']['website']
            idx = website.find('.') + 1
            logo_url = "https://logo.clearbit.com/{}".format(website[idx:])
            industry = stats['summaryProfile']['industry']
            sector = stats['summaryProfile']['sector']
            longName = stats['price']['longName']
            
            new_stock = Stock(symbol.upper(), current_price, datetime.datetime.now(), website,
                              industry, sector, logo_url, longName)

            db.session.add(new_stock)
            db.session.commit()
                
            return True

    except Exception as e:
        print(e)
        return False
