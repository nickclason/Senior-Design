import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { StockInfoComponent } from '../stock-info/stock-info.component';
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-house-info',
  templateUrl: './house-info.component.html',
  styleUrls: ['./house-info.component.scss']
})
export class HouseInfoComponent implements OnInit {

  hasTransactions: boolean = true;
  transactions: any;
  displayedColumns: string[] = ['name', 'district', 'ticker', 'amount', 'filing_date', 'transaction_date', 'transaction_type', 'owner'];
  dateForm = new FormGroup({
    date: new FormControl(new Date(), Validators.required)
  });
  todayDate:Date = new Date();
  
  constructor(private http: HttpClient, private dialog: MatDialog) { }

  ngOnInit(): void {

    this.http.get<any>('http://localhost:5000/data/get_house_info').subscribe(data => {
      let resp = data['data'];
      if (resp == -1) {
        this.hasTransactions = false;
      }

      this.transactions = resp;
      // console.log(this.transactions);

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

  selectDate() {
    
    let date = this.dateForm.value.date;
    console.log(date)

    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0');
    var yyyy = date.getFullYear();

    const d = mm + '_' + dd + '_' + yyyy;
    console.log(d);

    this.http.get<any>('http://localhost:5000/data/get_house_info?date='+d).subscribe(data => {
      let resp = data['data'];
      if (resp == -1) {
        this.hasTransactions = false;
        return;
      }

      this.hasTransactions = true;
      this.transactions = resp;
    });
  }
  

}
