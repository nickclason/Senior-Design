import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  dailyWinners: any;
  dailyLosers: any;
  weeklyWinners: any;
  weeklyLosers: any;

  dailyColumn: string[] = ['logo_url', 'symbol',  'daily_change'];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any>('http://localhost:5000/data/get_daily_data').subscribe(
            data => {
                this.dailyWinners = data['winners'];
                this.dailyLosers = data['losers'];
            }
        );
  }
}
