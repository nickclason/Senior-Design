import { BoundDirectivePropertyAst } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  darkButton!: HTMLElement;
  lightButton!: HTMLElement;
  unorderedList: HTMLElement;
  body!: HTMLElement;

  constructor() { 
    
  }

  ngOnInit(): void {
    const darkButton = document.getElementById('dark');
    const lightButton = document.getElementById('light');
    const unorderedList = document.getElementById('unorderedList');
    const body = document.body;

    // Apply cached theme on reload
    const theme = localStorage.getItem('theme');

    if (theme) {
      body.classList.add(theme);
      unorderedList.classList.add(theme);
      //console.log("");
    }

    darkButton.onclick = () => {
      body.classList.replace('light', 'dark');
      unorderedList.classList.replace('light', 'dark');
      localStorage.setItem('theme', 'dark');
    }

    lightButton.onclick = () => {
      body.classList.replace('dark', 'light');
      unorderedList.classList.replace('dark', 'light');
      localStorage.setItem('theme', 'light');
    }
  }

  

}
