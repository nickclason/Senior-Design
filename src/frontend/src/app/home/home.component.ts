import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  home = {
    title: 'Welcome Home',
    subtitle: 'Nick, Ben and Jack!',
    content: 'Welcome to SCK Finance, our Senior Design project.',
    text: `Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm.
           Pinnace holystone mizzenmast quarter crow\'s nest nipperkin grog yardarm hempen halter furl. 
           Swab barque interloper chantey doubloonstarboard grog black jack gangway rutters.`,
    // image: 'assets/wsb.jpeg'
    image: 'assets/stonksDown.PNG'
  };


  constructor() { }

  ngOnInit(): void {
  }

}
