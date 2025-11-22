import { Injectable, computed, inject } from '@angular/core';
import { DATA_PROVIDER } from '../data';
import { CompanyAbout } from '../models';

@Injectable({ providedIn: 'root' })
export class AboutService {
  private readonly provider = inject(DATA_PROVIDER);
  private readonly store = this.provider.about;
  private readonly defaultEntries: CompanyAbout[] = [
    { id: 'about-overview', key: 'overview', content: 'ObjectCanvas builds and mentors technology teams with local talent.' },
    { id: 'about-mission', key: 'mission', content: 'Deliver reliable software while teaching the practices behind it.' },
    { id: 'about-vision', key: 'vision', content: 'A community of builders where products and people grow together.' },
  ];

  constructor() {
    this.seedDefaults();
  }

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

  async upsert(entry: CompanyAbout): Promise<CompanyAbout> {
    const existing = entry.id ? this.store.getById(entry.id) : this.getByKey(entry.key);
    if (existing) {
      return (await this.update(existing.id, entry)) ?? existing;
    }
    return this.create(entry);
  }

  async create(entry: CompanyAbout): Promise<CompanyAbout> {
    const created: CompanyAbout = { ...entry, id: entry.id ?? this.generateId() };
    this.store.create(created);
    return Promise.resolve(created);
  }

  async update(id: string, patch: Partial<CompanyAbout>): Promise<CompanyAbout | undefined> {
    const current = this.store.getById(id);
    if (!current) {
      return undefined;
    }
    const updated: CompanyAbout = { ...current, ...patch } as CompanyAbout;
    this.store.update(id, updated);
    return Promise.resolve(updated);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
    return Promise.resolve();
  }

  async refresh(): Promise<void> {
    this.seedDefaults(true);
  }

  async ensureLoaded(): Promise<void> {
    this.seedDefaults(true);
  }

  private seedDefaults(force = false): void {
    if (!force && this.store.list().length > 0) {
      return;
    }
    this.store.replace(this.defaultEntries);
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2);
  }
}
