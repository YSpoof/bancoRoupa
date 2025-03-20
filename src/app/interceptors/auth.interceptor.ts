import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { UserService } from '../services/user.service';

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiry;
  } catch (e) {
    // If we can't decode the token, assume it's expired
    return true;
  }
}

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const storageSvc = inject(StorageService);
  const userService = inject(UserService);

  // Skip token handling for refresh and login endpoints to avoid infinite loops
  if (req.url.includes('/api/refresh') || req.url.includes('/api/login')) {
    return next(req);
  }

  // Add token to request if available
  const token = storageSvc.get<string>('token');
  if (token) {
    // Add inside the AuthInterceptor before request processing
    // This helps avoid unnecessary API calls with invalid tokens
    if (isTokenExpired(token)) {
      return userService.refresh().pipe(
        switchMap(() => {
          const newToken = storageSvc.get<string>('token');
          const updatedReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${newToken}`,
            },
          });
          return next(updatedReq);
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }

    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Process the request and handle 401 errors
  return next(req).pipe(
    catchError((error) => {
      // Only handle 401 Unauthorized errors
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Try to refresh the token
        return userService.refresh().pipe(
          switchMap(() => {
            // Get the new token and retry the original request
            const newToken = storageSvc.get('token');
            const updatedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`,
              },
            });
            return next(updatedReq);
          }),
          catchError((refreshError) => {
            // If refresh fails, the UserService.refresh() already handles logout
            return throwError(() => refreshError);
          })
        );
      }
      // For other errors, just pass them through
      return throwError(() => error);
    })
  );
};
