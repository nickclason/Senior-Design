import { Component, OnInit } from '@angular/core';
import { max } from 'rxjs';

import { DataService, SectorData } from '../services/data.service';

@Component({
  selector: 'app-sector-chart',
  templateUrl: './sector-chart.component.html',
  styleUrls: ['./sector-chart.component.scss']
})
export class SectorChartComponent implements OnInit {

  data: SectorData[] = [];

  public legendSettings: object = {
    visible: true
  }
  public leafItemSettings: object = {
    labelPath: 'sector',
    colorMapping: [
      {
        from: 100, // theres gotta be a better way to do this, its hardcoded for specific ranges/colors
        to: 10000,
        minOpacity: 0.1,
        maxOpacity: 1,
        color: '#b4256c'
      }],
    labelStyle: {
      color: 'black', //  text color
    }

  };

  public tooltipSettings: object = {
    visible: true,
  };

  background: string = 'white';
  margin: Object = { left: 0, right: 0, top: 0, bottom: 0 };


  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getSectorChartData().subscribe(data => {
      this.data = data;

      let min = this.data[0].value;
      let max = min;
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].value > max) {
          max = this.data[i].value;
        }
        if (this.data[i].value < min) {
          min = this.data[i].value;
        }
      }

      
      this.leafItemSettings = {
        labelPath: 'sector',
        colorMapping: [
          {
            from: min,
            to: max,
            minOpacity: 0.1,
            maxOpacity: 1.0,
            color: '#b4256c',
          }],
        labelStyle: {
          color: 'black', //  text color
        }

      };
    });

    this.dataService.loadSectorChartData();
  }

}


