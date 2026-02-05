import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AuthApiService } from '../services/auth-api.service';
import { TokenService } from '../services/token.service';
import { AuthTokenModel } from '@oivan/auth/domain';
import { ApiResponseModel } from '@oivan/shared/domain';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authApiService = inject(AuthApiService);
  private tokenService = inject(TokenService);

  // Check token on app init
  initAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initAuth),
      map(() => {
        if (this.tokenService.hasValidToken()) {
          return AuthActions.initAuthSuccess();
        }
        // Clear invalid/expired tokens
        this.tokenService.clearTokens();
        return AuthActions.initAuthFailure();
      })
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.authApiService.login(credentials).pipe(
          map((response: ApiResponseModel<AuthTokenModel>) => {
            if (response.data) {
              const token = new AuthTokenModel(response.data)
              // Store tokens
              this.tokenService.setTokens(token);
              
              // Load user after successful login
              return AuthActions.loginSuccess({token});
            } else {
              throw new Error('Login failed');
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
}