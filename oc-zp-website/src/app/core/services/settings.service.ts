import { Injectable, computed, inject } from '@angular/core';
import { DATA_PROVIDER } from '../data';
import { SiteSettings } from '../models';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly provider = inject(DATA_PROVIDER);
  private readonly store = this.provider.settings;

  readonly settings = computed(() => this.store.list()[0]);

  list(): SiteSettings[] {
    return this.store.list();
  }

  getById(id: string): SiteSettings | undefined {
    return this.store.getById(id);
  }

  save(settings: SiteSettings): SiteSettings {
    const existing = this.store.getById(settings.id);
    if (existing) {
      this.store.update(settings.id, settings);
      return { ...existing, ...settings };
    }
    return this.store.create(settings);
  }
}
