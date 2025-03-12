import { Routes } from '@angular/router';
import { dashboardGuard } from './guards/dashboard.guard';
import { DebugComponent } from './pages/debug/debug.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent() {
      return import('./pages/home/home.component').then(
        (m) => m.HomePageComponent
      );
    },
  },
  {
    path: 'debug',
    component: DebugComponent,
  },
  {
    path: 'dashboard',
    loadComponent() {
      return import('./layouts/dashboard/dashboard.component').then(
        (m) => m.DashboardLayoutComponent
      );
    },
    children: [
      {
        path: '',
        loadComponent() {
          return import('./pages/dashboard/dashboard.component').then(
            (m) => m.DashboardPageComponent
          );
        },
        canActivate: [dashboardGuard],
      },
      {
        path: 'reset',
        loadComponent() {
          return import('./pages/dashboard/reset/reset.component').then(
            (m) => m.ResetPageComponent
          );
        },
      },
      {
        path: 'register',
        loadComponent() {
          return import('./pages/dashboard/register/register.component').then(
            (m) => m.RegisterPageComponent
          );
        },
      },
      {
        path: 'login',
        loadComponent() {
          return import('./pages/dashboard/login/login.component').then(
            (m) => m.LoginPageComponent
          );
        },
      },
    ],
  },
];
