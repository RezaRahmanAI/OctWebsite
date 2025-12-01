import { Injectable, computed, signal } from '@angular/core';
import { AcademyTrack, BlogPost, CompanyAbout, Lead, ProductItem, ServiceItem, TeamMember } from '../models';
import { DataProvider, EntityStore } from './data-provider';

interface StoreOptions<T> {
  slug?: (item: T) => string | undefined;
}

@Injectable({ providedIn: 'root' })
export class SignalStoreProvider implements DataProvider {
  readonly team = this.createStore<TeamMember>();
  readonly about = this.createStore<CompanyAbout>();
  readonly services = this.createStore<ServiceItem>({
    slug: item => (item as { slug?: string }).slug,
  });
  readonly products = this.createStore<ProductItem>({
    slug: item => (item as { slug?: string }).slug,
  });
  readonly academy = this.createStore<AcademyTrack>({
    slug: item => (item as { slug?: string }).slug,
  });
  readonly blog = this.createStore<BlogPost>({
    slug: item => (item as { slug?: string }).slug,
  });
  readonly leads = this.createStore<Lead>();

  private createStore<T extends { id: string }>(options: StoreOptions<T> = {}): EntityStore<T> {
    const state = signal<T[]>([]);
    const count = computed(() => state().length);

    const store: EntityStore<T> = {
      items: state.asReadonly(),
      count,
      list: () => state(),
      getById: (id: string) => state().find(item => item.id === id),
      create: (item: T) => {
        state.update(items => [...items, item]);
        return item;
      },
      update: (id: string, patch: Partial<T>) => {
        let updated: T | undefined;
        state.update(items =>
          items.map(item => {
            if (item.id === id) {
              updated = { ...item, ...patch };
              return updated as T;
            }
            return item;
          }),
        );
        return updated;
      },
      delete: (id: string) => {
        state.update(items => items.filter(item => item.id !== id));
      },
      replace: (items: T[]) => state.set(items),
    };

    if (options.slug) {
      store.getBySlug = (slug: string) => state().find(item => options.slug?.(item) === slug);
    }

    return store;
  }
}
