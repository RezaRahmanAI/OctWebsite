import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CareerPageModel {
  id: string;
  headerEyebrow: string;
  headerTitle: string;
  headerSubtitle: string;
  heroVideo?: { fileName: string | null; url: string | null } | null;
  heroMetaLine: string;
  primaryCtaLabel: string;
  primaryCtaLink: string;
  responseTime: string;
}

export interface SaveCareerPageRequest {
  headerEyebrow: string;
  headerTitle: string;
  headerSubtitle: string;
  heroVideoFileName?: string | null;
  heroVideoFile?: File | null;
  heroMetaLine: string;
  primaryCtaLabel: string;
  primaryCtaLink: string;
  responseTime: string;
}

@Injectable({ providedIn: 'root' })
export class CareerPageApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  readonly content = signal<CareerPageModel | null>(null);

  load(): void {
    this.fetch().subscribe((page) => this.content.set(page));
  }

  fetch(): Observable<CareerPageModel> {
    return this.http
      .get<CareerPageModel>(`${this.baseUrl}/api/career-page`)
      .pipe(tap((page) => this.content.set(page)));
  }

  update(request: SaveCareerPageRequest): Observable<CareerPageModel> {
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
    form.append('heroMetaLine', request.heroMetaLine);
    form.append('primaryCtaLabel', request.primaryCtaLabel);
    form.append('primaryCtaLink', request.primaryCtaLink);
    form.append('responseTime', request.responseTime);

    return this.http
      .post<CareerPageModel>(`${this.baseUrl}/api/career-page`, form)
      .pipe(tap((page) => this.content.set(page)));
  }
}
