import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-stock-info',
  templateUrl: './stock-info.component.html',
  styleUrls: ['./stock-info.component.scss'],
})

export class StockInfoComponent implements OnInit {;
  symbol: string;
  holdings: any;

  constructor(private http: HttpClient) {
  }
  
  ngOnInit(): void {
    this.updateHoldings();
  }


  clickEvent(){
    const opts = { headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('accessToken')}) };
    const body = { symbol: this.symbol.toUpperCase() };
    this.http.post<any>('http://localhost:5000/portfolio/add_holding', body, opts).subscribe(); // This works, need to handle when the repsonse is not 200 (i.e doesn't work)
  }

  updateHoldings(){
    const opts = { headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('accessToken')}) };
    this.http.get<any>('http://localhost:5000/portfolio/get_holdings', opts).subscribe(data => {
      this.holdings = data['holdings'];
    });
  }

}