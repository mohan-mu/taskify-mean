import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AUTH_KEY } from '../shared/constants/constants';
import { Router } from '@angular/router';

@Injectable()
export class AuthorizationHeaderInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(AUTH_KEY);

    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next.handle(clonedRequest).pipe(
      catchError((error) => {
        if (error.status === 401) {
          // Optionally, redirect to login or refresh token
          console.error('Invalid token');
          inject(Router).navigate(['auth/signin']);
        }
        return throwError(error);
      })
    );
  }
}
