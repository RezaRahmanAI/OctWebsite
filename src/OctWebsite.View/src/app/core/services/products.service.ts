import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DATA_PROVIDER } from '../data';
import { ProductItem } from '../models';
import { ProductsApiService, SaveProductRequest } from './products-api.service';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly provider = inject(DATA_PROVIDER);
  private readonly store = this.provider.products;
  private readonly api = inject(ProductsApiService);
  private readonly query = signal('');
  private readonly loaded = signal(false);
  private readonly loading = signal(false);

  readonly products = computed(() => {
    const term = this.query().toLowerCase().trim();
    const list = this.store.list().filter(product => product.active);
    if (!term) {
      return list;
    }
    return list.filter(product =>
      [product.title, product.summary, product.features.join(' ')].some(field =>
        field.toLowerCase().includes(term),
      ),
    );
  });

  readonly all = this.store.items;

  readonly isLoading = this.loading.asReadonly();

  search(term: string): void {
    this.query.set(term);
  }

  list(): ProductItem[] {
    return this.store.list();
  }

  getById(id: string): ProductItem | undefined {
    return this.store.getById(id);
  }

  getBySlug(slug: string): ProductItem | undefined {
    return this.store.getBySlug?.(slug);
  }

  async create(product: SaveProductRequest): Promise<ProductItem> {
    const created = await firstValueFrom(this.api.create(product));
    this.store.create(created);
    return created;
  }

  async update(id: string, request: SaveProductRequest): Promise<ProductItem | undefined> {
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

    try {
      const products = await firstValueFrom(this.api.list());

      this.store.replace(products);
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
}
