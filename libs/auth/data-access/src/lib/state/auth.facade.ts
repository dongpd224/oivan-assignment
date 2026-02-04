import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthUserModel, LoginCredentialsModel } from '@oivan/auth/domain';
import * as AuthActions from './auth.actions';
import * as AuthSelectors from './auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  private store = inject(Store);

  // Selectors
  currentUser$ = this.store.select(AuthSelectors.selectUser);
  isAuthenticated$ = this.store.select(AuthSelectors.selectIsAuthenticated);
  isAuthenticatedSignal = this.store.selectSignal(AuthSelectors.selectIsAuthenticated);
  isLoading$ = this.store.select(AuthSelectors.selectIsLoading);
  error$ = this.store.select(AuthSelectors.selectError);
  userRoles$ = this.store.select(AuthSelectors.selectUserRoles);
  userFullName$ = this.store.select(AuthSelectors.selectUserFullName);

  // Actions
  login(credentials: LoginCredentialsModel): void {
    this.store.dispatch(AuthActions.login({ credentials }));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  refreshToken(): void {
    this.store.dispatch(AuthActions.refreshToken());
  }

  loadCurrentUser(): void {
    this.store.dispatch(AuthActions.loadCurrentUser());
  }

  clearError(): void {
    this.store.dispatch(AuthActions.clearError());
  }
}
