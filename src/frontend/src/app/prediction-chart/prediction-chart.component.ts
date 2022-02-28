import { Component, OnInit } from '@angular/core';


import { DataService, PredictionData } from '../services/data.service';

import { ILoadedEventArgs, ChartTheme } from '@syncfusion/ej2-angular-charts';

@Component({
  selector: 'app-prediction-chart',
  templateUrl: './prediction-chart.component.html',
  styleUrls: ['./prediction-chart.component.scss']
})
export class PredictionChartComponent implements OnInit {

  predictionData: PredictionData[] = [];
  symbol: string = 'AAPL';


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
    this.dataService.predictionData$.subscribe(data => this.predictionData = this.convert_unix_to_date(data));
    this.dataService.loadPredictionData(this.symbol); // PoC it works; load apple prediction on page load for test data

    // console.log(this.predictionData)
  }

  newPrediction() {
    this.dataService.loadPredictionData(this.symbol);
  }


  convert_unix_to_date(data: any) {
    var new_data = data
    for (var i = 0; i < data.length; i++) {
      new_data[i]['x'] = new Date(data[i]['date'] * 1000);;
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
