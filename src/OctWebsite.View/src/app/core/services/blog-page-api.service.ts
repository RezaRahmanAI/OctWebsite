import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface BlogPageModel {
  id: string;
  headerEyebrow: string;
  headerTitle: string;
  headerSubtitle: string;
  heroVideo: { fileName: string | null; url: string | null } | null;
}

export interface SaveBlogPageRequest {
  headerEyebrow: string;
  headerTitle: string;
  headerSubtitle: string;
  heroVideoFileName?: string | null;
  heroVideoFile?: File | null;
}

@Injectable({ providedIn: 'root' })
export class BlogPageApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  readonly content = signal<BlogPageModel | null>(null);

  load() {
    this.fetch().subscribe();
  }

  fetch(): Observable<BlogPageModel> {
    return this.http
      .get<BlogPageModel>(`${this.baseUrl}/api/blog-page`)
      .pipe(tap((page) => this.content.set(page)));
  }

  update(request: SaveBlogPageRequest): Observable<BlogPageModel> {
    const form = new FormData();
    form.append('headerEyebrow', request.headerEyebrow);
    form.append('headerTitle', request.headerTitle);
    form.append('headerSubtitle', request.headerSubtitle);
    if (request.heroVideoFileName) {
      form.append('heroVideoFileName', request.heroVideoFileName);
    }
    if (request.heroVideoFile) {
      form.append('heroVideo', request.heroVideoFile);
    }

    return this.http
      .post<BlogPageModel>(`${this.baseUrl}/api/blog-page`, form)
      .pipe(tap((page) => this.content.set(page)));
  }
}
