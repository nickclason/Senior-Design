import { Component, OnInit } from '@angular/core';


import { DataService, TimePoint } from '../services/data.service';

import { ILoadedEventArgs, ChartTheme } from '@syncfusion/ej2-angular-charts';


@Component({
  selector: 'app-portfolio-chart',
  templateUrl: './portfolio-chart.component.html',
  styleUrls: ['./portfolio-chart.component.scss']
})
export class PortfolioChartComponent implements OnInit {

  stockChartData: TimePoint[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.portfolioChartData$.subscribe(data => this.stockChartData = this.convert_unix_to_date(data));
    this.dataService.loadPortfolioChartData()
  }

  convert_unix_to_date(data: any) {
    var new_data = data
    for (var i = 0; i < data.length; i++) {
      new_data[i]['x'] = new Date(data[i]['date'] * 1000);;
      new_data[i]['y'] = data[i]['close'];
    }
    return new_data;
  }
}
