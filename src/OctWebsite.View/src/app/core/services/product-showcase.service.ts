import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ProductShowcaseItem } from '../models';
import { ProductShowcaseApiService, SaveProductShowcaseRequest } from './product-showcase-api.service';

@Injectable({ providedIn: 'root' })
export class ProductShowcaseService {
  private readonly api = inject(ProductShowcaseApiService);
  private readonly productsSignal = signal<ProductShowcaseItem[]>([]);
  private readonly loaded = signal(false);
  private readonly loading = signal(false);

  readonly products = computed(() => this.productsSignal());
  readonly isLoading = this.loading.asReadonly();

  constructor() {
    effect(() => {
      if (this.productsSignal().length === 0 && !this.loading()) {
        void this.refresh();
      }
    });
  }

  setProducts(products: ProductShowcaseItem[]): void {
    this.productsSignal.set(products);
  }

  async refresh(): Promise<void> {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    try {
      const products = await firstValueFrom(this.api.list());
      this.productsSignal.set(products);
      this.loaded.set(true);
    } catch (error) {
      console.error('Failed to load showcase products from API.', error);
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

  async getBySlug(slug: string): Promise<ProductShowcaseItem | undefined> {
    const existing = this.productsSignal().find(item => item.slug === slug);
    if (existing) {
      return existing;
    }

    try {
      const item = await firstValueFrom(this.api.getBySlug(slug));
      this.productsSignal.update(items => [...items, item]);
      return item;
    } catch (error) {
      console.error('Unable to fetch showcase product', error);
      return undefined;
    }
  }

  async create(request: SaveProductShowcaseRequest): Promise<ProductShowcaseItem> {
    const created = await firstValueFrom(this.api.create(request));
    this.productsSignal.update(items => [...items, created]);
    return created;
  }

  async update(id: string, request: SaveProductShowcaseRequest): Promise<ProductShowcaseItem | undefined> {
    const updated = await firstValueFrom(this.api.update(id, request));
    this.productsSignal.update(items => items.map(item => (item.id === id ? updated : item)));
    return updated;
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(this.api.delete(id));
    this.productsSignal.update(items => items.filter(item => item.id !== id));
  }
}
