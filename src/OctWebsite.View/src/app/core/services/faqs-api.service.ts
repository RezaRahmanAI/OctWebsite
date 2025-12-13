import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Faq } from '../models';

export interface SaveFaqRequest {
  question: string;
  answer: string;
  displayOrder: number;
}

@Injectable({ providedIn: 'root' })
export class FaqsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  list(): Observable<Faq[]> {
    return this.http.get<Faq[]>(`${this.baseUrl}/api/faqs`);
  }

  create(request: SaveFaqRequest): Observable<Faq> {
    return this.http.post<Faq>(`${this.baseUrl}/api/faqs`, request);
  }

  update(id: string, request: SaveFaqRequest): Observable<Faq> {
    return this.http.post<Faq>(`${this.baseUrl}/api/faqs/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/faqs/${id}`);
  }
}
