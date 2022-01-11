import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  home = {
    title: 'Home',
    subtitle: 'Welcome Home, Ben!',
    content: 'Welcome to SCK Finance, our Senior Design project. ',
    image: 'assets/wsb.jpeg'
  };


  constructor() { }

  ngOnInit(): void {
  }

}
