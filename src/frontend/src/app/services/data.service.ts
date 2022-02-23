import { Injectable } from '@angular/core';


import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { WatchlistComponent } from '../watchlist/watchlist.component';


export interface Stock {
  symbol: string;
  quantity: number;
  current_value: number;
  total_value: number;
  website: string;
  industry: string;
  sector: string;
  logo_url: string;
  company_name: string;
}


export interface WatchStock {
  symbol: string;
  current_value: number;
  website: string;
  industry: string;
  sector: string;
  logo_url: string;
  company_name: string;
}

export interface TimePoint {
  close: number;
  date: number;
  high: number;
  low: number;
  open: number;
}

export interface Transaction {
  symbol: string;
  quantity: number;
  buy: number;
  date: number;
}

export interface AddWatch {
  symbol: string;
}

const HOLDINGS_API = environment.apiServer + '/portfolio/get_holdings';
const PORTFOLIO_CHART_API = environment.apiServer + '/portfolio/timeseries?start_date=2022-01-01&end_date=2022-02-22&interval=1d';
const CREATE_TRANSACTION_API = environment.apiServer + '/portfolio/create_transaction';
const GET_WATCHLIST_API = environment.apiServer + '/watchlist/get';
const ADD_WATCHLIST_API = environment.apiServer + '/watchlist/add';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getHoldings(): Observable<Stock[]> {
    const opts = { headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('accessToken')}) };
    const holdings = this.http.get<Stock[]>(HOLDINGS_API, opts);

    return holdings;
  }

  getChartData(): Observable<TimePoint[]> {
    const opts = { headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('accessToken')}) };
    const chartData = this.http.get<TimePoint[]>(PORTFOLIO_CHART_API, opts);

    return chartData;
  }

  postTransaction(transaction: Transaction): Observable<Transaction> {
    const opts = { headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('accessToken')}) };
    // this.http.post(CREATE_TRANSACTION_API, transaction, opts);

    return this.http.post<Transaction>(CREATE_TRANSACTION_API, transaction, opts);
  }

  getWatchlist(): Observable<WatchStock[]> {
    const opts = { headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('accessToken')}) };
    const watchlist = this.http.get<WatchStock[]>(GET_WATCHLIST_API, opts);

    return watchlist;
  }
  
  addToWatchlist(watch: AddWatch): Observable<AddWatch> {
    const opts = { headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('accessToken')}) };
    return this.http.post<AddWatch>(ADD_WATCHLIST_API, watch, opts);
  }
}
