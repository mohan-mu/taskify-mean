import { ComponentFixture, TestBed } from '@angular/core/testing';

import SignupComponent from './signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { environment } from '../../../../environments/environment';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupComponent,HttpClientTestingModule,ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupComponent, ReactiveFormsModule, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });
  afterEach(() => {
    httpMock.verify();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with 3 controls', () => {
    expect(component.signupForm.contains('name')).toBeTruthy();
    expect(component.signupForm.contains('email')).toBeTruthy();
    expect(component.signupForm.contains('password')).toBeTruthy();
  });

  it('should make the name control required', () => {
    let control = component.signupForm.get('name');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
  });

  it('should make the email control required and validate email format', () => {
    let control = component.signupForm.get('email');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();

    control?.setValue('not-an-email');
    expect(control?.valid).toBeFalsy();

    control?.setValue('test@example.com');
    expect(control?.valid).toBeTruthy();
  });

  it('should make the password control required', () => {
    let control = component.signupForm.get('password');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
  });

  xit('should submit the form and make an HTTP POST request', () => {
    const form = component.signupForm;
    form.setValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const button: DebugElement = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/signup`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
