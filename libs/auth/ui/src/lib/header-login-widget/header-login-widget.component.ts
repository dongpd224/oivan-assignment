import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoginCredentialsModel } from '@oivan/auth/domain';

@Component({
  selector: 'lib-header-login-widget',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './header-login-widget.component.html',
  styleUrl: './header-login-widget.component.scss'
})
export class HeaderLoginWidgetComponent {
  loginSubmit = output<LoginCredentialsModel>();

  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = new LoginCredentialsModel(this.loginForm.value, false);
      this.loginSubmit.emit(credentials);
    }
  }
}
