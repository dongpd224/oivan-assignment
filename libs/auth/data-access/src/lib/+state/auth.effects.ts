import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { AuthApiService } from '../auth-api.service';
import { TokenService } from '../token.service';
import { AuthUserModel, AuthTokenModel } from '@oivan/auth/domain';
import { ApiResponseModel } from '@oivan/shared/domain';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authApiService: AuthApiService,
    private tokenService: TokenService
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.authApiService.login(credentials).pipe(
          map((response: ApiResponseModel<AuthTokenModel>) => {
            if (response.isSuccess() && response.data) {
              // Store tokens
              this.tokenService.setTokens(response.data);
              
              // Load user after successful login
              return AuthActions.loadCurrentUser();
            } else {
              throw new Error(response.error || 'Login failed');
            }
          }),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.message || 'Login failed' }))
          )
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() =>
        this.authApiService.logout().pipe(
          map(() => {
            this.tokenService.clearTokens();
            return AuthActions.logoutSuccess();
          }),
          catchError((error) => {
            // Even if logout API fails, clear local tokens
            this.tokenService.clearTokens();
            return of(AuthActions.logoutSuccess());
          })
        )
      )
    )
  );

  loadCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadCurrentUser),
      switchMap(() => {
        if (!this.tokenService.hasValidToken()) {
          return of(AuthActions.loadCurrentUserFailure({ error: 'No valid token' }));
        }

        return this.authApiService.getCurrentUser().pipe(
          map((response: ApiResponseModel<AuthUserModel>) => {
            if (response.isSuccess() && response.data) {
              return AuthActions.loadCurrentUserSuccess({ user: response.data });
            } else {
              throw new Error(response.error || 'Failed to load user');
            }
          }),
          catchError((error) =>
            of(AuthActions.loadCurrentUserFailure({ 
              error: error.message || 'Failed to load user' 
            }))
          )
        );
      })
    )
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      switchMap(() => {
        const refreshToken = this.tokenService.getRefreshToken();
        if (!refreshToken) {
          return of(AuthActions.refreshTokenFailure({ error: 'No refresh token available' }));
        }

        return this.authApiService.refreshToken(refreshToken).pipe(
          map((response: ApiResponseModel<AuthTokenModel>) => {
            if (response.isSuccess() && response.data) {
              this.tokenService.setTokens(response.data);
              return AuthActions.refreshTokenSuccess({ token: response.data });
            } else {
              throw new Error(response.error || 'Token refresh failed');
            }
          }),
          catchError((error) => {
            this.tokenService.clearTokens();
            return of(AuthActions.refreshTokenFailure({ 
              error: error.message || 'Token refresh failed' 
            }));
          })
        );
      })
    )
  );

  // Auto-load user on app initialization if token exists
  initializeAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType('@ngrx/effects/init'),
      switchMap(() => {
        if (this.tokenService.hasValidToken()) {
          return of(AuthActions.loadCurrentUser());
        }
        return of({ type: 'NO_ACTION' });
      })
    )
  );
}