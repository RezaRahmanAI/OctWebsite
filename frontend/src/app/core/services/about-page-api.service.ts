import { HttpClient } from '@angular/common/http';
import { Injectable, signal, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface MediaResource {
  fileName: string | null;
  url: string | null;
}

export interface AboutValue {
  title: string;
  description: string;
  video: MediaResource | null;
}

export interface AboutPageModel {
  id: string;
  headerEyebrow: string;
  headerTitle: string;
  headerSubtitle: string;
  heroVideo: MediaResource | null;
  intro: string;
  missionTitle: string;
  missionDescription: string;
  visionTitle: string;
  visionDescription: string;
  missionImage: MediaResource | null;
  values: AboutValue[];
  storyTitle: string;
  storyDescription: string;
  storyImage: MediaResource | null;
}

export interface SaveAboutValueRequest {
  title: string;
  description: string;
  videoFileName?: string | null;
}

export interface SaveAboutPageRequest {
  headerEyebrow: string;
  headerTitle: string;
  headerSubtitle: string;
  heroVideoFileName?: string | null;
  intro: string;
  missionTitle: string;
  missionDescription: string;
  visionTitle: string;
  visionDescription: string;
  missionImageFileName?: string | null;
  values: SaveAboutValueRequest[];
  storyTitle: string;
  storyDescription: string;
  storyImageFileName?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AboutPageApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  readonly content = signal<AboutPageModel | null>(null);

  load() {
    return this.http
      .get<AboutPageModel>(`${this.baseUrl}/api/about-page`)
      .subscribe(page => this.content.set(page));
  }

  save(request: SaveAboutPageRequest) {
    return this.http
      .put<AboutPageModel>(`${this.baseUrl}/api/about-page`, request)
      .subscribe(page => this.content.set(page));
  }
}
