import { Injectable, computed, inject, signal } from '@angular/core';
import { DATA_PROVIDER } from '../data';
import { ServiceItem } from '../models';
import { STATIC_SERVICES } from '../data/static-services';

@Injectable({ providedIn: 'root' })
export class ServicesService {
  private readonly provider = inject(DATA_PROVIDER);
  private readonly store = this.provider.services;
  private readonly query = signal('');

  constructor() {
    this.seedFromStatic();
  }

  readonly services = computed(() => {
    const term = this.query().toLowerCase().trim();
    const list = this.store.list().filter(service => service.active);
    if (!term) {
      return list;
    }
    return list.filter(service =>
      [service.title, service.summary, service.features.join(' ')].some(field =>
        field.toLowerCase().includes(term),
      ),
    );
  });

  readonly all = this.store.items;

  search(term: string): void {
    this.query.set(term);
  }

  list(): ServiceItem[] {
    return this.store.list();
  }

  getById(id: string): ServiceItem | undefined {
    return this.store.getById(id);
  }

  getBySlug(slug: string): ServiceItem | undefined {
    return this.store.getBySlug?.(slug);
  }

  async create(service: ServiceItem): Promise<ServiceItem> {
    const created = { ...service, id: service.id ?? this.generateId() };
    this.store.create(created);
    return Promise.resolve(created);
  }

  async update(id: string, patch: Partial<ServiceItem>): Promise<ServiceItem | undefined> {
    const current = this.store.getById(id);
    if (!current) {
      return undefined;
    }
    const updated = { ...current, ...patch } as ServiceItem;
    this.store.update(id, updated);
    return Promise.resolve(updated);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
    return Promise.resolve();
  }

  async refresh(): Promise<void> {
    this.seedFromStatic(true);
  }

  async ensureLoaded(): Promise<void> {
    this.seedFromStatic(true);
  }

  private seedFromStatic(force = false): void {
    if (!force && this.store.list().length > 0) {
      return;
    }
    this.store.replace(STATIC_SERVICES);
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2);
  }
}
