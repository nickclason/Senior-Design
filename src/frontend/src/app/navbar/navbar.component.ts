import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


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

  message = '';

  constructor(private router: Router, private auth: AuthService) { }


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


  logout() {
    this.auth.deauthenticate().subscribe(
      () => {
        console.log("logging out");
        this.router.navigate(['/']); // redirect to home page
      },
      (error) => {
        this.message = error;
      }
    );
  }

}
