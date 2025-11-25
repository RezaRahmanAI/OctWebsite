import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MediaResourceModel {
  fileName: string | null;
  url: string | null;
}

export interface AcademyFeatureModel {
  title: string;
  description: string;
  icon: string;
}

export interface FreelancingCourseModel {
  title: string;
  description: string;
  icon: string;
}

export interface AcademyTrackLevelModel {
  title: string;
  duration: string;
  description: string;
  tools: string[];
  outcomes: string[];
  project: string;
  image: string;
}

export interface AdmissionStepModel {
  title: string;
  description: string;
}

export interface AcademyTrackModel {
  id: string;
  title: string;
  slug: string;
  ageRange: string;
  duration: string;
  priceLabel: string;
  audience: string;
  format: string;
  summary: string;
  heroVideo: MediaResourceModel | null;
  heroPoster: MediaResourceModel | null;
  highlights: string[];
  learningOutcomes: string[];
  levels: AcademyTrackLevelModel[];
  admissionSteps: AdmissionStepModel[];
  callToActionLabel: string;
  active: boolean;
}

export interface AcademyPageModel {
  id: string;
  headerEyebrow: string;
  headerTitle: string;
  headerSubtitle: string;
  intro: string;
  heroVideo: MediaResourceModel | null;
  kidsFeatures: AcademyFeatureModel[];
  freelancingCourses: FreelancingCourseModel[];
  tracks: AcademyTrackModel[];
}

export interface SaveAcademyPageRequest {
  headerEyebrow: string;
  headerTitle: string;
  headerSubtitle: string;
  intro: string;
  heroVideoFileName?: string | null;
  kidsFeatures: AcademyFeatureModel[];
  freelancingCourses: FreelancingCourseModel[];
}

export interface SaveAcademyTrackRequest {
  title: string;
  slug: string;
  ageRange: string;
  duration: string;
  priceLabel: string;
  audience: string;
  format: string;
  summary: string;
  heroVideoFileName?: string | null;
  heroPosterFileName?: string | null;
  highlights: string[];
  learningOutcomes: string[];
  levels: AcademyTrackLevelModel[];
  admissionSteps: AdmissionStepModel[];
  callToActionLabel: string;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class AcademyPageApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  readonly page = signal<AcademyPageModel | null>(null);
  readonly tracks = signal<AcademyTrackModel[]>([]);

  loadPage() {
    return this.fetchPage().subscribe(page => {
      this.page.set(page);
      this.tracks.set(page.tracks);
    });
  }

  fetchPage(): Observable<AcademyPageModel> {
    return this.http.get<AcademyPageModel>(`${this.baseUrl}/api/academy-page`).pipe(
      tap(page => this.page.set(page))
    );
  }

  upsertPage(request: SaveAcademyPageRequest): Observable<AcademyPageModel> {
    return this.http
      .put<AcademyPageModel>(`${this.baseUrl}/api/academy-page`, request)
      .pipe(tap(page => this.page.set(page)));
  }

  fetchTracks(): Observable<AcademyTrackModel[]> {
    return this.http
      .get<AcademyTrackModel[]>(`${this.baseUrl}/api/academy-tracks`)
      .pipe(tap(tracks => this.tracks.set(tracks)));
  }

  fetchTrack(slug: string): Observable<AcademyTrackModel> {
    return this.http.get<AcademyTrackModel>(`${this.baseUrl}/api/academy-tracks/${slug}`);
  }

  createTrack(request: SaveAcademyTrackRequest): Observable<AcademyTrackModel> {
    return this.http
      .post<AcademyTrackModel>(`${this.baseUrl}/api/academy-tracks`, request)
      .pipe(
        tap(track => this.tracks.set([...this.tracks(), track]))
      );
  }

  updateTrack(id: string, request: SaveAcademyTrackRequest): Observable<AcademyTrackModel> {
    return this.http
      .put<AcademyTrackModel>(`${this.baseUrl}/api/academy-tracks/${id}`, request)
      .pipe(
        tap(updated => this.tracks.set(this.tracks().map(track => (track.id === id ? updated : track))))
      );
  }

  deleteTrack(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/api/academy-tracks/${id}`).pipe(
      tap(() => this.tracks.set(this.tracks().filter(track => track.id !== id)))
    );
  }
}
