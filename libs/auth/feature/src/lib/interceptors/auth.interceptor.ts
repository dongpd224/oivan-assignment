import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { TokenService, AuthStore } from '@oivan/auth/data-access';
import { Router } from '@angular/router';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const tokenService = inject(TokenService);
  const authStore = inject(AuthStore);
  const router = inject(Router);

  // Skip auth header for login and refresh token requests
  if (shouldSkipAuth(req.url)) {
    return next(req);
  }

  // Add auth header if token exists
  const authHeader = tokenService.getAuthHeader();
  if (authHeader) {
    req = req.clone({
      setHeaders: {
        Authorization: authHeader
      }
    });
  }

  return next(req).pipe(
    catchError(error => {
      // Handle 401 Unauthorized responses
      if (error.status === 401) {
        return handle401Error(req, next, tokenService, authStore, router);
      }
      return throwError(() => error);
    })
  );
};

function shouldSkipAuth(url: string): boolean {
  const skipUrls = ['/api/auth/login', '/api/auth/refresh'];
  return skipUrls.some(skipUrl => url.includes(skipUrl));
}

function handle401Error(
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn, 
  tokenService: TokenService, 
  authStore: AuthStore, 
  router: Router
): Observable<HttpEvent<unknown>> {
  const refreshToken = tokenService.getRefreshToken();
  
  if (refreshToken && !tokenService.isTokenExpired()) {
    // Try to refresh the token
    return authStore.refreshToken().pipe(
      switchMap(() => {
        // Retry the original request with new token
        const authHeader = tokenService.getAuthHeader();
        if (authHeader) {
          req = req.clone({
            setHeaders: {
              Authorization: authHeader
            }
          });
        }
        return next(req);
      }),
      catchError(refreshError => {
        // Refresh failed, redirect to login
        redirectToLogin(tokenService, router);
        return throwError(() => refreshError);
      })
    );
  } else {
    // No refresh token or token expired, redirect to login
    redirectToLogin(tokenService, router);
    return throwError(() => new Error('Authentication required'));
  }
}

function redirectToLogin(tokenService: TokenService, router: Router): void {
  tokenService.clearTokens();
  router.navigate(['/auth/login']);
}