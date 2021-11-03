import { Component, OnInit } from '@angular/core';

// User-defined imports
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  message = '';

  profileForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  loggedIn: boolean = false;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    // TODO: issue a GET to /api/auth/login to check if the user is already logged in
    // If the user is already logged in, redirect to the profile page
  }

  onLogin() {
    const email = this.profileForm.get('email')!.value;
    const password = this.profileForm.get('password')!.value;
    
    this.auth.authenticate(email, password).subscribe(
      () => {
        console.log(`logging in: ${email}`);
        this.router.navigate(['/profile']);
      },
      (error) => {
        this.message = error;
      }
    );
  }

}