import { Component, OnInit } from '@angular/core';


import { DataService, Stock } from '../services/data.service';



@Component({
  selector: 'app-portfolio-holdings',
  templateUrl: './portfolio-holdings.component.html',
  styleUrls: ['./portfolio-holdings.component.scss']
})
export class PortfolioHoldingsComponent implements OnInit {

  holdings: Stock[] = [];
  displayedColumns: string[] = ['logo_url', 'symbol', 'quantity', 'current_value', 'total_value']

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.holdings$.subscribe( holdings => {
      if (holdings.length > 0) {
        this.holdings = holdings;
      }
    });
    this.dataService.loadHoldings()
  }

}
