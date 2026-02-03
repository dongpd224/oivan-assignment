import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const AUTH_FEATURE_KEY = 'auth';

export const selectAuthState = createFeatureSelector<AuthState>(AUTH_FEATURE_KEY);

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoading
);

export const selectError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

export const selectUserRoles = createSelector(
  selectUser,
  (user) => user?.roles || []
);

export const selectUserFullName = createSelector(
  selectUser,
  (user) => user?.getFullName() || ''
);