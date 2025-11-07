import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';

export type ThemePreference = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'oct-theme-preference';
  private readonly preference = signal<ThemePreference>('light');
  private readonly hasExplicitPreference = signal(false);

  readonly theme = computed(() => this.preference());

  constructor() {
    const stored = this.readStoredPreference();
    const initial = stored ?? this.detectSystemPreference();
    this.applyTheme(initial, Boolean(stored));

    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', event => {
        if (!this.hasExplicitPreference()) {
          this.applyTheme(event.matches ? 'dark' : 'light', false);
        }
      });
    }
  }

  toggle(): void {
    this.setTheme(this.preference() === 'light' ? 'dark' : 'light');
  }

  setTheme(theme: ThemePreference): void {
    this.applyTheme(theme, true);
  }

  private applyTheme(theme: ThemePreference, explicit: boolean): void {
    const body = this.document.body;
    body.classList.toggle('theme-dark', theme === 'dark');
    body.setAttribute('data-theme', theme);
    body.style.colorScheme = theme;
    this.preference.set(theme);
    this.hasExplicitPreference.set(explicit);

    if (explicit) {
      this.storePreference(theme);
    } else {
      this.clearStoredPreference();
    }
  }

  private detectSystemPreference(): ThemePreference {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  private readStoredPreference(): ThemePreference | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return null;
      }
      const stored = window.localStorage.getItem(this.storageKey);
      return stored === 'light' || stored === 'dark' ? stored : null;
    } catch (error) {
      return null;
    }
  }

  private storePreference(theme: ThemePreference): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      window.localStorage.setItem(this.storageKey, theme);
    } catch (error) {
      // ignore storage failures (private mode, etc.)
    }
  }

  private clearStoredPreference(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      window.localStorage.removeItem(this.storageKey);
    } catch (error) {
      // ignore storage failures
    }
  }
}
