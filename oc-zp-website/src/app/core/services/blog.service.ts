import { Injectable, computed, inject, signal } from '@angular/core';
import { DATA_PROVIDER } from '../data';
import { BlogPost } from '../models';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly provider = inject(DATA_PROVIDER);
  private readonly store = this.provider.blog;
  private readonly query = signal('');
  private readonly tagFilter = signal<string | null>(null);

  readonly posts = computed(() => {
    const term = this.query().toLowerCase().trim();
    const tag = this.tagFilter();
    return this.store
      .list()
      .filter(post => post.published)
      .filter(post => (tag ? post.tags.includes(tag) : true))
      .filter(post =>
        term
          ? [post.title, post.excerpt, post.tags.join(' ')].some(field => field.toLowerCase().includes(term))
          : true,
      );
  });

  readonly tags = computed(() =>
    Array.from(new Set(this.store.list().flatMap(post => post.tags))).sort((a, b) => a.localeCompare(b)),
  );

  readonly all = this.store.items;

  search(term: string): void {
    this.query.set(term);
  }

  filterByTag(tag: string | null): void {
    this.tagFilter.set(tag);
  }

  list(): BlogPost[] {
    return this.store.list();
  }

  getById(id: string): BlogPost | undefined {
    return this.store.getById(id);
  }

  getBySlug(slug: string): BlogPost | undefined {
    return this.store.getBySlug?.(slug);
  }

  create(post: BlogPost): BlogPost {
    return this.store.create(post);
  }

  update(id: string, patch: Partial<BlogPost>): BlogPost | undefined {
    return this.store.update(id, patch);
  }

  delete(id: string): void {
    this.store.delete(id);
  }
}
