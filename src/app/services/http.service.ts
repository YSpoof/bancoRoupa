import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  httpClient = inject(HttpClient);
  get<T>(url: string) {
    return this.httpClient.get<T>(url);
  }
}
