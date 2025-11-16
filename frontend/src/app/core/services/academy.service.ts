import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DATA_PROVIDER } from '../data';
import { AcademyTrack } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AcademyService {
  private readonly provider = inject(DATA_PROVIDER);
  private readonly store = this.provider.academy;
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/academy/tracks`;
  private loadingPromise: Promise<void> | null = null;
  private hasLoadedFromApi = false;

  constructor() {
    void this.ensureLoaded();
  }

  readonly tracks = computed(() => this.store.list().filter(track => track.active));
  readonly all = this.store.items;

  list(): AcademyTrack[] {
    return this.store.list();
  }

  getById(id: string): AcademyTrack | undefined {
    return this.store.getById(id);
  }

  getBySlug(slug: string): AcademyTrack | undefined {
    return this.store.getBySlug?.(slug);
  }

  async create(track: AcademyTrack): Promise<AcademyTrack> {
    const payload = this.toRequest(track);
    const created = await firstValueFrom(this.http.post<AcademyTrack>(this.apiUrl, payload));
    this.store.create(created);
    return created;
  }

  async update(id: string, patch: Partial<AcademyTrack>): Promise<AcademyTrack | undefined> {
    const current = this.store.getById(id);
    if (!current) {
      return undefined;
    }
    const payload = this.toRequest({ ...current, ...patch });
    const updated = await firstValueFrom(this.http.put<AcademyTrack>(`${this.apiUrl}/${id}`, payload));
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
    this.loadingPromise = firstValueFrom(this.http.get<AcademyTrack[]>(this.apiUrl))
      .then(items => {
        this.store.replace(items);
        this.hasLoadedFromApi = true;
      })
      .catch(error => {
        console.error('Failed to load academy tracks from API', error);
      })
      .finally(() => {
        this.loadingPromise = null;
      });
    await this.loadingPromise;
  }

  private toRequest(track: Partial<AcademyTrack>): Omit<AcademyTrack, 'id'> {
    return {
      title: track.title ?? '',
      slug: track.slug ?? '',
      ageRange: track.ageRange,
      duration: track.duration ?? '',
      priceLabel: track.priceLabel ?? '',
      levels: track.levels ?? [],
      active: track.active ?? true,
    };
  }
}
