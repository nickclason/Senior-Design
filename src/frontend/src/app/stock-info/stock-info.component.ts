import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


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
  selector: 'app-stock-info',
  templateUrl: './stock-info.component.html',
  styleUrls: ['./stock-info.component.scss'],
})

export class StockInfoComponent implements OnInit {;
  
  symbol: string;
  quantity: number;
  buy: number = 1; // 1=buy, 0 (or anything besides 1)=sell
  date: Date = new Date();

  holdings: Stock[];

  stockChartData: Object[];

  displayedColumns: string[] = ['symbol', 'quantity', 'current_value', 'total_value']

  constructor(private http: HttpClient) {
  }
  
  ngOnInit(): void {
    this.updateHoldings();
    this.updateChart();
  }


  clickEvent(){
    const opts = { headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('accessToken')}) };

    let d = new Date(this.date);
    d.setHours(d.getHours() + 24);
    const epochNow = d.getTime();
   
    const body = { symbol: this.symbol.toUpperCase(), quantity: this.quantity, buy: this.buy, date: epochNow };

    this.http.post<any>('http://localhost:5000/portfolio/create_transaction', body, opts).subscribe(); // This works, need to handle when the repsonse is not 200 (i.e doesn't work)
  }

  updateHoldings(){
    const opts = { headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('accessToken')}) };
    this.http.get<any>('http://localhost:5000/portfolio/get_holdings', opts).subscribe(data => {
      this.holdings = data['holdings'];
      console.log(data['holdings'])
    });
  }

  updateChart() {
    const opts = { headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('accessToken')}) };
    // make the dates be inputs eventually
    this.http.get<any>('http://localhost:5000/portfolio/timeseries?start_date=2022-01-01&end_date=2022-02-05&interval=1d', opts).subscribe(data => {

    this.stockChartData = this.convert_unix_to_date(data['data'])  
    // console.log(this.stockChartData)
    
    });
  }

  convert_unix_to_date(data: any) {
    var new_data = data
    for (var i = 0; i < data.length; i++) {
      new_data[i]['date'] = new Date(data[i]['date'] * 1000);;
    }
    return new_data;
  }

}