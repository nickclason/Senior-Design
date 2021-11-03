import { Component, OnInit } from '@angular/core';

// User-defined imports
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  profileForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  loggedIn: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // TODO: issue a GET to /api/auth/login to check if the user is already logged in
    // If the user is already logged in, redirect to the profile page
  }

  onLogin() {
  }

}