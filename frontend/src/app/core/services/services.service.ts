import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DATA_PROVIDER } from '../data';
import { ServiceItem } from '../models';
import { STATIC_SERVICES } from '../data/static-services';
import { SaveServiceItemRequest, ServicesApiService } from './services-api.service';

@Injectable({ providedIn: 'root' })
export class ServicesService {
  private readonly provider = inject(DATA_PROVIDER);
  private readonly store = this.provider.services;
  private readonly query = signal('');
  private readonly api = inject(ServicesApiService);

  constructor() {
    void this.ensureLoaded();
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
    const payload: SaveServiceItemRequest = {
      title: service.title,
      slug: service.slug,
      summary: service.summary,
      icon: service.icon ?? null,
      features: service.features,
      active: service.active,
    };
    const created = await firstValueFrom(this.api.create(payload));
    this.store.create(created);
    return created;
  }

  async update(id: string, patch: Partial<ServiceItem>): Promise<ServiceItem | undefined> {
    const current = this.store.getById(id);
    if (!current) {
      return undefined;
    }

    const payload: SaveServiceItemRequest = {
      title: patch.title ?? current.title,
      slug: patch.slug ?? current.slug,
      summary: patch.summary ?? current.summary,
      icon: patch.icon ?? current.icon ?? null,
      features: patch.features ?? current.features,
      active: patch.active ?? current.active,
    };

    const updated = await firstValueFrom(this.api.update(id, payload));
    this.store.update(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(this.api.delete(id));
    this.store.delete(id);
  }

  async refresh(): Promise<void> {
    await this.loadFromApi(true);
  }

  async ensureLoaded(): Promise<void> {
    if (this.store.list().length > 0) {
      return;
    }
    await this.loadFromApi(true);
  }

  private async loadFromApi(force = false): Promise<void> {
    if (!force && this.store.list().length > 0) {
      return;
    }

    try {
      const items = await firstValueFrom(this.api.list());
      this.store.replace(items);
    } catch {
      this.store.replace(STATIC_SERVICES);
    }
  }
}
