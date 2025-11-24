import { Injectable, computed, inject, signal } from '@angular/core';
import { DATA_PROVIDER } from '../data';
import { BlogPost } from '../models';
import { STATIC_BLOG_POSTS } from '../data/static-blog-posts';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly provider = inject(DATA_PROVIDER);
  private readonly store = this.provider.blog;
  private readonly query = signal('');
  private readonly tagFilter = signal<string | null>(null);

  constructor() {
    this.seedFromStatic();
  }

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

  async create(post: BlogPost): Promise<BlogPost> {
    const created = { ...post, id: post.id ?? this.generateId() };
    this.store.create(created);
    return Promise.resolve(created);
  }

  async update(id: string, patch: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const current = this.store.getById(id);
    if (!current) {
      return undefined;
    }
    const updated = { ...current, ...patch } as BlogPost;
    this.store.update(id, updated);
    return Promise.resolve(updated);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
    return Promise.resolve();
  }

  async refresh(): Promise<void> {
    this.seedFromStatic(true);
  }

  async ensureLoaded(): Promise<void> {
    this.seedFromStatic(true);
  }

  private seedFromStatic(force = false): void {
    if (!force && this.store.list().length > 0) {
      return;
    }
    this.store.replace(STATIC_BLOG_POSTS);
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2);
  }
}
