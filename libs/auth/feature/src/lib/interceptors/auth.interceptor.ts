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
  const headers: Record<string, string> = {};
  
  if (authHeader) {
    headers['authentication'] = authHeader;
  }

  // Handle mutating requests (POST, PUT, PATCH)
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    headers['Content-Type'] = 'application/vnd.api+json';
    
    // Wrap body in { data: T } if not already wrapped
    const body = req.body;
    if (body && typeof body === 'object' && !('data' in body)) {
      req = req.clone({ 
        setHeaders: headers,
        body: { data: body }
      });
    } else if (Object.keys(headers).length > 0) {
      req = req.clone({ setHeaders: headers });
    }
  } else if (Object.keys(headers).length > 0) {
    req = req.clone({ setHeaders: headers });
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
