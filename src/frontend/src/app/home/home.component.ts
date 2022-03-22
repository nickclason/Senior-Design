import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LearnMoreComponent} from '../learn-more/learn-more.component';


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

  @ViewChild('learnMore') stockInfo!: LearnMoreComponent;

  dailyColumn: string[] = ['logo_url', 'symbol',  'daily_change'];

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.http.get<any>('http://localhost:5000/data/get_daily_data').subscribe(
            data => {
                this.dailyWinners = data['winners'];
                this.dailyLosers = data['losers'];
            }
        );
    this.http.get<any>('http://localhost:5000/data/get_weekly_data').subscribe(
            data => {
                this.weeklyWinners = data['winners'];
                this.weeklyLosers = data['losers'];
            }
      );
  }



  learnMoreClick() {
    console.log('learn more clicked')
    const dialogRef = this.dialog.open(LearnMoreComponent,
      {
        width: "80%",
        height: "90%",
      });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The stock dialog was closed');
    });

  }
}
