import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AuthApiService } from '../services/auth-api.service';
import { TokenService } from '../services/token.service';
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
            if (response.data) {
              // Store tokens
              this.tokenService.setTokens(response.data);
              
              // Load user after successful login
              return AuthActions.loadCurrentUser();
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