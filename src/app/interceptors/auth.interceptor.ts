import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { UserService } from '../services/user.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const storageSvc = inject(StorageService);
  const userService = inject(UserService);

  // Add token to request if available
  const token = storageSvc.get<string>('token');
  if (token) {
    const newReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(newReq);
  }

  return next(req);
};
