import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  AccountResponse,
  DebugData,
  LoginRequest,
  RefreshResponse,
  RegisterRequest,
  UserResponse,
} from '../types/api';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient = inject(HttpClient);
  private storageClient = inject(StorageService);
  private router = inject(Router);
  public $refreshNeeded = new Subject<boolean>();
  public authenticated = signal<boolean>(false);
  public debugData = signal<DebugData | null>(null);

  onLogin(credentials: LoginRequest | null) {
    return this.httpClient.post<UserResponse>('/api/login', credentials);
  }

  onRegister(credentials: RegisterRequest) {
    return this.httpClient.post<UserResponse>('/api/register', credentials);
  }

  doDelete() {
    return this.httpClient.delete<{ message: string }>('/api/delete');
  }

  doLogout() {
    this.httpClient.delete('/api/logout');
    this.authenticated.set(false);
    this.storageClient.clear();
    this.$refreshNeeded.next(true);
    this.router.navigate(['/']);
  }

  getNewToken() {
    const refreshToken = this.storageClient.get<string>('refresh');
    if (!refreshToken) {
      this.router.navigate(['/login']);
      return;
    }
    this.httpClient
      .post<RefreshResponse>('/api/refresh', { refreshToken })
      .subscribe({
        next: (res) => {
          this.storageClient.set('token', res.token);
          this.$refreshNeeded.next(true);
          return;
        },
        error: () => {
          this.doLogout();
          this.router.navigate(['/login']);
          return;
        },
      });
  }

  getAccountData() {
    return this.httpClient.get<AccountResponse>('/api/account');
  }

  getDebugData() {
    return this.httpClient.get<DebugData>('/api/debug').subscribe({
      next: (res) => {
        this.debugData.set(res);
      },
      error: () => {
        this.debugData.set(null);
      },
    });
  }
}
