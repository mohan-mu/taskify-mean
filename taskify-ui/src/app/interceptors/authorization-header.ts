import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AUTH_KEY } from '../shared/constants/constants';
import { Router } from '@angular/router';

export const authorizationHeaderInterceptor: HttpInterceptorFn = (
  req,
  next
) => {
  const token = localStorage.getItem(AUTH_KEY);
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });
  return next(authReq).pipe(
    catchError(error => {
      if (error.status === 401) {
        // Optionally, redirect to login or refresh token
        console.error('Invalid token');
        inject(Router).navigate(['auth/signin']);
      }
      return throwError(error);
    })
  );
};
