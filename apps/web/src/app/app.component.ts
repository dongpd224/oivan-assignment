import { Component, inject } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { AuthFacade } from '@oivan/auth/data-access';
import { HeaderLoginWidgetComponent, HeaderUserDisplayComponent } from '@oivan/auth/ui';
import { LoginCredentialsModel } from '@oivan/auth/domain';
import { filter, map } from 'rxjs';

@Component({
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    HeaderLoginWidgetComponent,
    HeaderUserDisplayComponent
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class App {
  protected title = 'House Management System';
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  protected authFacade = inject(AuthFacade);

  public isAuthenticatedSignal = this.authFacade.isAuthenticatedSignal;
  
  protected currentRoute$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map((event: NavigationEnd) => event.urlAfterRedirects)
  );

  constructor() {
    // Check token on app init
    this.authFacade.initAuth();
    
    // Subscribe to auth errors to show notifications
    this.authFacade.error$.subscribe(error => {
      if (error) {
        this.snackBar.open(error, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  protected onLogin(credentials: LoginCredentialsModel): void {
    this.authFacade.login(credentials);
  }

  protected onLogout(): void {
    this.authFacade.logout();
    this.router.navigate(['/houses']);
  }
}
