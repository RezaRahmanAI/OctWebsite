import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MediaUploadResponse {
  url: string;
  fileName: string;
}

@Injectable({ providedIn: 'root' })
export class MediaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  upload(file: File, category = 'general'): Observable<MediaUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<MediaUploadResponse>(`${this.baseUrl}/api/media/upload?category=${encodeURIComponent(category)}`, formData);
  }
}
