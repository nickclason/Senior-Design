import { Component, OnInit } from '@angular/core';

// User-defined imports
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
    // GET on init to see if already logged in?
  }


  // TODO: implement profile page
  //       - If user is logged in, show their profile, else redirect to login page
  //       - display user info (name, email, etc)
  //       - eventually show stocks they own and other info
}
