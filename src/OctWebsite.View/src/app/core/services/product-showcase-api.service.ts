import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductShowcaseItem } from '../models';

export interface SaveProductShowcaseRequest {
  name: string;
  slug: string;
  description: string;
  imageUrl?: string | null;
  backgroundColor: string;
  projectScreenshotUrl?: string | null;
  highlights: string[];
  primaryImage?: File | null;
  projectScreenshot?: File | null;
}

@Injectable({ providedIn: 'root' })
export class ProductShowcaseApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  list(): Observable<ProductShowcaseItem[]> {
    return this.http.get<ProductShowcaseItem[]>(`${this.baseUrl}/api/home-showcase`);
  }

  getBySlug(slug: string): Observable<ProductShowcaseItem> {
    return this.http.get<ProductShowcaseItem>(`${this.baseUrl}/api/home-showcase/slug/${slug}`);
  }

  create(request: SaveProductShowcaseRequest): Observable<ProductShowcaseItem> {
    return this.http.post<ProductShowcaseItem>(
      `${this.baseUrl}/api/home-showcase`,
      this.toFormData(request)
    );
  }

  update(id: string, request: SaveProductShowcaseRequest): Observable<ProductShowcaseItem> {
    return this.http.post<ProductShowcaseItem>(
      `${this.baseUrl}/api/home-showcase/${id}`,
      this.toFormData(request)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/home-showcase/${id}`);
  }

  private toFormData(request: SaveProductShowcaseRequest): FormData {
    const form = new FormData();

    form.append('name', request.name);
    form.append('slug', request.slug);
    form.append('description', request.description);
    form.append('backgroundColor', request.backgroundColor);

    if (request.imageUrl) {
      form.append('imageUrl', request.imageUrl);
    }

    if (request.projectScreenshotUrl) {
      form.append('projectScreenshotUrl', request.projectScreenshotUrl);
    }

    request.highlights.forEach((highlight) => form.append('highlights', highlight));

    if (request.primaryImage) {
      form.append('primaryImage', request.primaryImage, request.primaryImage.name);
    }

    if (request.projectScreenshot) {
      form.append('projectScreenshot', request.projectScreenshot, request.projectScreenshot.name);
    }

    return form;
  }
}
