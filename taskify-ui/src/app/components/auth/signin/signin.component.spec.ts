import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AUTH_KEY } from '../../../shared/constants/constants';
import SigninComponent from './signin.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;
  let httpMock: any;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SigninComponent,
        ReactiveFormsModule,
        provideHttpClientTesting(),
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with email and password fields', () => {
    const emailInput = debugElement.query(
      By.css('input[formControlName="email"]')
    );
    const passwordInput = debugElement.query(
      By.css('input[formControlName="password"]')
    );
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
  });

  it('should make a POST request on form submission', () => {
    component.signinForm.setValue({
      email: 'test@example.com',
      password: 'password123',
    });
    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/signin`);
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'fake-jwt-token' });

    expect(localStorage.getItem(AUTH_KEY)).toBe('fake-jwt-token');
  });

  it('should navigate to /tasks on successful login', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    component.signinForm.setValue({
      email: 'test@example.com',
      password: 'password123',
    });
    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/signin`);
    req.flush({ token: 'fake-jwt-token' });

    expect(navigateSpy).toHaveBeenCalledWith(['/tasks']);
  });

  it('should show an alert on login error', () => {
    spyOn(window, 'alert');

    component.signinForm.setValue({
      email: 'test@example.com',
      password: 'password123',
    });
    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/signin`);
    req.flush('Login error', { status: 401, statusText: 'Unauthorized' });

    expect(window.alert).toHaveBeenCalledWith('Error while logging in');
  });

  afterEach(() => {
    httpMock.verify();
  });
});
