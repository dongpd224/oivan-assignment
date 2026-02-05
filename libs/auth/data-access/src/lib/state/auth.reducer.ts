import { createReducer, on } from '@ngrx/store';
import { AuthUserModel } from '@oivan/auth/domain';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: AuthUserModel | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,

  // Login Actions
  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(AuthActions.loginSuccess, (state) => ({
    ...state,
    isAuthenticated: true,
    isLoading: false,
    error: null
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error
  })),

  // Logout Actions
  on(AuthActions.logout, (state) => ({
    ...state,
    isLoading: true
  })),

  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  })),

  on(AuthActions.logoutFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Load Current User Actions
  on(AuthActions.loadCurrentUser, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(AuthActions.loadCurrentUserSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    isLoading: false,
    error: null
  })),

  on(AuthActions.loadCurrentUserFailure, (state, { error }) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error
  })),

  // Token Refresh Actions
  on(AuthActions.refreshToken, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(AuthActions.refreshTokenSuccess, (state) => ({
    ...state,
    isLoading: false,
    error: null
  })),

  on(AuthActions.refreshTokenFailure, (state, { error }) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error
  })),

  // Clear Error Action
  on(AuthActions.clearError, (state) => ({
    ...state,
    error: null
  })),

  // Init Auth - Check token on app startup
  on(AuthActions.initAuth, (state) => ({
    ...state,
    isLoading: true
  })),

  on(AuthActions.initAuthSuccess, (state) => ({
    ...state,
    isAuthenticated: true,
    isLoading: false
  })),

  on(AuthActions.initAuthFailure, (state) => ({
    ...state,
    isAuthenticated: false,
    isLoading: false
  }))
);