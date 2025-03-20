import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginRequest, RegisterRequest } from '../types/api';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient = inject(HttpClient);
  private storageClient = inject(StorageService);

  refreshNeeded = signal(false);

  onLogin(credentials: LoginRequest) {
    return this.httpClient.post('/api/login', credentials);
  }

  onRegister(credentials: RegisterRequest) {
    return this.httpClient.post('/api/register', credentials);
  }

  onLogout() {
    this.storageClient.clear();
    this.refreshNeeded.set(true);
    this.httpClient.delete('/api/logout');
  }

  getNewToken(refreshToken: string) {
    return this.httpClient.post('/api/refresh', { refreshToken });
  }
}
