import { createAction, props } from '@ngrx/store';
import { AuthUserModel, AuthTokenModel, LoginCredentialsModel } from '@oivan/auth/domain';

// Login Actions
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginCredentialsModel }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ token: AuthTokenModel}>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Logout Actions
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const logoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{ error: string }>()
);

// Load Current User Actions
export const loadCurrentUser = createAction('[Auth] Load Current User');

export const loadCurrentUserSuccess = createAction(
  '[Auth] Load Current User Success',
  props<{ user: AuthUserModel }>()
);

export const loadCurrentUserFailure = createAction(
  '[Auth] Load Current User Failure',
  props<{ error: string }>()
);

// Token Refresh Actions
export const refreshToken = createAction('[Auth] Refresh Token');

export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ token: AuthTokenModel }>()
);

export const refreshTokenFailure = createAction(
  '[Auth] Refresh Token Failure',
  props<{ error: string }>()
);

// Clear Error Action
export const clearError = createAction('[Auth] Clear Error');

// Init Auth - Check token on app startup
export const initAuth = createAction('[Auth] Init Auth');

export const initAuthSuccess = createAction('[Auth] Init Auth Success');

export const initAuthFailure = createAction('[Auth] Init Auth Failure');