import { Injectable, computed, inject } from '@angular/core';
import { DATA_PROVIDER } from '../data';
import { AcademyTrack } from '../models';

@Injectable({ providedIn: 'root' })
export class AcademyService {
  private readonly provider = inject(DATA_PROVIDER);
  private readonly store = this.provider.academy;
  private readonly defaultTracks: AcademyTrack[] = [];

  constructor() {
    this.seedDefaults();
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
    const created: AcademyTrack = { ...track, id: track.id ?? this.generateId() };
    this.store.create(created);
    return Promise.resolve(created);
  }

  async update(id: string, patch: Partial<AcademyTrack>): Promise<AcademyTrack | undefined> {
    const current = this.store.getById(id);
    if (!current) {
      return undefined;
    }
    const updated: AcademyTrack = { ...current, ...patch } as AcademyTrack;
    this.store.update(id, updated);
    return Promise.resolve(updated);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
    return Promise.resolve();
  }

  async refresh(): Promise<void> {
    this.seedDefaults(true);
  }

  async ensureLoaded(): Promise<void> {
    this.seedDefaults(true);
  }

  private seedDefaults(force = false): void {
    if (!force && this.store.list().length > 0) {
      return;
    }
    this.store.replace(this.defaultTracks);
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2);
  }
}
