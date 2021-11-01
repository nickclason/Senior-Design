import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";


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

  constructor(private http:HttpClient) {}

  ngOnInit(): void {
  }

  loginBtnCallback() {
    return this.http.get<Response>('http://localhost:5000/api/auth/login').subscribe(
      response => {
        console.log(response)
        console.log(response.message)
        this.message = response.message
      });

  }
}