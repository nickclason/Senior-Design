import { Component, OnInit } from '@angular/core';

import { DataService, Transaction } from '../services/data.service';
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

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
  }

  clickEvent(){
    let d = new Date(this.date);
    d.setHours(d.getHours() + 24);
    const epochNow = d.getTime();
   
    const transaction: Transaction = { symbol: this.symbol.toUpperCase(), quantity: this.quantity, buy: this.buy, date: epochNow };
    this.dataService.postTransaction(transaction).subscribe();

    setTimeout(() => this.dataService.loadHoldings(), 1000) // wait 1 second so the POST has time to be updated in the backend
    setTimeout(() => this.dataService.loadPortfolioChartData(), 1000)
  }
}
