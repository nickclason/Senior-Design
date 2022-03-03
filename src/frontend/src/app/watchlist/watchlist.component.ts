import { Component, OnInit } from '@angular/core';


import { DataService, WatchStock, AddWatch } from '../services/data.service';
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit {
  
  watchlist: WatchStock[] = [];
  displayedColumns: string[] = ['logo_url', 'symbol', 'current_value', 'remove'];
  
  addToWatchForm = new FormGroup({
    symbol: new FormControl('', Validators.required),
  });


  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.watchlist$.subscribe(watchlist => this.watchlist = watchlist);
    this.dataService.loadWatchlist()
  }

  clickEvent() {
    const watch: AddWatch  ={ symbol: this.addToWatchForm.get('symbol')!.value };

    this.dataService.addToWatchlist(watch).subscribe();
    this.addToWatchForm.reset();
    
    setTimeout(() => this.dataService.loadWatchlist(), 1000) // wait 1 second before making this call so the POST has time to be updated in the backend
  }

  removeFromWatchlist(symbol: string) {
    const watch: AddWatch = { symbol: symbol.toUpperCase() };
    this.dataService.removeFromWatchlist(watch);

    setTimeout(() => this.dataService.loadWatchlist(), 750)
  }
}
