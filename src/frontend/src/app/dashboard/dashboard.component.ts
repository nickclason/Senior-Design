import { Component, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {
  public cellSpacing: number[] = [10, 10];
  public mediaQuery: string = 'max-width: 700px';


  // There are ways to inject other ej2 components into these panels, which essentially solves everything we want to do

  // Example of defining panels
  // public panels: any = [
  // // { "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: '<div class="content">0</div>' },
  // { "sizeX": 1, "sizeY": 2, "row": 0, "col": 0, content: '<div class="content">Watchlist</div>' },
  // { "sizeX": 3, "sizeY": 2, "row": 0, "col": 1, content: '<div class="content">Portfolio Chart</div>' },
  // { "sizeX": 1, "sizeY": 3, "row": 0, "col": 4, content: '<div class="content">Portfolio</div>' },
  // // { "sizeX": 1, "sizeY": 1, "row": 1, "col": 0, content: '<div class="content">3</div>' },
  // // { "sizeX": 2, "sizeY": 1, "row": 2, "col": 0, content: '<div class="content">Recent Government Trades</div>' },
  // { "sizeX": 1, "sizeY": 1, "row": 2, "col": 2, content: '<div class="content">Prediction: Buy XYZ</div>' },
  // { "sizeX": 1, "sizeY": 1, "row": 2, "col": 3, content: '<div class="content">Overall Market Performance</div>' }
  // ]

}