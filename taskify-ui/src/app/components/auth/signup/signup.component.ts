import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { injectHttp } from '../../../shared/utils/common.utils';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-signup',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export default class SignupComponent {
  private _fb = inject(FormBuilder);
  private _http = injectHttp()
  public signupForm = this._fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required,Validators.email]],
    password: ['',Validators.required],
  });

  public onSubmit() {
    this._http.post(`${environment.apiUrl}/auth/signup`, this.signupForm.value).subscribe((res) => {
      alert('User created successfully');
    });
  }
}
