import {
  HttpClient,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { UserService } from '../services/user.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const storageSvc = inject(StorageService);
  const userSvc = inject(UserService);
  const http = inject(HttpClient);

  const token = storageSvc.get('token');
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);

  /*

  .pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('Unauthorized request, attempting to refresh token...');

        // Get refresh token from storage
        const refreshToken = storageSvc.get('refreshToken');

        if (!refreshToken) {
          // No refresh token available, can't refresh
          userSvc.logout();
          return throwError(
            () => new Error('Session expired. Please login again.')
          );
        }

        // Attempt to get a new token
        return http
          .post<{ token: string }>('/api/refresh', { refreshToken })
          .pipe(
            switchMap((response) => {
              // Store the new token
              storageSvc.set('token', response.token);

              // Clone the original request with the new token
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.token}`,
                },
              });

              // Retry the original request with the new token
              return next(newReq);
            }),
            catchError((refreshError) => {
              console.error('Token refresh failed:', refreshError);
              // If refresh fails, log the user out
              userSvc.logout();
              return throwError(
                () => new Error('Session expired. Please login again.')
              );
            })
          );
      }

      // For other errors, just pass them through
      return throwError(() => error);
    })
  ); */
};
