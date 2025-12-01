import { Injectable, OnDestroy, computed, inject, signal } from '@angular/core';
import { DATA_PROVIDER } from '../data';
import { BlogPost } from '../models';
import { BlogApiService, SaveBlogRequest } from './blog-api.service';
import { Subscription, firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BlogService implements OnDestroy {
  private readonly provider = inject(DATA_PROVIDER);
  private readonly store = this.provider.blog;
  private readonly api = inject(BlogApiService);
  private readonly query = signal('');
  private readonly tagFilter = signal<string | null>(null);
  private readonly loaded = signal(false);
  private readonly loading = signal(false);
  private subscription: Subscription | null = null;

  constructor() {
    this.refresh();
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

  readonly isLoading = this.loading.asReadonly();

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

  async ensureLoaded(): Promise<void> {
    if (this.loaded()) {
      return;
    }
    await this.refresh();
  }

  async create(post: SaveBlogRequest): Promise<BlogPost> {
    const created = await firstValueFrom(this.api.create(post));
    if (created) {
      this.store.create(created);
    }
    return created as BlogPost;
  }

  async update(id: string, request: SaveBlogRequest): Promise<BlogPost | undefined> {
    const updated = await firstValueFrom(this.api.update(id, request));
    if (updated) {
      this.store.update(id, updated);
    }
    return updated ?? undefined;
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(this.api.delete(id));
    this.store.delete(id);
  }

  async refresh(): Promise<void> {
    if (this.loading()) {
      return;
    }
    this.loading.set(true);
    this.subscription?.unsubscribe();
    this.subscription = this.api.list().subscribe({
      next: posts => {
        this.store.replace(posts);
        this.loaded.set(true);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
