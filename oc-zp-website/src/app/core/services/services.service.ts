import { Injectable, computed, inject, signal } from '@angular/core';
import { DATA_PROVIDER } from '../data';
import { ServiceItem } from '../models';

@Injectable({ providedIn: 'root' })
export class ServicesService {
  private readonly provider = inject(DATA_PROVIDER);
  private readonly store = this.provider.services;
  private readonly query = signal('');

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

  create(service: ServiceItem): ServiceItem {
    return this.store.create(service);
  }

  update(id: string, patch: Partial<ServiceItem>): ServiceItem | undefined {
    return this.store.update(id, patch);
  }

  delete(id: string): void {
    this.store.delete(id);
  }
}
