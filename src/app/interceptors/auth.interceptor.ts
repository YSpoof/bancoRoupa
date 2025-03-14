import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('debug')) {
    return next(req);
  }

  const storageSvc = inject(StorageService);
  const token = storageSvc.get('token') ?? '';

  const newReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(newReq);
};
