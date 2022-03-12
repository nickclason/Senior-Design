import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { StockInfoComponent } from '../stock-info/stock-info.component';

@Component({
  selector: 'app-house-info',
  templateUrl: './house-info.component.html',
  styleUrls: ['./house-info.component.scss']
})
export class HouseInfoComponent implements OnInit {

  hasTransactions: boolean = true;
  transactions: any;
  displayedColumns: string[] = ['name', 'district', 'ticker', 'amount', 'filing_date', 'transaction_date', 'transaction_type', 'owner'];


  constructor(private http: HttpClient, private dialog: MatDialog) { }

  ngOnInit(): void {

    this.http.get<any>('http://localhost:5000/data/get_house_info?date=03_07_2022').subscribe(data => {
      let resp = data['data'];
      if (resp == -1) {
        this.hasTransactions = false;
      }

      this.transactions = resp;
      console.log(this.transactions);

    });
  }

  displayInfo(symbol: string) {
    const dialogRef = this.dialog.open(StockInfoComponent,
      {
        width: "80%",
        height: "90%",
        data: { symbol: symbol }

      });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The stock dialog was closed');
    });
  }

}
