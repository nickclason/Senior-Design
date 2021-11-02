import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from '@angular/router';

export interface Response {
  message: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  message: string = "Not logged in"

  profileForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private http:HttpClient, private router: Router) {}

  ngOnInit(): void {
  }

  onLogin() {
    let url = 'http://localhost:5000/api/auth/login'
    let user = {email: this.profileForm.get('email')?.value, password: this.profileForm.get('password')?.value}
    
    return this.http.post<Response>(url, user).subscribe(
      response => {
        console.log(response)
        this.message = response.message
      })
  }

}