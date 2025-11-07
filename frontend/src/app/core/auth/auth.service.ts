import { Injectable, computed, signal } from '@angular/core';
import { loadFromStorage, removeFromStorage, saveToStorage } from '../utils/storage';

const TOKEN_KEY = 'auth-token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenSignal = signal<string | null>(loadFromStorage<string | null>(TOKEN_KEY, null));
  readonly isLoggedIn = computed(() => Boolean(this.tokenSignal()));

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'Admin@123') {
      const token = crypto.randomUUID?.() ?? `${Date.now()}`;
      this.tokenSignal.set(token);
      saveToStorage(TOKEN_KEY, token);
      return true;
    }
    return false;
  }

  logout(): void {
    this.tokenSignal.set(null);
    removeFromStorage(TOKEN_KEY);
  }

  token(): string | null {
    return this.tokenSignal();
  }
}
