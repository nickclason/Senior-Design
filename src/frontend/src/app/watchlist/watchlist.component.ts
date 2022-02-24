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
    this.dataService.watchlist$.subscribe(watchlist => this.watchlist = watchlist);
    this.dataService.loadWatchlist()
  }

  clickEvent() {
    const watch: AddWatch = { symbol: this.symbol.toUpperCase() };
    this.dataService.addToWatchlist(watch).subscribe();
    setTimeout(() => this.dataService.loadWatchlist(), 1000) // wait 1 second before making this call so the POST has time to be updated in the backend
  }
}
