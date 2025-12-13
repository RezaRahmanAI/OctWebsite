import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Faq } from '../models';
import { FaqsApiService, SaveFaqRequest } from './faqs-api.service';

@Injectable({ providedIn: 'root' })
export class FaqsService {
  private readonly api = inject(FaqsApiService);
  private readonly items = signal<Faq[]>([]);
  private readonly loading = signal(false);
  private readonly loaded = signal(false);

  readonly faqs = computed(() =>
    [...this.items()].sort((left, right) =>
      left.displayOrder === right.displayOrder
        ? left.question.localeCompare(right.question)
        : left.displayOrder - right.displayOrder,
    ),
  );

  readonly isLoading = this.loading.asReadonly();

  async load(): Promise<void> {
    if (this.loaded() || this.loading()) {
      return;
    }

    this.loading.set(true);
    try {
      const result = await firstValueFrom(this.api.list());
      this.items.set(result ?? []);
      this.loaded.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  async refresh(): Promise<void> {
    this.loaded.set(false);
    await this.load();
  }

  async create(request: SaveFaqRequest): Promise<Faq> {
    const created = await firstValueFrom(this.api.create(request));
    this.items.update(items => [...items, created]);
    return created;
  }

  async update(id: string, request: SaveFaqRequest): Promise<Faq | undefined> {
    const updated = await firstValueFrom(this.api.update(id, request));
    if (updated) {
      this.items.update(items => items.map(item => (item.id === id ? updated : item)));
    }
    return updated ?? undefined;
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(this.api.delete(id));
    this.items.update(items => items.filter(item => item.id !== id));
  }
}
