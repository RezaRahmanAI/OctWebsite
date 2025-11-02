import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SiteSettings } from '../models';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly http = inject(HttpClient);
  private readonly settingsSignal = signal<SiteSettings | null>(null);
  private readonly apiUrl = `${environment.apiUrl}/settings`;
  private loadingPromise: Promise<SiteSettings | null> | null = null;

  readonly settings = computed(() => this.settingsSignal());

  constructor() {
    void this.ensureLoaded();
  }

  list(): SiteSettings[] {
    const current = this.settingsSignal();
    return current ? [current] : [];
  }

  getById(id: string): SiteSettings | undefined {
    const current = this.settingsSignal();
    return current && current.id === id ? current : undefined;
  }

  async ensureLoaded(): Promise<SiteSettings | null> {
    if (this.settingsSignal()) {
      return this.settingsSignal();
    }
    if (this.loadingPromise) {
      return this.loadingPromise;
    }
    this.loadingPromise = this.fetchSettings();
    const result = await this.loadingPromise;
    this.loadingPromise = null;
    return result;
  }

  async refresh(): Promise<SiteSettings | null> {
    return this.fetchSettings();
  }

  async save(settings: SiteSettings): Promise<SiteSettings> {
    const payload: SiteSettings = {
      ...settings,
      id: settings.id ?? '',
      siteTitle: settings.siteTitle ?? '',
      tagline: settings.tagline ?? '',
      heroTitle: settings.heroTitle ?? '',
      heroSubtitle: settings.heroSubtitle ?? '',
      primaryCtaLabel: settings.primaryCtaLabel ?? '',
      heroImageUrl: settings.heroImageUrl ?? '',
      heroImageAlt: settings.heroImageAlt ?? '',
      heroVideoUrl: settings.heroVideoUrl ?? '',
      heroVideoPoster: settings.heroVideoPoster ?? '',
      heroMediaBadge: settings.heroMediaBadge ?? '',
      heroMediaCaption: settings.heroMediaCaption ?? '',
    };

    const saved = await firstValueFrom(
      this.http.put<SiteSettings>(this.apiUrl, payload),
    );
    this.settingsSignal.set(saved);
    return saved;
  }

  private async fetchSettings(): Promise<SiteSettings | null> {
    try {
      const settings = await firstValueFrom(
        this.http.get<SiteSettings>(this.apiUrl),
      );
      this.settingsSignal.set(settings);
      return settings;
    } catch (error) {
      console.error('Failed to load site settings', error);
      this.settingsSignal.set(null);
      return null;
    }
  }
}
