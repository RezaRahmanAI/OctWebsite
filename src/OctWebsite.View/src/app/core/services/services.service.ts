import { Injectable, computed, inject, signal } from '@angular/core';
import { DATA_PROVIDER } from '../data';
import { STATIC_SERVICES } from '../data/static-services';
import { ServiceItem } from '../models';
import { SaveServiceRequest, ServicesApiService } from './services-api.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServicesService {
  private readonly provider = inject(DATA_PROVIDER);
  private readonly store = this.provider.services;
  private readonly api = inject(ServicesApiService);
  private readonly query = signal('');
  private readonly loaded = signal(false);
  private readonly loading = signal(false);
  private seeding: Promise<ServiceItem[]> | null = null;

  readonly services = computed(() => {
    const term = this.query().toLowerCase().trim();
    const list = this.store.list().filter(service => service.active && service.featured);
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

  readonly isLoading = this.loading.asReadonly();

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

  async create(service: SaveServiceRequest): Promise<ServiceItem> {
    const created = await firstValueFrom(this.api.create(service));
    this.store.create(created);
    return created;
  }

  async update(id: string, request: SaveServiceRequest): Promise<ServiceItem | undefined> {
    const updated = await firstValueFrom(this.api.update(id, request));
    if (updated) {
      this.store.update(id, updated);
    }
    return updated ?? undefined;
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(this.api.delete(id));
    this.store.delete(id);
  }

  async refresh(seedIfEmpty = false): Promise<void> {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);

    try {
      const services = await firstValueFrom(this.api.list());
      if (seedIfEmpty && services.length === 0) {
        const seeded = await this.seedFromStatic();
        if (seeded.length > 0) {
          this.store.replace(seeded);
          this.loaded.set(true);
          return;
        }
      }

      this.store.replace(services);
      this.loaded.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  async ensureLoaded(): Promise<void> {
    if (this.loaded()) {
      return;
    }

    await this.refresh();
  }

  async seedFromStatic(): Promise<ServiceItem[]> {
    if (this.store.list().length > 0) {
      return this.store.list();
    }

    if (this.seeding) {
      return this.seeding;
    }

    this.seeding = (async () => {
      const created: ServiceItem[] = [];
      for (const service of STATIC_SERVICES) {
        const payload: SaveServiceRequest = {
          title: service.title,
          subtitle: service.subtitle ?? '',
          slug: service.slug,
          summary: service.summary ?? '',
          description: service.description ?? '',
          icon: service.icon ?? '',
          backgroundImage: null,
          backgroundImageFileName: service.backgroundImage?.fileName ?? null,
          features: service.features ?? [],
          active: service.active ?? true,
          featured: service.featured ?? false,
        };

        const createdService = await firstValueFrom(this.api.create(payload));
        created.push(createdService);
      }

      this.store.replace(created);
      this.loaded.set(true);
      return created;
    })();

    return this.seeding.finally(() => {
      this.seeding = null;
    });
  }
}
