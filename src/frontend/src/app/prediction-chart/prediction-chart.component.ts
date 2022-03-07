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
  symbol: string = '';

  title!: String;
  titleStyle!: Object;
  background!: string;
  border!: Object;
  theme!: string;
  fill!: string;
  tooltip!: Object;
  marker!: Object;

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
  
  constructor(private dataService: DataService) { 
    console.log('PredictionChartComponent.constructor()');
  }

  ngOnInit(): void {
    console.log('PredictionChartComponent.ngOnInit()');
    this.dataService.predictionData$.subscribe(data => this.predictionData = this.convert_unix_to_date(data));

    this.title = 'Prediction';
    this.titleStyle = {
      fontFamily: "Trebuchet MS",
      fontWeight: 'regular',
      color: "#FFFFFF",
      size: '16pt'
    };

    this.background = '#424242';
    this.border = {
      color: '#424242',
      width: 0
    }
    this.theme = 'MaterialDark';
    this.fill = '#b4256c';

    this.tooltip = { enable: true };
    this.marker = {
      visible: true,
      height: 2,
      width: 2
    };
  }

  newPrediction() {
    this.dataService.loadPredictionData(this.symbol);
    this.title = "Prediction for " + this.symbol;
  }

  convert_unix_to_date(data: any) {
    var new_data = data
    for (var i = 0; i < data.length; i++) {
      new_data[i]['x'] = new Date(data[i]['date'] * 1000);;
    }
    return new_data;
  }
}
