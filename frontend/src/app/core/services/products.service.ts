import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DATA_PROVIDER } from '../data';
import { ProductItem } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly provider = inject(DATA_PROVIDER);
  private readonly store = this.provider.products;
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/products`;
  private loadingPromise: Promise<void> | null = null;
  private hasLoadedFromApi = false;
  private readonly query = signal('');

  constructor() {
    void this.ensureLoaded();
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

  create(product: ProductItem): ProductItem {
    return this.store.create(product);
  }

  update(id: string, patch: Partial<ProductItem>): ProductItem | undefined {
    return this.store.update(id, patch);
  }

  delete(id: string): void {
    this.store.delete(id);
  }

  async refresh(): Promise<void> {
    await this.loadFromApi(true);
  }

  async ensureLoaded(): Promise<void> {
    await this.loadFromApi();
  }

  private async loadFromApi(force = false): Promise<void> {
    if (this.loadingPromise) {
      await this.loadingPromise;
      return;
    }
    if (!force && this.hasLoadedFromApi) {
      return;
    }
    this.loadingPromise = firstValueFrom(this.http.get<ProductItem[]>(this.apiUrl))
      .then(items => {
        this.store.replace(items);
        this.hasLoadedFromApi = true;
      })
      .catch(error => {
        console.error('Failed to load products from API', error);
      })
      .finally(() => {
        this.loadingPromise = null;
      });
    await this.loadingPromise;
  }
}
