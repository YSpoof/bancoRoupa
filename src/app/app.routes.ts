import { Routes } from '@angular/router';

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
