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

  public title!: String;
  public titleStyle!: Object;
  public chartArea!: Object;


  public primaryXAxis: Object = {
    valueType: 'DateTime',
    intervalType: 'Days',
    interval: 3,
    majorTickLines : {
      color : '#FFFFFF',
      width : 5
   },
   minorTickLines : {
      color : '#FFFFFF',
      width : 0
   }
  };

  public primaryYAxis: Object = {
    labelFormat: '${value}',
    rangePadding: 'Auto',
    lineStyle: { width: 0 },
    color: '#FFFFFF',
    majorTickLines: { 
      color : '#FFFFFF',
      width: 0 
    },
    minorTickLines: { 
      color : '#FFFFFF',
      width: 0 
    }
  };



  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.portfolioChartData$.subscribe(data => this.stockChartData = this.convert_unix_to_date(data));
    this.dataService.loadPortfolioChartData()

    this.title = 'Portfolio Value';
    this.titleStyle = {
      fontFamily: "Trebuchet MS",
      fontWeight: 'bold',
      color: "#b4256c",
      size: '20pt'
    }
    this.chartArea = {
      background: '#424242'
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


  public load(args: ILoadedEventArgs): void {
    let selectedTheme: string = location.hash.split('/')[1];
    // selectedTheme = selectedTheme ? selectedTheme : 'Material';
    selectedTheme = 'HighContast';
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
}
