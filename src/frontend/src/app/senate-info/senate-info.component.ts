import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { StockInfoComponent } from '../stock-info/stock-info.component';

@Component({
  selector: 'app-senate-info',
  templateUrl: './senate-info.component.html',
  styleUrls: ['./senate-info.component.scss']
})
export class SenateInfoComponent implements OnInit {

  hasTransactions: boolean = true;
  transactions: any;
  displayedColumns: string[] = ['senator', 'ticker', 'asset_type', 'amount', 'disclosure_date', 'transaction_date', 'transaction_type', 'owner'];

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  ngOnInit(): void {

    this.http.get<any>('http://localhost:5000/data/get_senate_info?date=02_14_2022').subscribe(data => {
      let resp = data['data'];
      if (resp == -1) {
        this.hasTransactions = false;
      }

      this.transactions = resp;

    });

  }

  displayInfo(symbol: string) {

    // console.log(symbol);
    const dialogRef = this.dialog.open(StockInfoComponent,
      {
        width: "80%",
        height: "90%",
        data: { symbol: symbol }

      });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The stock dialog was closed');
    });
  }

}
