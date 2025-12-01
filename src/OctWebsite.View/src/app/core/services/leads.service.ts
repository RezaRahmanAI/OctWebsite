import { Injectable, computed, inject } from '@angular/core';
import { DATA_PROVIDER } from '../data';
import { Lead } from '../models';

@Injectable({ providedIn: 'root' })
export class LeadsService {
  private readonly provider = inject(DATA_PROVIDER);
  private readonly store = this.provider.leads;

  readonly leads = computed(() =>
    this.store
      .list()
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  );

  readonly count = this.store.count;

  list(): Lead[] {
    return this.leads();
  }

  getById(id: string): Lead | undefined {
    return this.store.getById(id);
  }

  create(lead: Lead): Lead {
    return this.store.create(lead);
  }

  delete(id: string): void {
    this.store.delete(id);
  }
}
