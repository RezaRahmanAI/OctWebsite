import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DATA_PROVIDER } from '../data';
import { CompanyAbout } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AboutService {
  private readonly provider = inject(DATA_PROVIDER);
  private readonly store = this.provider.about;
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/about`;
  private loadingPromise: Promise<void> | null = null;
  private hasLoadedFromApi = false;

  constructor() {
    void this.ensureLoaded();
  }

  readonly entries = this.store.items;
  readonly overview = computed(() => this.getByKey('overview'));
  readonly mission = computed(() => this.getByKey('mission'));
  readonly vision = computed(() => this.getByKey('vision'));

  list(): CompanyAbout[] {
    return this.store.list();
  }

  getByKey(key: CompanyAbout['key']): CompanyAbout | undefined {
    return this.store.list().find(entry => entry.key === key);
  }

  getById(id: string): CompanyAbout | undefined {
    return this.store.getById(id);
  }

  upsert(entry: CompanyAbout): CompanyAbout {
    const existing = this.getByKey(entry.key);
    if (existing) {
      this.store.update(existing.id, entry);
      return { ...existing, ...entry };
    }
    return this.store.create(entry);
  }

  update(id: string, patch: Partial<CompanyAbout>): CompanyAbout | undefined {
    return this.store.update(id, patch);
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
    this.loadingPromise = firstValueFrom(this.http.get<CompanyAbout[]>(this.apiUrl))
      .then(items => {
        this.store.replace(items);
        this.hasLoadedFromApi = true;
      })
      .catch(error => {
        console.error('Failed to load about content from API', error);
      })
      .finally(() => {
        this.loadingPromise = null;
      });
    await this.loadingPromise;
  }
}
