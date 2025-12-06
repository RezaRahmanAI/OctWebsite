import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductShowcaseItem } from '../models';

export interface SaveProductShowcaseRequest {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  backgroundColor: string;
  projectScreenshotUrl: string;
  highlights: string[];
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
    return this.http.post<ProductShowcaseItem>(`${this.baseUrl}/api/home-showcase`, request);
  }

  update(id: string, request: SaveProductShowcaseRequest): Observable<ProductShowcaseItem> {
    return this.http.put<ProductShowcaseItem>(`${this.baseUrl}/api/home-showcase/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/home-showcase/${id}`);
  }
}
