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


  public marker: Object = {
    visible: true,
    height: 5,
    width: 5
  };
  
  constructor(private dataService: DataService) { 
    console.log('PredictionChartComponent.constructor()');
  }

  ngOnInit(): void {
    console.log('PredictionChartComponent.ngOnInit()');
    this.dataService.predictionData$.subscribe(data => this.predictionData = this.convert_unix_to_date(data));
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
}
