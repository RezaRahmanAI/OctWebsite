import { Injectable, computed, inject, signal } from '@angular/core';
import { DATA_PROVIDER } from '../data';
import { ProductItem } from '../models';
import { STATIC_PRODUCTS } from '../data/static-products';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly provider = inject(DATA_PROVIDER);
  private readonly store = this.provider.products;
  private readonly query = signal('');

  constructor() {
    this.seedFromStatic();
  }

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

  async create(product: ProductItem): Promise<ProductItem> {
    const created = { ...product, id: product.id ?? this.generateId() };
    this.store.create(created);
    return Promise.resolve(created);
  }

  async update(id: string, patch: Partial<ProductItem>): Promise<ProductItem | undefined> {
    const current = this.store.getById(id);
    if (!current) {
      return undefined;
    }
    const updated = { ...current, ...patch } as ProductItem;
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
    this.store.replace(STATIC_PRODUCTS);
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2);
  }
}
