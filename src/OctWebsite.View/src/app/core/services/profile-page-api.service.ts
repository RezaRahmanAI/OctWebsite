import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProfileMediaResource {
  fileName: string | null;
  url: string | null;
}

export interface ProfileStatModel {
  label: string;
  value: string;
  description: string;
}

export interface ProfilePillarModel {
  title: string;
  description: string;
  accent: string;
}

export interface ProfilePageModel {
  id: string;
  headerEyebrow: string;
  headerTitle: string;
  headerSubtitle: string;
  heroTagline: string;
  heroImage: ProfileMediaResource | null;
  downloadLabel: string;
  download: ProfileMediaResource | null;
  overviewTitle: string;
  overviewDescription: string;
  stats: ProfileStatModel[];
  pillars: ProfilePillarModel[];
  spotlightTitle: string;
  spotlightDescription: string;
  spotlightBadge: string;
}

export interface SaveProfilePageRequest {
  headerEyebrow: string;
  headerTitle: string;
  headerSubtitle: string;
  heroTagline: string;
  heroImageFileName?: string | null;
  heroImageFile?: File | null;
  downloadLabel: string;
  downloadFileName?: string | null;
  downloadFile?: File | null;
  downloadUrl?: string | null;
  overviewTitle: string;
  overviewDescription: string;
  stats: ProfileStatModel[];
  pillars: ProfilePillarModel[];
  spotlightTitle: string;
  spotlightDescription: string;
  spotlightBadge: string;
}

@Injectable({ providedIn: 'root' })
export class ProfilePageApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  readonly content = signal<ProfilePageModel | null>(null);

  load(): void {
    this.fetch().subscribe((page) => this.content.set(page));
  }

  fetch(): Observable<ProfilePageModel> {
    return this.http
      .get<ProfilePageModel>(`${this.baseUrl}/api/profile-page`)
      .pipe(tap((page) => this.content.set(page)));
  }

  update(request: SaveProfilePageRequest): Observable<ProfilePageModel> {
    const form = new FormData();
    form.append('headerEyebrow', request.headerEyebrow);
    form.append('headerTitle', request.headerTitle);
    form.append('headerSubtitle', request.headerSubtitle);
    form.append('heroTagline', request.heroTagline);
    form.append('downloadLabel', request.downloadLabel);
    form.append('overviewTitle', request.overviewTitle);
    form.append('overviewDescription', request.overviewDescription);
    form.append('spotlightTitle', request.spotlightTitle);
    form.append('spotlightDescription', request.spotlightDescription);
    form.append('spotlightBadge', request.spotlightBadge);

    if (request.heroImageFileName) {
      form.append('heroImageFileName', request.heroImageFileName);
    }
    if (request.heroImageFile) {
      form.append('heroImage', request.heroImageFile);
    }

    if (request.downloadFileName) {
      form.append('downloadFileName', request.downloadFileName);
    }
    if (request.downloadFile) {
      form.append('downloadFile', request.downloadFile);
    }
    if (request.downloadUrl !== undefined && request.downloadUrl !== null) {
      form.append('downloadUrl', request.downloadUrl);
    }

    form.append('statsJson', JSON.stringify(request.stats));
    form.append('pillarsJson', JSON.stringify(request.pillars));

    return this.http
      .post<ProfilePageModel>(`${this.baseUrl}/api/profile-page`, form)
      .pipe(tap((page) => this.content.set(page)));
  }
}
