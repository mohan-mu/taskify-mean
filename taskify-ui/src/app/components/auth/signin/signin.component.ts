import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { injectHttp } from '../../../shared/utils/common.utils';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { AUTH_KEY } from '../../../shared/constants/constants';

@Component({
  selector: 'app-signin',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export default class SigninComponent {
  private _fb = inject(FormBuilder);
  public signinForm = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  private _http = injectHttp();
  private _router = inject(Router);
  public onSubmit() {
    this._http
      .post(`${environment.apiUrl}/auth/signin`, this.signinForm.value)
      .subscribe(
        (res: any) => {
          console.log('User Logged in successfully');
          localStorage.setItem(AUTH_KEY, res.token);
          this._router.navigate(['/tasks']);
        },
        err => {
          console.error('Error while logging in', err);
          alert('Error while logging in');
        }
      );
  }
}
