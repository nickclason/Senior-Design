import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-stock-info',
  templateUrl: './stock-info.component.html',
  styleUrls: ['./stock-info.component.scss'],
})

export class StockInfoComponent implements OnInit {
  
  public stockchartData: Object[];
  form: FormGroup = new FormGroup({});


  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.stockchartData = [];
    
    this.form = fb.group({
      stock: ['']
    })
  }
  
  ngOnInit(): void {
  }

  get f(){
    return this.form.controls;
  }

  submit(){
    // console.log(this.form.value);
    var url = 'http://localhost:5000/stocks/get_timeseries_weekly?ticker=' + this.form.value.stock
    this.http.get<any>(url).subscribe(data => { 
      this.stockchartData = convert_unix_to_date(data['chartData'])
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