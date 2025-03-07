import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { injectHttp } from '../../../shared/utils/common.utils';

@Component({
  selector: 'app-signin',
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  standalone: true,
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export default class SigninComponent {
  private _http = injectHttp();
}
