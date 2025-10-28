import { Injectable, computed, inject } from '@angular/core';
import { DATA_PROVIDER } from '../data';
import { CompanyAbout } from '../models';

@Injectable({ providedIn: 'root' })
export class AboutService {
  private readonly provider = inject(DATA_PROVIDER);
  private readonly store = this.provider.about;

  readonly entries = this.store.items;
  readonly overview = computed(() => this.getByKey('overview'));
  readonly mission = computed(() => this.getByKey('mission'));
  readonly vision = computed(() => this.getByKey('vision'));

  list(): CompanyAbout[] {
    return this.store.list();
  }

  getByKey(key: CompanyAbout['key']): CompanyAbout | undefined {
    return this.store.list().find(entry => entry.key === key);
  }

  getById(id: string): CompanyAbout | undefined {
    return this.store.getById(id);
  }

  upsert(entry: CompanyAbout): CompanyAbout {
    const existing = this.getByKey(entry.key);
    if (existing) {
      this.store.update(existing.id, entry);
      return { ...existing, ...entry };
    }
    return this.store.create(entry);
  }

  update(id: string, patch: Partial<CompanyAbout>): CompanyAbout | undefined {
    return this.store.update(id, patch);
  }
}
