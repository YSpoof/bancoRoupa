import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const dashboardGuard: CanActivateFn = (_route, _state) => {
  const userSvc = inject(UserService);
  const router = inject(Router);

  if (userSvc.currentUserSig() === null) {
    router.navigateByUrl('/dashboard/login');
    return false;
  }
  return true;
};
