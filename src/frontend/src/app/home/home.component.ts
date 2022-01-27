import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  home = {
    title: 'Home',
    subtitle: 'Welcome Home - Nick, Ben and Jack!',
    content: 'Welcome to SCK Finance, our Senior Design project. \nBen\'s Change.',
    // image: 'assets/wsb.jpeg'
    image: 'assets/stonksDown.PNG'
  };


  constructor() { }

  ngOnInit(): void {
  }

}
