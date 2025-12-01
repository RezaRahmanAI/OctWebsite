import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProductPageMediaResource {
  fileName: string | null;
  url: string | null;
}

export interface ProductPageModel {
  id: string;
  headerEyebrow: string;
  headerTitle: string;
  headerSubtitle: string;
  heroVideo: ProductPageMediaResource | null;
}

export interface SaveProductPageRequest {
  headerEyebrow: string;
  headerTitle: string;
  headerSubtitle: string;
  heroVideoFileName?: string | null;
  heroVideoFile?: File | null;
}

@Injectable({ providedIn: 'root' })
export class ProductPageApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  readonly content = signal<ProductPageModel | null>(null);

  load(): void {
    this.fetch().subscribe();
  }

  fetch(): Observable<ProductPageModel> {
    return this.http
      .get<ProductPageModel>(`${this.baseUrl}/api/products-page`)
      .pipe(tap(page => this.content.set(page)));
  }

  update(request: SaveProductPageRequest): Observable<ProductPageModel> {
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
      .put<ProductPageModel>(`${this.baseUrl}/api/products-page`, form)
      .pipe(tap(page => this.content.set(page)));
  }
}
