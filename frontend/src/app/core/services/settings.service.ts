import { Injectable, computed, signal } from '@angular/core';
import { SiteSettings } from '../models';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly settingsSignal = signal<SiteSettings | null>(null);
  private readonly defaultSettings: SiteSettings | null = null;

  readonly settings = computed(() => this.settingsSignal());

  constructor() {
    this.settingsSignal.set(this.defaultSettings);
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
    if (!this.settingsSignal() && this.defaultSettings) {
      this.settingsSignal.set(this.defaultSettings);
    }
    return Promise.resolve(this.settingsSignal());
  }

  async refresh(): Promise<SiteSettings | null> {
    this.settingsSignal.set(this.defaultSettings);
    return Promise.resolve(this.settingsSignal());
  }

  async save(settings: SiteSettings): Promise<SiteSettings> {
    const payload: SiteSettings = {
      ...settings,
      id: settings.id ?? this.generateId(),
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
      heroBackgroundVideoId: settings.heroBackgroundVideoId ?? '',
    };

    this.settingsSignal.set(payload);
    return Promise.resolve(payload);
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2);
  }
}
