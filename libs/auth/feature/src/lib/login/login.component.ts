import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginFormComponent } from '@oivan/auth/ui';
import { LoginCredentialsModel } from '@oivan/auth/domain';
import { AuthFacade } from '../auth.facade';

@Component({
  selector: 'lib-auth-login',
  standalone: true,
  imports: [CommonModule, LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(
    private router: Router,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  onLogin(credentials: LoginCredentialsModel) {
    this.authFacade.login(credentials).subscribe({
      next: () => {
        this.snackBar.open('Login successful!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/houses']);
      },
      error: (error) => {
        this.snackBar.open(
          error.message || 'Login failed. Please try again.', 
          'Close', 
          {
            duration: 5000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  onSignUp(event: Event) {
    event.preventDefault();
    // TODO: Navigate to sign up page
    this.snackBar.open('Sign up functionality coming soon!', 'Close', {
      duration: 3000
    });
  }
}