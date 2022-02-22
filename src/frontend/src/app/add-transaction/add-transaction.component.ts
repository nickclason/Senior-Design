import { Component, OnInit } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss']
})
export class AddTransactionComponent implements OnInit {

  symbol: string;
  quantity: number;
  buy: number = 1; // 1=buy, 0 (or anything besides 1)=sell
  date: Date = new Date();


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  clickEvent(){
    const opts = { headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('accessToken')}) };

    let d = new Date(this.date);
    d.setHours(d.getHours() + 24);
    const epochNow = d.getTime();
   
    const body = { symbol: this.symbol.toUpperCase(), quantity: this.quantity, buy: this.buy, date: epochNow };

    this.http.post<any>('http://localhost:5000/portfolio/create_transaction', body, opts).subscribe(); // This works, need to handle when the repsonse is not 200 (i.e doesn't work)
  }

}
