import { Component, OnInit } from '@angular/core';


import { DataService, PredictionData } from '../services/data.service';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ILoadedEventArgs, ChartTheme } from '@syncfusion/ej2-angular-charts';

@Component({
  selector: 'app-prediction-chart',
  templateUrl: './prediction-chart.component.html',
  styleUrls: ['./prediction-chart.component.scss']
})
export class PredictionChartComponent implements OnInit {

  predictionForm = new FormGroup({
    symbol: new FormControl('', Validators.required)
  });

  predictionData: PredictionData[] = [];
  // symbol: string = '';

  title!: String;
  titleStyle!: Object;
  background!: string;
  border!: Object;
  theme!: string;
  fill!: string;
  tooltip!: Object;
  marker!: Object;
  predMarker!: Object;
  legendSettings!: Object;
  primaryXAxis!: Object;
  primaryYAxis!: Object;

  constructor(private dataService: DataService) {
    // console.log('PredictionChartComponent.constructor()');
  }

  ngOnInit(): void {
    // console.log('PredictionChartComponent.ngOnInit()');
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

    this.tooltip = {
      enable: true,
      format: '${series.name}: ${point.y}',
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
    this.predMarker = {
      visible: true,
      height: 10,
      width: 10
    };

    this.legendSettings = {
      visible: true,
      //Legend position as top
      position: 'Top'
    };

    this.primaryXAxis = {
      valueType: 'DateTime',
      intervalType: 'Days',
      // opposedPosition: true
    };
    this.primaryYAxis = {
      rangePadding: 'Auto',
      labelFormat: '${value}',
      // opposedPosition: true // Doesn't work
    };
  }

  newPrediction() {
    const symbol = this.predictionForm.get('symbol')!.value.toUpperCase();
    this.dataService.loadPredictionData(symbol);
    this.title = "Prediction for " + symbol;
  }

  convert_unix_to_date(data: any) {
    var new_data = data
    for (var i = 0; i < data.length; i++) {
      new_data[i]['x'] = new Date(data[i]['date'] * 1000);;
    }
    return new_data;
  }
}
