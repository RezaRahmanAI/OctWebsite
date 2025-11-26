import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { HomeContent } from '../models';

export interface HomePageResponse {
  id: string;
  content: HomeContent;
}

@Injectable({ providedIn: 'root' })
export class HomePageApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  readonly content = signal<HomeContent | null>(null);

  fetch(): Observable<HomePageResponse> {
    return this.http.get<HomePageResponse>(`${this.baseUrl}/api/home-page`).pipe(
      tap(response => this.content.set(response.content)),
    );
  }

  update(content: HomeContent): Observable<HomePageResponse> {
    return this.http.put<HomePageResponse>(`${this.baseUrl}/api/home-page`, content).pipe(
      tap(response => this.content.set(response.content)),
    );
  }
}
