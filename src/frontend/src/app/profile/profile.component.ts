import { Component, OnInit } from '@angular/core';

// User-defined imports
import {Router} from "@angular/router";
import { StockInfoComponent } from '../stock-info/stock-info.component';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  email: string;
  constructor(private router:Router) { }

  ngOnInit(): void {
    this.email = localStorage.getItem('email')!;
    // I also want to rename this to something like "dashboard", I think this should be where
    // users go to view all of their investments and portfolio. Should help to keep the # of components
    // down if everything is handled from here

    // This should just be a call to the API that returns all the users info
  }


  // TODO: implement profile page
  //       - If user is logged in, show their profile, else redirect to login page
  //       - display user info (name, email, etc)
  //       - eventually show stocks they own and other info
}
