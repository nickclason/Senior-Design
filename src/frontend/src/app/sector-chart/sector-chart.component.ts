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
    textColor: "black",
  };

  public tooltipSettings: object = {
    visible: true,
  };

  background: string = 'none';


  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getSectorChartData().subscribe(data => {
      this.data = data;
    });

    this.dataService.loadSectorChartData();
  }

}
