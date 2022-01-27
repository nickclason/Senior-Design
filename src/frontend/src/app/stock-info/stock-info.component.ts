import { Component, OnInit } from '@angular/core';


import { chartData } from "src/app/stock-info/datasource";

@Component({
  selector: 'app-stock-info',
  templateUrl: './stock-info.component.html',
  styleUrls: ['./stock-info.component.scss'],
  // template:


})
export class StockInfoComponent implements OnInit {
  
  public stockchartData: Object[];

  constructor() {
    this.stockchartData = chartData;
  }
  
  ngOnInit(): void {
    
  }

}
