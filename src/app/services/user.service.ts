import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import {
  AccountResponse,
  LoginResponse,
  RefreshResponse,
  RegisterResponse,
} from '../types/api';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  httpClient = inject(HttpClient);
  storageClient = inject(StorageService);
  router = inject(Router);
  toast = inject(ToastService);
  currentUserSig = signal<{ name: string } | null>(null);
  currentAccountSig = signal<AccountResponse[] | null>(null);

  login(
    email: string | null = null,
    password: string | null = null,
    ignoreError = false
  ): void {
    const payload = email && password ? { email, password } : {};

    this.httpClient.post<LoginResponse>('/api/login', payload).subscribe({
      next: (response) => {
        this.currentUserSig.set(response.client);
        this.toast.showToast(
          `Bem vindo(a), ${response.client.name.split(' ')[0]}!`
        );
        this.storageClient.set('refresh', response.refreshToken);
        this.storageClient.set('token', response.token);
        this.loadAccountData();
        this.router.navigateByUrl('/dashboard');
      },
      error: (error) => {
        this.currentUserSig.set(null);
        if (ignoreError) return;
        console.error(error);
        this.toast.showToast(error.error.message, 'Erro', 'error');
      },
    });
  }

  register(name: string, email: string, password: string) {
    return this.httpClient
      .post<RegisterResponse>('/api/register', { name, email, password })
      .subscribe({
        next: (response) => {
          this.toast.showToast(
            `Bem vindo(a), ${response.client.name.split(' ')[0]}!`,
            'Cadastro Efetuado!'
          );
          this.storageClient.set('refresh', response.refreshToken);
          this.storageClient.set('token', response.token);
          this.currentUserSig.set(response.client);
          this.loadAccountData();
          this.router.navigateByUrl('/dashboard');
        },
        error: (error) => {
          console.error(error);
          this.toast.showToast(error.error.message, 'Erro', 'error');
        },
      });
  }

  logout() {
    this.httpClient.delete('/api/logout', {}).subscribe({
      next: () => {
        this.storageClient.remove('refresh');
        this.storageClient.remove('token');
        this.currentUserSig.set(null);
        this.router.navigate(['/dashboard/login']);
      },
    });
  }
  refresh() {
    const refreshToken = this.storageClient.get('refresh') || '{}';

    if (!refreshToken) {
      this.router.navigate(['/login']);
      return;
    }

    return this.httpClient
      .post<RefreshResponse>('/api/refresh', { refreshToken })
      .pipe(
        tap((response) => {
          if (response.message) return response.message;
          this.storageClient.set('token', response.token);
          return;
        }),
        catchError(this.handleError)
      );
  }

  loadAccountData() {
    this.httpClient.get<AccountResponse[]>('/api/account').subscribe({
      next: (response) => {
        console.log(response);
        this.currentAccountSig.set(response);
      },
      error: (error) => {
        console.error(error);
        this.toast.showToast(error.error.message, 'Erro', 'error');
      },
    });
  }

  private handleError = (error: HttpErrorResponse) => {
    if (error.status === 0) {
      console.error('Network error');
      return throwError(() => new Error('Network error occurred'));
    }

    return throwError(() => error.error);
  };
}
