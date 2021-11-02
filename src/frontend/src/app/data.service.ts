import { Injectable } from '@angular/core';

// Begin user-defined imports
import {HttpClient} from '@angular/common/http';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private ipAddress = "http://localhost:5000"

  constructor(private http: HttpClient) { }


  authorizeUser(email: string, password: string) {
    let l : loginRequest = {email: email, password: password};

    return this.http.post<loginResponse>(this.ipAddress + "/api/auth/login",l);
  }

  login(email: string, password: string, router: Router) {
    this.authorizeUser(email, password).subscribe(
      (authResponse: loginResponse) => 
      {
        console.log(authResponse)
        router.navigate(["profile"]); // try to redirect to profile page after successfull login. for some reason the login session isn't persisting
      });
  }

  createUser(firstName: string, lastName: string, email: string, password: string) {
    let user = {firstName: firstName, lastName: lastName, email: email, password: password};

    return this.http.post(this.ipAddress + "/api/auth/register", user);
  }

  getUser() {
    return this.http.get<ProfileData>(this.ipAddress + "/api/profile");
  }

  alreadyLoggedIn() {
    return this.http.get<loginResponse>(this.ipAddress + "/api/auth/login");
  }

}


export type loginRequest = {
  email: string;
  password: string;
}

export type loginResponse = {
  jwt: string;
  userResponse: UserData;
}

export type ProfileData = {
  // id: string;
  // email: string;
  // profileId: string;
  // credentialsNonExpired: boolean;
  result: number
  user: UserData
}

export type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
