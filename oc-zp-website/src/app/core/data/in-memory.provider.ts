import { Injectable, computed, effect, signal } from '@angular/core';
import { DataProvider, EntityStore } from './data-provider';
import {
  academySeed,
  aboutSeed,
  blogSeed,
  leadsSeed,
  productsSeed,
  servicesSeed,
  settingsSeed,
  teamSeed,
} from './in-memory.data';
import { loadFromStorage, saveToStorage } from '../utils/storage';

interface StoreOptions<T> {
  slug?: (item: T) => string | undefined;
}

@Injectable({ providedIn: 'root' })
export class InMemoryProvider implements DataProvider {
  readonly team = this.createStore('team', teamSeed);
  readonly about = this.createStore('about', aboutSeed);
  readonly services = this.createStore('services', servicesSeed, {
    slug: item => (item as { slug?: string }).slug,
  });
  readonly products = this.createStore('products', productsSeed, {
    slug: item => (item as { slug?: string }).slug,
  });
  readonly academy = this.createStore('academy', academySeed, {
    slug: item => (item as { slug?: string }).slug,
  });
  readonly blog = this.createStore('blog', blogSeed, {
    slug: item => (item as { slug?: string }).slug,
  });
  readonly leads = this.createStore('leads', leadsSeed);
  readonly settings = this.createStore('settings', settingsSeed);

  private createStore<T extends { id: string }>(key: string, seed: T[], options: StoreOptions<T> = {}): EntityStore<T> {
    const storageKey = `data:${key}`;
    const initial = loadFromStorage(storageKey, seed);
    const state = signal<T[]>(initial);
    effect(() => {
      saveToStorage(storageKey, state());
    });
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
