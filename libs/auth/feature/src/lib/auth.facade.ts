import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthUserModel, LoginCredentialsModel } from '@oivan/auth/domain';
import * as AuthActions from '@oivan/auth/data-access';
import * as AuthSelectors from '@oivan/auth/data-access';

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  constructor(
    private router: Router,
    private store: Store
  ) {}

  // Selectors
  get currentUser$(): Observable<AuthUserModel | null> {
    return this.store.select(AuthSelectors.selectUser);
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.store.select(AuthSelectors.selectIsAuthenticated);
  }

  get isLoading$(): Observable<boolean> {
    return this.store.select(AuthSelectors.selectIsLoading);
  }

  get error$(): Observable<string | null> {
    return this.store.select(AuthSelectors.selectError);
  }

  get userRoles$(): Observable<string[]> {
    return this.store.select(AuthSelectors.selectUserRoles);
  }

  get userFullName$(): Observable<string> {
    return this.store.select(AuthSelectors.selectUserFullName);
  }

  // Actions
  login(credentials: LoginCredentialsModel): Observable<any> {
    this.store.dispatch(AuthActions.login({ credentials }));
    return this.currentUser$; // Return observable for compatibility
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<any> {
    this.store.dispatch(AuthActions.refreshToken());
    return this.currentUser$; // Return observable for compatibility
  }

  loadCurrentUser(): void {
    this.store.dispatch(AuthActions.loadCurrentUser());
  }

  clearError(): void {
    this.store.dispatch(AuthActions.clearError());
  }

  // Utility methods
  getCurrentUser(): AuthUserModel | null {
    // Get current value synchronously - this is not ideal with NgRx
    // Consider using async patterns instead
    let currentUser: AuthUserModel | null = null;
    this.currentUser$.subscribe(user => currentUser = user).unsubscribe();
    return currentUser;
  }

  isAuthenticated(): boolean {
    // Get current value synchronously - this is not ideal with NgRx
    // Consider using async patterns instead
    let isAuth = false;
    this.isAuthenticated$.subscribe(auth => isAuth = auth).unsubscribe();
    return isAuth;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.roles.includes(role) : false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.some(role => user.roles.includes(role)) : false;
  }

  hasAllRoles(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.every(role => user.roles.includes(role)) : false;
  }
}