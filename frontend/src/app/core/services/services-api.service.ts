import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ServiceItem } from '../models';

export interface SaveServiceItemRequest {
  title: string;
  slug: string;
  summary: string;
  icon?: string | null;
  features: string[];
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class ServicesApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  list(): Observable<ServiceItem[]> {
    return this.http.get<ServiceItem[]>(`${this.baseUrl}/api/services`);
  }

  getById(id: string): Observable<ServiceItem> {
    return this.http.get<ServiceItem>(`${this.baseUrl}/api/services/${id}`);
  }

  create(request: SaveServiceItemRequest): Observable<ServiceItem> {
    return this.http.post<ServiceItem>(`${this.baseUrl}/api/services`, request);
  }

  update(id: string, request: SaveServiceItemRequest): Observable<ServiceItem> {
    return this.http.put<ServiceItem>(`${this.baseUrl}/api/services/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/services/${id}`);
  }
}
