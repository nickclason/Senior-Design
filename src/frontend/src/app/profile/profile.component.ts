import { Component, OnInit } from '@angular/core';

// User-defined imports
import {DataService, ProfileData, UserData} from '../data.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  firstName: string;
  lastName: string;
  email: string;
  password: string;


  constructor(private router:Router, private dataService:DataService) { }

  ngOnInit(): void {
    this.dataService.getUser().subscribe((data: ProfileData) => {
      
      this.firstName = data.user.firstName;
      this.lastName = data.user.lastName;
      this.email = data.user.email;
      this.password = data.user.password;

      console.log(data)
    })
  }


  // TODO: implement profile page
  //       - If user is logged in, show their profile, else redirect to login page
  //       - display user info (name, email, etc)
  //       - eventually show stocks they own and other info
}
