import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { AuthUserModel, AuthTokenModel, LoginCredentialsModel } from '@oivan/auth/domain';
import { AuthApiService } from './auth-api.service';
import { TokenService } from './token.service';
import { ApiResponseModel } from '@oivan/shared/domain';

export interface AuthState {
  user: AuthUserModel | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private readonly initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  };

  private readonly state$ = new BehaviorSubject<AuthState>(this.initialState);

  constructor(
    private authApiService: AuthApiService,
    private tokenService: TokenService
  ) {
    this.initializeAuthState();
  }

  // Selectors
  get state(): Observable<AuthState> {
    return this.state$.asObservable();
  }

  get user$(): Observable<AuthUserModel | null> {
    return this.state$.pipe(map(state => state.user));
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.state$.pipe(map(state => state.isAuthenticated));
  }

  get isLoading$(): Observable<boolean> {
    return this.state$.pipe(map(state => state.isLoading));
  }

  get error$(): Observable<string | null> {
    return this.state$.pipe(map(state => state.error));
  }

  // Actions
  login(credentials: LoginCredentialsModel): Observable<AuthTokenModel> {
    this.updateState({ isLoading: true, error: null });

    return this.authApiService.login(credentials).pipe(
      tap((response: ApiResponseModel<AuthTokenModel>) => {
        if (response.isSuccess() && response.data) {
          this.tokenService.setTokens(response.data);
          this.loadCurrentUser();
        }
      }),
      map((response: ApiResponseModel<AuthTokenModel>) => {
        if (response.isError()) {
          throw new Error(response.error || 'Login failed');
        }
        return response.data!;
      }),
      catchError(error => {
        this.updateState({ isLoading: false, error: error.message || 'Login failed' });
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<void> {
    this.updateState({ isLoading: true });

    return this.authApiService.logout().pipe(
      tap(() => {
        this.tokenService.clearTokens();
        this.updateState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      }),
      map(() => void 0),
      catchError(error => {
        // Even if logout API fails, clear local tokens
        this.tokenService.clearTokens();
        this.updateState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
        return throwError(() => error);
      })
    );
  }

  refreshToken(): Observable<AuthTokenModel> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.authApiService.refreshToken(refreshToken).pipe(
      tap((response: ApiResponseModel<AuthTokenModel>) => {
        if (response.isSuccess() && response.data) {
          this.tokenService.setTokens(response.data);
        }
      }),
      map((response: ApiResponseModel<AuthTokenModel>) => {
        if (response.isError()) {
          throw new Error(response.error || 'Token refresh failed');
        }
        return response.data!;
      }),
      catchError(error => {
        this.tokenService.clearTokens();
        this.updateState({
          user: null,
          isAuthenticated: false,
          error: 'Session expired'
        });
        return throwError(() => error);
      })
    );
  }

  loadCurrentUser(): void {
    if (!this.tokenService.hasValidToken()) {
      this.updateState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
      return;
    }

    this.updateState({ isLoading: true });

    this.authApiService.getCurrentUser().pipe(
      tap((response: ApiResponseModel<AuthUserModel>) => {
        if (response.isSuccess() && response.data) {
          this.updateState({
            user: response.data,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } else {
          this.updateState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: response.error || 'Failed to load user'
          });
        }
      }),
      catchError(error => {
        this.updateState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: error.message || 'Failed to load user'
        });
        return throwError(() => error);
      })
    ).subscribe();
  }

  clearError(): void {
    this.updateState({ error: null });
  }

  private initializeAuthState(): void {
    if (this.tokenService.hasValidToken()) {
      this.loadCurrentUser();
    }
  }

  private updateState(partialState: Partial<AuthState>): void {
    const currentState = this.state$.value;
    this.state$.next({ ...currentState, ...partialState });
  }
}