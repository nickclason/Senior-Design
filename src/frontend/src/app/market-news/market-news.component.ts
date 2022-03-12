import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-market-news',
  templateUrl: './market-news.component.html',
  styleUrls: ['./market-news.component.scss']
})
export class MarketNewsComponent implements OnInit {

  news!: any;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any>('http://localhost:5000/data/get_news').subscribe(data => {
      this.news = data['data'];
      // console.log(this.news);
    });
  }

}
