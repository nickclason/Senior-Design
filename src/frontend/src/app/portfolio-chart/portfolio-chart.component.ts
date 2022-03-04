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


  public primaryXAxis: Object = {
    valueType: 'DateTime',
    intervalType: 'Days',
    interval: 3,
  };

  public primaryYAxis: Object = {
    labelFormat: '${value}',
    rangePadding: 'Auto',
    lineStyle: { width: 0 },
    majorTickLines: { width: 0 },
    minorTickLines: { width: 0 }
  };

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

  public load(args: ILoadedEventArgs): void {
    let selectedTheme: string = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Material';
    args.chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark");
  };

  public tooltip: Object = {
    enable: true
  };

  // Dots on the line
  public marker: Object = {
    visible: true,
    height: 5,
    width: 5
  };

  public chartArea: Object = {
    border: {
      width: 0
    }
  };
}
