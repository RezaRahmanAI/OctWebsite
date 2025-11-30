import { HttpClient } from '@angular/common/http';
import { Injectable, signal, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

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
  teamTitle: string;
  teamSubtitle: string;
  teamNote: string | null;
}

export interface SaveAboutValueRequest {
  title: string;
  description: string;
  videoFileName?: string | null;
  videoFile?: File | null;
}

export interface SaveAboutPageRequest {
  headerEyebrow: string;
  headerTitle: string;
  headerSubtitle: string;
  heroVideoFileName?: string | null;
  heroVideoFile?: File | null;
  intro: string;
  missionTitle: string;
  missionDescription: string;
  visionTitle: string;
  visionDescription: string;
  missionImageFileName?: string | null;
  missionImageFile?: File | null;
  values: SaveAboutValueRequest[];
  storyTitle: string;
  storyDescription: string;
  storyImageFileName?: string | null;
  storyImageFile?: File | null;
  teamTitle: string;
  teamSubtitle: string;
  teamNote?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AboutPageApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  readonly content = signal<AboutPageModel | null>(null);

  load() {
    return this.fetch().subscribe(page => this.content.set(page));
  }

  fetch(): Observable<AboutPageModel> {
    return this.http.get<AboutPageModel>(`${this.baseUrl}/api/about-page`);
  }

  save(request: SaveAboutPageRequest) {
    return this.update(request).subscribe(page => this.content.set(page));
  }

  update(request: SaveAboutPageRequest): Observable<AboutPageModel> {
    const form = new FormData();
    form.append('headerEyebrow', request.headerEyebrow);
    form.append('headerTitle', request.headerTitle);
    form.append('headerSubtitle', request.headerSubtitle);
    if (request.heroVideoFileName) {
      form.append('heroVideoFileName', request.heroVideoFileName);
    }
    if (request.heroVideoFile) {
      form.append('heroVideo', request.heroVideoFile);
    }
    form.append('intro', request.intro);
    form.append('missionTitle', request.missionTitle);
    form.append('missionDescription', request.missionDescription);
    form.append('visionTitle', request.visionTitle);
    form.append('visionDescription', request.visionDescription);
    if (request.missionImageFileName) {
      form.append('missionImageFileName', request.missionImageFileName);
    }
    if (request.missionImageFile) {
      form.append('missionImage', request.missionImageFile);
    }

    request.values.forEach((value, index) => {
      form.append(`values[${index}].title`, value.title);
      form.append(`values[${index}].description`, value.description);
      if (value.videoFileName) {
        form.append(`values[${index}].videoFileName`, value.videoFileName);
      }
      if (value.videoFile) {
        form.append(`values[${index}].video`, value.videoFile);
      }
    });

    form.append('storyTitle', request.storyTitle);
    form.append('storyDescription', request.storyDescription);
    if (request.storyImageFileName) {
      form.append('storyImageFileName', request.storyImageFileName);
    }
    if (request.storyImageFile) {
      form.append('storyImage', request.storyImageFile);
    }

    form.append('teamTitle', request.teamTitle);
    form.append('teamSubtitle', request.teamSubtitle);
    if (request.teamNote !== undefined) {
      form.append('teamNote', request.teamNote ?? '');
    }

    return this.http
      .post<AboutPageModel>(`${this.baseUrl}/api/about-page`, form)
      .pipe(tap(page => this.content.set(page)));
  }
}
