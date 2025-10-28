import { Injectable, computed, inject, signal } from '@angular/core';
import { DATA_PROVIDER } from '../data';
import { ProductItem } from '../models';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly provider = inject(DATA_PROVIDER);
  private readonly store = this.provider.products;
  private readonly query = signal('');

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

  create(product: ProductItem): ProductItem {
    return this.store.create(product);
  }

  update(id: string, patch: Partial<ProductItem>): ProductItem | undefined {
    return this.store.update(id, patch);
  }

  delete(id: string): void {
    this.store.delete(id);
  }
}
