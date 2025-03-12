import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

interface StorageOptions {
  storage?: 'local' | 'session';
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private memoryStorage = new Map<string, string>();

  /**
   * Sets an item in the selected storage
   * @param key Storage key
   * @param value Data to store (will be JSON serialized)
   * @param options Storage options
   */
  set<T>(key: string, value: T, options: StorageOptions = {}): void {
    if (!this.isBrowser) {
      // In SSR, use memory storage
      this.memoryStorage.set(key, JSON.stringify(value));
      return;
    }

    const storage = this.getStorage(options.storage);

    try {
      const serializedValue = JSON.stringify(value);
      storage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  /**
   * Gets an item from the selected storage
   * @param key Storage key
   * @param options Storage options
   * @returns The stored value or null if not found
   */
  get<T>(key: string, options: StorageOptions = {}): T | null {
    if (!this.isBrowser) {
      // In SSR, use memory storage
      const item = this.memoryStorage.get(key);
      return item ? (JSON.parse(item) as T) : null;
    }

    const storage = this.getStorage(options.storage);

    try {
      const item = storage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error('Error retrieving from storage:', error);
      return null;
    }
  }

  /**
   * Removes an item from the selected storage
   * @param key Storage key
   * @param options Storage options
   */
  remove(key: string, options: StorageOptions = {}): void {
    if (!this.isBrowser) {
      // In SSR, use memory storage
      this.memoryStorage.delete(key);
      return;
    }

    const storage = this.getStorage(options.storage);
    storage.removeItem(key);
  }

  /**
   * Clears all items from the selected storage
   * @param options Storage options
   */
  clear(options: StorageOptions = {}): void {
    if (!this.isBrowser) {
      // In SSR, use memory storage
      this.memoryStorage.clear();
      return;
    }

    const storage = this.getStorage(options.storage);
    storage.clear();
  }

  /**
   * Returns the appropriate storage object based on options
   * @param storageType Type of storage to use
   * @returns Storage object (localStorage or sessionStorage)
   */
  private getStorage(storageType?: 'local' | 'session'): Storage {
    return storageType === 'session' ? sessionStorage : localStorage;
  }
}
