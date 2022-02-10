import { Component, OnInit } from '@angular/core';

// -----------------------------------------------------------------------------
// Begin User Defined Imports
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, Validators } from "@angular/forms";
// End User Defined Imports
// -----------------------------------------------------------------------------

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

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  onLogin() {
    const email = this.profileForm.get('email')!.value;
    const password = this.profileForm.get('password')!.value;

    this.auth.authenticate(email, password).subscribe(
      () => {
        console.log(`logging in: ${email}`);
        console.log(localStorage.getItem('accessToken'))
        this.loggedIn = true;
      },
      (error) => {
        this.message = error;
      }
    );
  }

  onLogout() {
    this.auth.deauthenticate().subscribe(
      () => {
        console.log("logging out");
        this.loggedIn = false;
      },
      (error) => {
        this.message = error;
      }
    );
  }

}
