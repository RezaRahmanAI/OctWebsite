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

  async create(product: ProductItem): Promise<ProductItem> {
    const payload = this.toRequest(product);
    const created = await firstValueFrom(this.http.post<ProductItem>(this.apiUrl, payload));
    this.store.create(created);
    return created;
  }

  async update(id: string, patch: Partial<ProductItem>): Promise<ProductItem | undefined> {
    const current = this.store.getById(id);
    if (!current) {
      return undefined;
    }
    const payload = this.toRequest({ ...current, ...patch });
    const updated = await firstValueFrom(this.http.put<ProductItem>(`${this.apiUrl}/${id}`, payload));
    this.store.update(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
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

  private toRequest(product: Partial<ProductItem>): Omit<ProductItem, 'id'> {
    return {
      title: product.title ?? '',
      slug: product.slug ?? '',
      summary: product.summary ?? '',
      icon: product.icon ?? '',
      features: product.features ?? [],
      active: product.active ?? true,
    };
  }
}
