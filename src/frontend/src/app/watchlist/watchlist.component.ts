import { Component, OnInit } from '@angular/core';

import { DataService, WatchStock, AddWatch } from '../services/data.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit {
  
  watchlist: WatchStock[] = [];
  displayedColumns: string[] = ['symbol', 'current_value']
  symbol: string;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getWatchlist();
  }

  getWatchlist() {
    this.dataService.getWatchlist().subscribe(watchlist => this.watchlist = watchlist);
  }

  clickEvent() {
    const watch: AddWatch = { symbol: this.symbol.toUpperCase() };
    this.dataService.addToWatchlist(watch).subscribe();
  }
}
