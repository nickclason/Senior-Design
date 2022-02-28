import { Injectable } from '@angular/core';


import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { WatchlistComponent } from '../watchlist/watchlist.component';
import { map } from 'rxjs/operators';

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

export interface SectorData {
  sector: string;
  value: number;
}

const HOLDINGS_API = environment.apiServer + '/portfolio/get_holdings';
const PORTFOLIO_CHART_API = environment.apiServer + '/portfolio/timeseries?start_date=2022-01-01&end_date=2022-02-22&interval=1d';
const CREATE_TRANSACTION_API = environment.apiServer + '/portfolio/create_transaction';
const GET_WATCHLIST_API = environment.apiServer + '/watchlist/get';
const ADD_WATCHLIST_API = environment.apiServer + '/watchlist/add';
const DELETE_WATCHLIST_API = environment.apiServer + '/watchlist/remove';
const SECTOR_CHART_API = environment.apiServer + '/portfolio/holdings_by_sector';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  private dataStore: { watchlist: WatchStock[], 
                       holdings: Stock[],
                       portfolioChartData: TimePoint[],
                       sectorChartData: SectorData[] } = { watchlist: [], holdings: [], portfolioChartData: [], sectorChartData: []};


  private _watchlist = new BehaviorSubject<WatchStock[]>([]);
  readonly watchlist$ = this._watchlist.asObservable();

  private _holdings = new BehaviorSubject<Stock[]>([]);
  readonly holdings$ = this._holdings.asObservable();

  private _portfolioChartData = new BehaviorSubject<TimePoint[]>([]);
  readonly portfolioChartData$ = this._portfolioChartData.asObservable();

  private _sectorChartData = new BehaviorSubject<SectorData[]>([]);
  readonly sectorChartData$ = this._sectorChartData.asObservable();

  constructor(private http: HttpClient) { }



  getWatchlistData() {
    return this._watchlist.asObservable();
  }

  loadWatchlist() {
    const opts = { headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('accessToken')}) };

    this.http.get<WatchStock[]>(GET_WATCHLIST_API, opts).subscribe(
      data => {
        this.dataStore.watchlist = data;
        this._watchlist.next(Object.assign({}, this.dataStore).watchlist);
      },
      error => console.log('Could not load watchlist.')
    );
  }

  addToWatchlist(watch: AddWatch): Observable<AddWatch> {
    const opts = { headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('accessToken')}) };
    return this.http.post<AddWatch>(ADD_WATCHLIST_API, watch, opts);
  }

  getHoldingsData() {
    return this._holdings.asObservable();
  }

  loadHoldings() {
    const opts = { headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('accessToken')}) };

    this.http.get<Stock[]>(HOLDINGS_API, opts).subscribe(
      data => {
        this.dataStore.holdings = data;
        this._holdings.next(Object.assign({}, this.dataStore).holdings);
      },
      error => console.log('Could not load holdings.')
    );
  }

  postTransaction(transaction: Transaction): Observable<Transaction> {
    const opts = { headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('accessToken')}) };
    // this.http.post(CREATE_TRANSACTION_API, transaction, opts);

    return this.http.post<Transaction>(CREATE_TRANSACTION_API, transaction, opts);
  }

  getPortfolioChartData() {
    return this._portfolioChartData.asObservable();
  }

  loadPortfolioChartData() {
    const opts = { headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('accessToken')}) };

    this.http.get<TimePoint[]>(PORTFOLIO_CHART_API, opts).subscribe(
      data => {
        this.dataStore.portfolioChartData = data;
        this._portfolioChartData.next(Object.assign({}, this.dataStore).portfolioChartData);
      },
      error => console.log('Could not load portfolio chart data.')
    );
  }

  getSectorChartData() {
    return this._sectorChartData.asObservable();
  }

  loadSectorChartData() {
    const opts = { headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('accessToken')}) };

    this.http.get<SectorData[]>(SECTOR_CHART_API, opts).subscribe(
      data => {
        this.dataStore.sectorChartData = data;
        this._sectorChartData.next(Object.assign({}, this.dataStore).sectorChartData);
      },
      error => console.log('Could not load sector chart data.')
    );
  }

  removeFromWatchlist(watch: AddWatch) {
    const opts = { headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('accessToken')})};
    return this.http.post(DELETE_WATCHLIST_API, watch, opts).subscribe();
  }

  
  clearAll() {
    this.dataStore.watchlist = [];
    this.dataStore.holdings = [];
    this.dataStore.portfolioChartData = [];
    this.dataStore.sectorChartData = [];

    this._watchlist.next(Object.assign({}, this.dataStore).watchlist);
    this._holdings.next(Object.assign({}, this.dataStore).holdings);
    this._portfolioChartData.next(Object.assign({}, this.dataStore).portfolioChartData);
    this._sectorChartData.next(Object.assign({}, this.dataStore).sectorChartData);
  }

  loadAll() {
    this.loadWatchlist();
    this.loadHoldings();
    this.loadPortfolioChartData();
    this.loadSectorChartData();
  }
}
