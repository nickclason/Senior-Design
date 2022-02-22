import { Component, OnInit } from '@angular/core';


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription, switchMap, timer } from 'rxjs';

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

@Component({
  selector: 'app-portfolio-holdings',
  templateUrl: './portfolio-holdings.component.html',
  styleUrls: ['./portfolio-holdings.component.scss']
})
export class PortfolioHoldingsComponent implements OnInit {
  
  // holdings: Observable<Stock>;

  holdings: Stock[];
  displayedColumns: string[] = ['symbol', 'quantity', 'current_value', 'total_value']
  realTimeDataSubscription$: Subscription;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.updateHoldings();

  }

  updateHoldings(){
    const opts = { headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('accessToken')}) };
    
    this.http.get<any>('http://localhost:5000/portfolio/get_holdings', opts).subscribe(data => {
      
      this.holdings = data['holdings'];
      console.log(this.holdings)
    
    });
  }

}
