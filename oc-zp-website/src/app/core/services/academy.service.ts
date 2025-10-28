import { Injectable, computed, inject } from '@angular/core';
import { DATA_PROVIDER } from '../data';
import { AcademyTrack } from '../models';

@Injectable({ providedIn: 'root' })
export class AcademyService {
  private readonly provider = inject(DATA_PROVIDER);
  private readonly store = this.provider.academy;

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

  create(track: AcademyTrack): AcademyTrack {
    return this.store.create(track);
  }

  update(id: string, patch: Partial<AcademyTrack>): AcademyTrack | undefined {
    return this.store.update(id, patch);
  }

  delete(id: string): void {
    this.store.delete(id);
  }
}
