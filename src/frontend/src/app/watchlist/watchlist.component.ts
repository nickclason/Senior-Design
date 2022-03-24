import { Component, OnInit, ViewChild } from '@angular/core';


import { DataService, WatchStock, AddWatch } from '../services/data.service';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { StockInfoComponent } from '../stock-info/stock-info.component';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit {

  @ViewChild('stockInfo') stockInfo!: StockInfoComponent;

  watchlist: WatchStock[] = [];
  displayedColumns: string[] = ['logo_url', 'symbol', 'current_value', 'remove'];

  addToWatchForm = new FormGroup({
    symbol: new FormControl('', Validators.required),
  });

  constructor(private dataService: DataService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.dataService.watchlist$.subscribe(watchlist => this.watchlist = watchlist);
    this.dataService.loadWatchlist()
  }

  addToWatchlist() {
    const watch: AddWatch = { symbol: this.addToWatchForm.get('symbol')!.value };

    this.dataService.addToWatchlist(watch).subscribe();
    this.addToWatchForm.reset();

    setTimeout(() => this.dataService.loadWatchlist(), 2000) // wait 1 second before making this call so the POST has time to be updated in the backend
  }

  removeFromWatchlist(symbol: string) {
    const watch: AddWatch = { symbol: symbol.toUpperCase() };
    this.dataService.removeFromWatchlist(watch);

    setTimeout(() => this.dataService.loadWatchlist(), 1000)
  }

  displayInfo(symbol: string) {

    const dialogRef = this.dialog.open(StockInfoComponent,
      {
        width: "80%",
        height: "90%",
        data: { symbol: symbol }

      });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The stock dialog was closed');
    });

  }
}
