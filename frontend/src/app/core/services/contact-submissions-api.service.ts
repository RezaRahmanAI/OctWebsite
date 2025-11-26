import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  interest?: string | null;
  message: string;
  createdAt: string;
}

export interface SubmitContactFormRequest {
  name: string;
  email: string;
  phone?: string | null;
  interest?: string | null;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactSubmissionsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  submit(request: SubmitContactFormRequest): Observable<ContactSubmission> {
    return this.http.post<ContactSubmission>(`${this.baseUrl}/api/contact-submissions`, request);
  }

  getRecent(take = 200): Observable<ContactSubmission[]> {
    return this.http.get<ContactSubmission[]>(`${this.baseUrl}/api/contact-submissions`, {
      params: { take },
    });
  }
}
