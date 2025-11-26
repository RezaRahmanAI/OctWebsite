import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ServicesMediaResource {
  fileName: string | null;
  url: string | null;
}

export interface ServicesPageModel {
  id: string;
  headerEyebrow: string;
  headerTitle: string;
  headerSubtitle: string;
  heroVideo: ServicesMediaResource | null;
}

export interface SaveServicesPageRequest {
  headerEyebrow: string;
  headerTitle: string;
  headerSubtitle: string;
  heroVideoFileName?: string | null;
  heroVideoFile?: File | null;
}

@Injectable({ providedIn: 'root' })
export class ServicesPageApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  readonly content = signal<ServicesPageModel | null>(null);

  load(): void {
    this.fetch().subscribe();
  }

  fetch(): Observable<ServicesPageModel> {
    return this.http
      .get<ServicesPageModel>(`${this.baseUrl}/api/services-page`)
      .pipe(tap(page => this.content.set(page)));
  }

  update(request: SaveServicesPageRequest): Observable<ServicesPageModel> {
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
      .put<ServicesPageModel>(`${this.baseUrl}/api/services-page`, form)
      .pipe(tap(page => this.content.set(page)));
  }
}
