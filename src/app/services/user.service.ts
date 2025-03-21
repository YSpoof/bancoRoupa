import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  AccountResponse,
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

  onLogin(credentials: LoginRequest) {
    return this.httpClient.post<UserResponse>('/api/login', credentials);
  }

  onRegister(credentials: RegisterRequest) {
    return this.httpClient.post<UserResponse>('/api/register', credentials);
  }

  doLogout() {
    this.storageClient.clear();
    this.$refreshNeeded.next(true);
    this.httpClient.delete('/api/logout');
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
}
