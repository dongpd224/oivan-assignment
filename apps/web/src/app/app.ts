import { Component, inject } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { AuthFacade } from '@oivan/auth/feature';
import { filter, map } from 'rxjs';

@Component({
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule
  ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'House Management System';
  private router = inject(Router);
  protected authFacade = inject(AuthFacade);
  
  protected currentRoute$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map((event: NavigationEnd) => event.urlAfterRedirects)
  );

  protected navigationItems = [
    { path: '/houses', label: 'Houses', icon: 'home' },
    { path: '/houses/create', label: 'Create House', icon: 'add_home', requiresAuth: true }
  ];

  protected onLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  protected onLogout(): void {
    this.authFacade.logout();
    this.router.navigate(['/houses']);
  }

  protected navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  protected getBreadcrumbs(url: string): Array<{label: string, path?: string}> {
    const segments = url.split('/').filter(segment => segment);
    const breadcrumbs: Array<{label: string, path?: string}> = [{ label: 'Home', path: '/houses' }];
    
    if (segments.includes('houses')) {
      if (segments.includes('create')) {
        breadcrumbs.push({ label: 'Create House' });
      } else if (segments.length > 1 && segments[1] !== 'create') {
        breadcrumbs.push({ label: 'House Details' });
      }
    } else if (segments.includes('auth')) {
      breadcrumbs.push({ label: 'Authentication' });
    }
    
    return breadcrumbs;
  }
}
