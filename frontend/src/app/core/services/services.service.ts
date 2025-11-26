import { Injectable, OnDestroy, computed, inject, signal } from '@angular/core';
import { DATA_PROVIDER } from '../data';
import { ServiceItem } from '../models';
import { ServicesApiService, SaveServiceRequest } from './services-api.service';
import { Subscription, firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServicesService implements OnDestroy {
  private readonly provider = inject(DATA_PROVIDER);
  private readonly store = this.provider.services;
  private readonly api = inject(ServicesApiService);
  private readonly query = signal('');
  private readonly loaded = signal(false);
  private readonly loading = signal(false);
  private subscription: Subscription | null = null;

  constructor() {
    this.refresh();
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

  async refresh(): Promise<void> {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.subscription?.unsubscribe();
    this.subscription = this.api.list().subscribe({
      next: services => {
        this.store.replace(services);
        this.loaded.set(true);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  async ensureLoaded(): Promise<void> {
    if (this.loaded()) {
      return;
    }

    await this.refresh();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
