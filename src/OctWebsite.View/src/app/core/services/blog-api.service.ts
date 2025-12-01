import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BlogPost } from '../models';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface SaveBlogRequest {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnailFileName?: string | null;
  thumbnailFile?: File | null;
  headerVideoFileName?: string | null;
  headerVideoFile?: File | null;
  tags: string[];
  published: boolean;
  publishedAt?: string | null;
  author?: string | null;
  authorTitle?: string | null;
  readTime?: string | null;
  heroQuote?: string | null;
  keyPoints?: string[];
  stats?: { label: string; value: string }[];
}

@Injectable({ providedIn: 'root' })
export class BlogApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  list(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.baseUrl}/api/blogs`).pipe(map(posts => posts.map(this.hydrate)));
  }

  getBySlug(slug: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.baseUrl}/api/blogs/slug/${slug}`).pipe(map(this.hydrate));
  }

  create(request: SaveBlogRequest): Observable<BlogPost> {
    const form = this.toFormData(request);
    return this.http.post<BlogPost>(`${this.baseUrl}/api/blogs`, form).pipe(map(this.hydrate));
  }

  update(id: string, request: SaveBlogRequest): Observable<BlogPost> {
    const form = this.toFormData(request);
    return this.http.put<BlogPost>(`${this.baseUrl}/api/blogs/${id}`, form).pipe(map(this.hydrate));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/blogs/${id}`);
  }

  private toFormData(request: SaveBlogRequest): FormData {
    const form = new FormData();
    form.append('title', request.title);
    form.append('slug', request.slug);
    form.append('excerpt', request.excerpt);
    form.append('content', request.content);

    if (request.thumbnailFileName) {
      form.append('thumbnailFileName', request.thumbnailFileName);
    }
    if (request.thumbnailFile) {
      form.append('thumbnail', request.thumbnailFile);
    }

    if (request.headerVideoFileName) {
      form.append('headerVideoFileName', request.headerVideoFileName);
    }
    if (request.headerVideoFile) {
      form.append('headerVideo', request.headerVideoFile);
    }

    request.tags.forEach(tag => form.append('tags', tag));
    form.append('published', String(request.published));
    if (request.publishedAt) {
      form.append('publishedAt', request.publishedAt);
    }
    if (request.author !== undefined) {
      form.append('author', request.author ?? '');
    }
    if (request.authorTitle !== undefined) {
      form.append('authorTitle', request.authorTitle ?? '');
    }
    if (request.readTime !== undefined) {
      form.append('readTime', request.readTime ?? '');
    }
    if (request.heroQuote !== undefined) {
      form.append('heroQuote', request.heroQuote ?? '');
    }

    request.keyPoints?.forEach(point => form.append('keyPoints', point));
    request.stats?.forEach((stat, index) => {
      form.append(`stats[${index}].label`, stat.label);
      form.append(`stats[${index}].value`, stat.value);
    });

    return form;
  }

  private hydrate(post: BlogPost): BlogPost {
    return {
      ...post,
      coverUrl: post.thumbnailUrl ?? post.coverUrl,
      headerVideoUrl: post.headerVideo?.url ?? post.headerVideoUrl ?? null,
    };
  }
}
