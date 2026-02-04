import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenService, AuthFacade } from '@oivan/auth/data-access';
import { MatSnackBar } from '@angular/material/snack-bar';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const tokenService = inject(TokenService);
  const authFacade = inject(AuthFacade);
  const snackBar = inject(MatSnackBar);

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
      if (error.status === 401) {
        tokenService.clearTokens();
        authFacade.logout();
        snackBar.open('Unauthorized', 'Close', { duration: 3000 });
      }
      return throwError(() => error);
    })
  );
};

function shouldSkipAuth(url: string): boolean {
  const skipUrls = ['/api/auth/login', '/api/auth/refresh'];
  return skipUrls.some(skipUrl => url.includes(skipUrl));
}
