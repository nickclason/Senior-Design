import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError} from 'rxjs';

// User-defined imports
import { AuthService } from '../services/auth.service';
import { mergeMap, catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!/.*\/api\/auth\/.*/.test(request.url)) {
      return this.auth.getAccessToken().pipe(
        mergeMap((accessToken: string) => {
          const reqAuth = request.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } });
          return next.handle(reqAuth);
        }),
        catchError(err => {
          console.error(err);
          // this.router.navigate(['/login']);
          return throwError(err);
        })
      );
    } else {
      return next.handle(request);
    }
  }

}
