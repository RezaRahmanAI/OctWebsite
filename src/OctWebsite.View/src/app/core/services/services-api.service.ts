import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ServiceItem } from '../models';

export interface SaveServiceRequest {
  title: string;
  subtitle?: string | null;
  slug: string;
  summary: string;
  description?: string | null;
  icon?: string | null;
  backgroundImage?: File | null;
  backgroundImageFileName?: string | null;
  features: string[];
  active: boolean;
  featured: boolean;
}

@Injectable({ providedIn: 'root' })
export class ServicesApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  list(): Observable<ServiceItem[]> {
    return this.http.get<ServiceItem[]>(`${this.baseUrl}/api/services`);
  }

  getBySlug(slug: string): Observable<ServiceItem> {
    return this.http.get<ServiceItem>(`${this.baseUrl}/api/services/slug/${slug}`);
  }

  create(request: SaveServiceRequest): Observable<ServiceItem> {
    return this.http.post<ServiceItem>(`${this.baseUrl}/api/services`, this.buildFormData(request));
  }

  update(id: string, request: SaveServiceRequest): Observable<ServiceItem> {
    return this.http.put<ServiceItem>(`${this.baseUrl}/api/services/${id}`, this.buildFormData(request));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/services/${id}`);
  }

  private buildFormData(request: SaveServiceRequest): FormData {
    const formData = new FormData();

    formData.append('title', request.title);
    formData.append('slug', request.slug);
    formData.append('summary', request.summary);
    formData.append('active', String(request.active));
    formData.append('featured', String(request.featured));

    if (request.subtitle) {
      formData.append('subtitle', request.subtitle);
    }

    if (request.description) {
      formData.append('description', request.description);
    }

    if (request.icon) {
      formData.append('icon', request.icon);
    }

    if (request.backgroundImageFileName) {
      formData.append('backgroundImageFileName', request.backgroundImageFileName);
    }

    if (request.backgroundImage) {
      formData.append('backgroundImage', request.backgroundImage, request.backgroundImage.name);
    }
    request.features.forEach(feature => formData.append('features', feature));

    return formData;
  }
}
