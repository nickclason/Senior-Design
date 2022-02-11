import { Component, OnInit } from '@angular/core';


import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-portfolio-chart',
  templateUrl: './portfolio-chart.component.html',
  styleUrls: ['./portfolio-chart.component.scss']
})
export class PortfolioChartComponent implements OnInit {


  stockChartData: Object[];

  constructor(private http: HttpClient) {
  }
  
  ngOnInit(): void {
    this.updateChart();
  }

  updateChart() {
    const opts = { headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('accessToken')}) };
    
    // make the dates be inputs eventually
    this.http.get<any>('http://localhost:5000/portfolio/timeseries?start_date=2022-01-01&end_date=2022-02-11&interval=1d', opts).subscribe(data => {

    console.log(data)

    this.stockChartData = this.convert_unix_to_date(data['data'])  
    
    });
  }

  convert_unix_to_date(data: any) {
    var new_data = data
    for (var i = 0; i < data.length; i++) {
      new_data[i]['date'] = new Date(data[i]['date'] * 1000);;
    }
    return new_data;
  }

}
