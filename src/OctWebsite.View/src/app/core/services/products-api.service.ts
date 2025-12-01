import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductItem } from '../models';

export interface SaveProductRequest {
  title: string;
  slug: string;
  summary: string;
  icon: string;
  features: string[];
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  list(): Observable<ProductItem[]> {
    return this.http.get<ProductItem[]>(`${this.baseUrl}/api/products`);
  }

  getBySlug(slug: string): Observable<ProductItem> {
    return this.http.get<ProductItem>(`${this.baseUrl}/api/products/slug/${slug}`);
  }

  create(request: SaveProductRequest): Observable<ProductItem> {
    return this.http.post<ProductItem>(`${this.baseUrl}/api/products`, request);
  }

  update(id: string, request: SaveProductRequest): Observable<ProductItem> {
    return this.http.put<ProductItem>(`${this.baseUrl}/api/products/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/products/${id}`);
  }
}
