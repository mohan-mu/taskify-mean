import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, of, throwError } from 'rxjs';
import { authorizationHeaderInterceptor } from './authorization-header';
import { AUTH_KEY } from '../shared/constants/constants';

describe('AuthorizationHeaderInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useValue: authorizationHeaderInterceptor,
          multi: true,
        },
        { provide: Router, useValue: routerSpy },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    localStorage.setItem(AUTH_KEY, 'test-token');
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem(AUTH_KEY);
  });

  it('should add an Authorization header', () => {
    httpClient
      .get('/test')
      .subscribe(response => expect(response).toBeTruthy());

    const httpRequest = httpMock.expectOne('/test');

    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
    expect(httpRequest.request.headers.get('Authorization')).toBe(
      'Bearer test-token'
    );
  });

  it('should handle 401 error and navigate to signin', () => {
    httpClient
      .get('/test')
      .pipe(
        catchError(error => {
          expect(routerSpy.navigate).toHaveBeenCalledWith(['auth/signin']);
          return of(error);
        })
      )
      .subscribe();

    const httpRequest = httpMock.expectOne('/test');
    httpRequest.flush(null, { status: 401, statusText: 'Unauthorized' });
  });
});
