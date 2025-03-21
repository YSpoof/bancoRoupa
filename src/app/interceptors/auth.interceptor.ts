import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { UserService } from '../services/user.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const storageSvc = inject(StorageService);
  const userSvc = inject(UserService);

  // Add token to request if available
  const token = storageSvc.get<string>('token');
  if (token) {
    const newReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(newReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // If 401 Unauthorized and not a refresh token request
        if (error.status === 401 && !req.url.includes('/api/refresh')) {
          // Attempt to get a new token and retry the original request
          userSvc.getNewToken();

          // Create an observable that waits for the refresh to complete then retries
          return userSvc.$refreshNeeded.pipe(
            switchMap((refreshed) => {
              if (refreshed) {
                // Get the new token and retry the original request
                const newToken = storageSvc.get<string>('token');
                if (newToken) {
                  const retryReq = req.clone({
                    setHeaders: {
                      Authorization: `Bearer ${newToken}`,
                    },
                  });
                  return next(retryReq);
                }
              }
              // If refresh didn't work, pass through the original error
              return throwError(() => error);
            })
          );
        }
        // For other errors, just pass them through
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
