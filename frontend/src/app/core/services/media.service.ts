import { Injectable } from '@angular/core';
import { Observable, defer, of } from 'rxjs';

interface MediaUploadResponse {
  url: string;
}

@Injectable({ providedIn: 'root' })
export class MediaService {
  uploadVideo(file: File): Observable<MediaUploadResponse> {
    return defer(() => of({ url: URL.createObjectURL(file) }));
  }
}
