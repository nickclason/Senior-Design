import { Component, OnInit } from '@angular/core';


import { DataService, TimePoint } from '../services/data.service';


@Component({
  selector: 'app-portfolio-chart',
  templateUrl: './portfolio-chart.component.html',
  styleUrls: ['./portfolio-chart.component.scss']
})
export class PortfolioChartComponent implements OnInit {

  stockChartData: TimePoint[] = []
  constructor(private dataService: DataService) {}
  
  ngOnInit(): void {
    this.getChartData();
  }

  getChartData() {
    this.dataService.getChartData().subscribe(stockChartData => this.stockChartData = this.convert_unix_to_date(stockChartData));
  }

  convert_unix_to_date(data: any) {
    var new_data = data
    for (var i = 0; i < data.length; i++) {
      new_data[i]['date'] = new Date(data[i]['date'] * 1000);;
    }
    return new_data;
  }
}
