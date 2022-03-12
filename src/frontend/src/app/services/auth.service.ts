import { Injectable } from '@angular/core';

// User-defined imports
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';


const LOGIN_API = environment.apiServer + '/auth/login';
const LOGOUT_API = environment.apiServer + '/auth/logout';
const REGISTER_API = environment.apiServer + '/auth/register'; // can technically not include this here as it doesn't require any auth?
const REFRESH_API = environment.apiServer + '/auth/refresh';
const DASHBOARD_API = environment.apiServer + '/auth/dashboard';
class LoginResponse {
  accessToken: string;
  refreshToken: string;
}

class RefreshResponse {
  accessToken: string;
}

// Can add to this as needed
class UserInfo {
  email: string;
  firstName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwt: JwtHelperService = new JwtHelperService();
  private authStatus: BehaviorSubject<boolean> = new BehaviorSubject(this.isAuthenticated());

  constructor(private http: HttpClient) { }

  private errorHandler(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error(`auth error: ${error.error.message}`);
    } else {
      console.error(`bad auth resp: ${error.status}: ${error.statusText} ${JSON.stringify(error.error)}`);
    }
    return throwError('Login Failed');
  }

  subscribe(next: (status: boolean) => void) {
    return this.authStatus.subscribe(next);
  }

  // login and get access/refresh tokens
  authenticate(email: string, password: string) {
    return this.http.post<LoginResponse>(LOGIN_API, {email, password})
    .pipe(
      mergeMap(response => {
        // Store the JWTs in local storage
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        
        // Gets info about the user
        const opts = {
          headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('accessToken')})
        };

        return this.http.get<UserInfo>(DASHBOARD_API, opts).pipe(
          map(userInfo => {
            localStorage.setItem('email', userInfo.email);
            localStorage.setItem('firstName', userInfo.firstName);
            this.authStatus.next(true);
          })
        );

      }),
      catchError(this.errorHandler)
    );
  }
  
  // logout and clear tokens
  deauthenticate() {
    const opts = {
      headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('accessToken')})
    };

    localStorage.clear();
    this.authStatus.next(false);
    return this.http.post(LOGOUT_API, {}, opts)
      .pipe(
        map(response => null),
        catchError(this.errorHandler)
      );
  }

  // get access token and refresh if needed
  getAccessToken() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!this.jwt.isTokenExpired(accessToken!)) {
      return new BehaviorSubject(accessToken);
    } else if (!this.jwt.isTokenExpired(refreshToken!)) {
      // console.log('refreshing token');
      const opts = {
        headers: new HttpHeaders({'Authorization' : 'Bearer ' + refreshToken})
      };
      return this.http.post<RefreshResponse>(REFRESH_API, {}, opts).pipe(
        map(response => {
          localStorage.setItem('accessToken', response.accessToken);
          // console.log('auth refresh successful');
          return response.accessToken;
        })
      );
    } else {
      return throwError('refresh token expired');
    }
  }

  // check if user is authenticated
  isAuthenticated() {
    return localStorage.getItem('email') !==  null && !this.jwt.isTokenExpired(localStorage.getItem('refreshToken')!);
  }

  // get user email
  getEmail(): string {
    return localStorage.getItem('email')!;
  }

  // Register a new user
  registerUser(firstName: string, lastName: string, email: string, password: string) {
    return this.http.post(REGISTER_API, {firstName, lastName, email, password})
      .pipe(
        map(response => null),
        catchError(this.errorHandler)
      );
  }

}