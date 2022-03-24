import { Component, OnInit } from '@angular/core';

import { DataService, Transaction } from '../services/data.service';
import { FormControl, FormGroup, Validators } from "@angular/forms";


@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss']
})
export class AddTransactionComponent implements OnInit {

  transactionForm = new FormGroup({
    symbol: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    buy: new FormControl('', Validators.required),
    date: new FormControl(new Date(), Validators.required),
  });

  todayDate:Date = new Date();
  
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
  }

  clickEvent() {

    let d = this.transactionForm.get('date')!.value
    const epochNow = d.getTime();

    const symbol = this.transactionForm.get('symbol')!.value;
    const quantity = this.transactionForm.get('quantity')!.value;
    const buy = this.transactionForm.get('buy')!.value;

    const transaction: Transaction =
    {
      symbol: symbol.toUpperCase(),
      quantity: quantity,
      buy: parseInt(buy),
      date: epochNow
    };
    
    // console.log(transaction);

    this.dataService.postTransaction(transaction).subscribe();
    this.transactionForm.reset();

    setTimeout(() => this.dataService.loadAll(), 1500) // wait 1 second before making this call so the POST has time to be updated in the backen
    
    // setTimeout(() => this.dataService.loadHoldings(), 1000) // wait 1 second so the POST has time to be updated in the backend
    // setTimeout(() => this.dataService.loadPortfolioChartData("1y"), 1000)
    // setTimeout(() => this.dataService.loadSectorChartData(), 1000)
  }
}
