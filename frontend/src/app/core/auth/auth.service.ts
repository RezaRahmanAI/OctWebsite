import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal, inject } from '@angular/core';
import { map, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { loadFromSession, removeFromSession, saveToSession, removeFromStorage, saveToStorage, loadFromStorage } from '../utils/storage';

const TOKEN_KEY = 'auth-token';
const REMEMBER_KEY = 'auth-remember';

interface LoginResponse {
  token: string;
  expiresAt: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  private readonly tokenSignal = signal<string | null>(this.restoreToken());
  readonly isLoggedIn = computed(() => {
    const token = this.tokenSignal();
    return Boolean(token) && !this.isTokenExpired(token!);
  });

  login(username: string, password: string, remember = false) {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/api/auth/login`, { username, password })
      .pipe(
        tap(response => this.persistToken(response.token, remember)),
        map(() => true),
        catchError(() => of(false))
      );
  }

  logout(): void {
    this.tokenSignal.set(null);
    removeFromSession(TOKEN_KEY);
    removeFromStorage(TOKEN_KEY);
    removeFromStorage(REMEMBER_KEY);
  }

  token(): string | null {
    const token = this.tokenSignal();
    if (!token) {
      return null;
    }

    if (this.isTokenExpired(token)) {
      this.logout();
      return null;
    }
    return token;
  }

  private persistToken(token: string, remember: boolean): void {
    this.tokenSignal.set(token);
    saveToSession(TOKEN_KEY, token);
    removeFromStorage(TOKEN_KEY);
    removeFromStorage(REMEMBER_KEY);

    if (remember) {
      saveToStorage(TOKEN_KEY, token);
      saveToStorage(REMEMBER_KEY, true);
    }
  }

  private restoreToken(): string | null {
    const remembered = loadFromStorage<boolean | null>(REMEMBER_KEY, null);
    if (remembered) {
      return loadFromStorage<string | null>(TOKEN_KEY, null);
    }
    return loadFromSession<string | null>(TOKEN_KEY, null);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const [, payload] = token.split('.');
      const decoded = JSON.parse(atob(payload));
      const exp = decoded?.exp as number | undefined;
      if (!exp) {
        return false;
      }
      const nowSeconds = Math.floor(Date.now() / 1000);
      return exp < nowSeconds;
    } catch (error) {
      console.warn('Failed to decode token', error);
      return true;
    }
  }
}
