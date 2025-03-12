import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import {
  AccountResponse,
  DebugAccount,
  DebugUser,
  RefreshResponse,
  UserResponse,
} from '../types/api';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient = inject(HttpClient);
  private storageClient = inject(StorageService);
  private router = inject(Router);
  private toastSvc = inject(ToastService);
  currentUserSig = signal<UserResponse | null>(null);
  currentAccountSig = signal<AccountResponse[] | null>(null);
  allUsersSig = signal<DebugUser[] | null>(null);
  allAccountsSig = signal<DebugAccount[] | null>(null);

  login(
    email: string | null = null,
    password: string | null = null,
    ignoreError = false
  ): void {
    const payload = email && password ? { email, password } : {};

    this.httpClient.post<UserResponse>('/api/login', payload).subscribe({
      next: (response) => {
        this.currentUserSig.set(response);
        this.storageClient.set('refresh', response.refreshToken);
        this.storageClient.set('token', response.token);
        this.loadAccountData();
        this.router.navigateByUrl('/dashboard');
        this.debug();
        this.toastSvc.showSuccess('Login successful!');
      },
      error: (error) => {
        this.currentUserSig.set(null);
        console.error(error);
        if (ignoreError) return;
        this.toastSvc.showError(error.error.message);
      },
    });
  }

  register(name: string, email: string, password: string) {
    return this.httpClient
      .post<UserResponse>('/api/register', { name, email, password })
      .subscribe({
        next: (response) => {
          this.storageClient.set('refresh', response.refreshToken);
          this.storageClient.set('token', response.token);
          this.currentUserSig.set(response);
          this.loadAccountData();
          this.router.navigateByUrl('/dashboard');
          this.debug();
          this.toastSvc.showSuccess('Registration successful!');
        },
        error: (error) => {
          console.error(error);
          this.toastSvc.showError(error.error.message);
        },
      });
  }

  reset(email: string, password: string) {
    this.httpClient
      .post<UserResponse>('/api/reset', { email, password })
      .subscribe({
        next: (response) => {
          this.currentUserSig.set(response);
          this.storageClient.set('refresh', response.refreshToken);
          this.storageClient.set('token', response.token);
          this.loadAccountData();
          this.router.navigateByUrl('/dashboard');
          this.debug();
        },
        error: (error) => {
          this.toastSvc.showError(error);
          this.currentUserSig.set(null);
          console.error(error);
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
        this.debug();
      },
    });
  }

  refresh() {
    const refreshToken = this.storageClient.get('refresh');

    if (!refreshToken) {
      this.logout();
      return;
    }

    return this.httpClient
      .post<RefreshResponse>('/api/refresh', { refreshToken })
      .pipe(
        tap((response) => {
          // Check if the response contains a token
          if (response.token) {
            this.storageClient.set('token', response.token);
          } else {
            throw new Error('No token received during refresh');
          }
        }),
        catchError((error) => {
          console.error('Token refresh failed:', error);
          this.logout();
          return throwError(() => error);
        })
      );
  }

  delete() {
    const params = new HttpParams({
      fromObject: {
        id: this.currentUserSig()?.id ?? '',
        accountId: this.currentAccountSig()?.[0].id ?? '',
      },
    });

    console.error(`NEED TO SET PARAMS`);
    this.httpClient.delete('/api/delete').subscribe({
      next: () => {
        this.storageClient.remove('refresh');
        this.storageClient.remove('token');
        this.currentUserSig.set(null);
        this.router.navigate(['/']);
        this.debug();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  loadAccountData() {
    this.httpClient.get<AccountResponse[]>('/api/account').subscribe({
      next: (response) => {
        this.currentAccountSig.set(response);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  debug() {
    this.httpClient
      .get<{ users: DebugUser[]; accounts: DebugAccount[] }>('/api/debug')
      .subscribe({
        next: (response) => {
          this.allUsersSig.set(response.users);
          this.allAccountsSig.set(response.accounts);
        },
        error: (error) => {
          console.error(error);
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
