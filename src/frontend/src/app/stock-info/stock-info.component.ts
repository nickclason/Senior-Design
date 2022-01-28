import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-stock-info',
  templateUrl: './stock-info.component.html',
  styleUrls: ['./stock-info.component.scss'],
})

export class StockInfoComponent implements OnInit {
  
  public stockchartData: Object[];

  constructor(private http: HttpClient) {
    this.stockchartData = [];
  }
  
  ngOnInit(): void {
    // TODO: implement some kind of search, drop down, or something like that to get stock we want to see
    var tesla_url = 'http://localhost:5000/stocks/get_timeseries_weekly?ticker=TSLA'
    var apple_url = 'http://localhost:5000/stocks/get_timeseries_weekly?ticker=AAPL'
   
    this.http.get<any>(apple_url).subscribe(data => { 

      this.stockchartData = convert_unix_to_date(data['chartData'])
      // console.log(this.stockchartData)
    })  
  }
}

function convert_unix_to_date(data: any) {
  var new_data = data
  for (var i = 0; i < data.length; i++) {
    new_data[i]['date'] = new Date(data[i]['date'] * 1000);;
  }
  return new_data;
}