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

  public chartArea!: Object;
  public background!: string;
  public border!: Object;
  public theme!: string;
  public fill!: Object;


  public primaryXAxis: Object = {
    valueType: 'DateTime',
    intervalType: 'Days',
    interval: 3,
    majorTickLines: {
      color: '#FFFFFF',
      width: 5
    },
    minorTickLines: {
      color: '#FFFFFF',
      width: 0
    }
  };

  public primaryYAxis: Object = {
    labelFormat: '${value}',
    rangePadding: 'Auto',
    lineStyle: { width: 0 },
    color: '#FFFFFF',
    majorTickLines: {
      color: '#FFFFFF',
      width: 0
    },
    minorTickLines: {
      color: '#FFFFFF',
      width: 0
    },
    axisLine: {
      color: '#FF0000',
    }
  };

  public tooltip!: Object;
  public marker!: Object;


  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.portfolioChartData$.subscribe(data => this.stockChartData = this.convert_unix_to_date(data));
    this.dataService.loadPortfolioChartData('1y')

    this.background = '#424242';
    this.border = {
      color: '#424242',
      width: 0
    }
    this.theme = 'MaterialDark';
    this.fill = '#b4256c';

    this.tooltip = { 
      enable: true,
      format: '${series.name} Value : $${point.y}',
      // fill: '#7bb4eb',
      border: {
         width: 2,
         color: 'grey'
      }
    };
    this.marker = {
      visible: true,
      height: 2,
      width: 2
    };
  }

  convert_unix_to_date(data: any) {
    var new_data = data
    for (var i = 0; i < data.length; i++) {
      new_data[i]['x'] = new Date(data[i]['date'] * 1000);;
      new_data[i]['y'] = data[i]['close'];
    }
    return new_data;
  }

  changePeriod(period: string) {
    // this.dataService.changePortfolioChartPeriod(period);
    this.dataService.loadPortfolioChartData(period);
    console.log(period)
  }
}
