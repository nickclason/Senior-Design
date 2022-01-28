import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-stock-info',
  templateUrl: './stock-info.component.html',
  styleUrls: ['./stock-info.component.scss'],
})

export class StockInfoComponent implements OnInit {
  
  form: FormGroup = new FormGroup({
    stock: new FormControl('', Validators.required),
    function: new FormControl('INTRADAY', Validators.required),
    interval: new FormControl('60min', Validators.required)
  });

  // Ben I'm so sorry I don't know what I'm doing, everything I'm doing feels so wrong
  functionList: any = ['INTRADAY', 'DAILY', 'DAILY_ADJUSTED', 'WEEKLY', 'WEEKLY_ADJUSTED', 'MONTHLY', 'MONTHLY_ADJUSTED']
  intervalList: any = ['1min', '5min', '15min', '30min', '60min']
  stockChartData: any[] = [];

  constructor(private http: HttpClient) {
  }
  
  ngOnInit(): void {
  }

  get f(){
    return this.form.controls;
  }

  submit(){
    
    var url: string;
    if (this.form.value.interval == 'None') {
      url = `http://localhost:5000/stocks/get_timeseries?function=${this.form.value.function}&symbol=${this.form.value.stock}&interval=${this.form.value.interval}`;
    }
    else {
      url = `http://localhost:5000/stocks/get_timeseries?function=${this.form.value.function}&symbol=${this.form.value.stock}`;
    }


    this.http.get<any>(url).subscribe(data => { 
      this.stockChartData = convert_unix_to_date(data['chartData'])
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