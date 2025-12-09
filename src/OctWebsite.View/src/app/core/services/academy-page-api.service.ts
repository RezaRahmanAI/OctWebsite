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
  heroVideoFile?: File | null;
  kidsFeatures: AcademyFeatureModel[];
  freelancingCourses: FreelancingCourseModel[];
}

export interface SaveAcademyTrackLevelRequest extends Omit<AcademyTrackLevelModel, 'image'> {
  image: string;
  imageFileName?: string | null;
  imageFile?: File | null;
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
  heroVideoFile?: File | null;
  heroPosterFile?: File | null;
  highlights: string[];
  learningOutcomes: string[];
  levels: SaveAcademyTrackLevelRequest[];
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
    return this.fetchPage().subscribe((page) => {
      this.page.set(page);
      this.tracks.set(page.tracks);
    });
  }

  fetchPage(): Observable<AcademyPageModel> {
    return this.http
      .get<AcademyPageModel>(`${this.baseUrl}/api/academy-page`)
      .pipe(tap((page) => this.page.set(page)));
  }

  upsertPage(request: SaveAcademyPageRequest): Observable<AcademyPageModel> {
    const form = new FormData();
    form.append('headerEyebrow', request.headerEyebrow);
    form.append('headerTitle', request.headerTitle);
    form.append('headerSubtitle', request.headerSubtitle);
    form.append('intro', request.intro);

    if (request.heroVideoFileName) {
      form.append('heroVideoFileName', request.heroVideoFileName);
    }

    if (request.heroVideoFile) {
      form.append('heroVideo', request.heroVideoFile);
    }

    request.kidsFeatures.forEach((feature, index) => {
      form.append(`kidsFeatures[${index}].title`, feature.title);
      form.append(`kidsFeatures[${index}].description`, feature.description);
      form.append(`kidsFeatures[${index}].icon`, feature.icon);
    });

    request.freelancingCourses.forEach((course, index) => {
      form.append(`freelancingCourses[${index}].title`, course.title);
      form.append(`freelancingCourses[${index}].description`, course.description);
      form.append(`freelancingCourses[${index}].icon`, course.icon);
    });

    return this.http
      .post<AcademyPageModel>(`${this.baseUrl}/api/academy-page`, form)
      .pipe(tap((page) => this.page.set(page)));
  }

  fetchTracks(): Observable<AcademyTrackModel[]> {
    return this.http
      .get<AcademyTrackModel[]>(`${this.baseUrl}/api/academy-tracks`)
      .pipe(tap((tracks) => this.tracks.set(tracks)));
  }

  fetchTrack(slug: string): Observable<AcademyTrackModel> {
    return this.http.get<AcademyTrackModel>(`${this.baseUrl}/api/academy-tracks/${slug}`);
  }

  createTrack(request: SaveAcademyTrackRequest): Observable<AcademyTrackModel> {
    const formData = this.buildTrackFormData(request);
    return this.http
      .post<AcademyTrackModel>(`${this.baseUrl}/api/academy-tracks`, formData)
      .pipe(tap((track) => this.tracks.set([...this.tracks(), track])));
  }

  updateTrack(id: string, request: SaveAcademyTrackRequest): Observable<AcademyTrackModel> {
    const formData = this.buildTrackFormData(request);
    return this.http
      .post<AcademyTrackModel>(`${this.baseUrl}/api/academy-tracks/${id}`, formData)
      .pipe(
        tap((updated) =>
          this.tracks.set(this.tracks().map((track) => (track.id === id ? updated : track)))
        )
      );
  }

  deleteTrack(id: string) {
    return this.http
      .delete<void>(`${this.baseUrl}/api/academy-tracks/${id}`)
      .pipe(tap(() => this.tracks.set(this.tracks().filter((track) => track.id !== id))));
  }

  private buildTrackFormData(request: SaveAcademyTrackRequest): FormData {
    const form = new FormData();
    form.append('title', request.title);
    form.append('slug', request.slug);
    form.append('ageRange', request.ageRange);
    form.append('duration', request.duration);
    form.append('priceLabel', request.priceLabel);
    form.append('audience', request.audience);
    form.append('format', request.format);
    form.append('summary', request.summary);

    if (request.heroVideoFileName) {
      form.append('heroVideoFileName', request.heroVideoFileName);
    }

    if (request.heroPosterFileName) {
      form.append('heroPosterFileName', request.heroPosterFileName);
    }

    if (request.heroVideoFile) {
      form.append('heroVideo', request.heroVideoFile);
    }

    if (request.heroPosterFile) {
      form.append('heroPoster', request.heroPosterFile);
    }

    request.highlights.forEach((highlight, index) => {
      form.append(`highlights[${index}]`, highlight);
    });

    request.learningOutcomes.forEach((outcome, index) => {
      form.append(`learningOutcomes[${index}]`, outcome);
    });

    request.levels.forEach((level, levelIndex) => {
      form.append(`levels[${levelIndex}].title`, level.title);
      form.append(`levels[${levelIndex}].duration`, level.duration);
      form.append(`levels[${levelIndex}].description`, level.description);
      form.append(`levels[${levelIndex}].project`, level.project);

      if (level.imageFileName) {
        form.append(`levels[${levelIndex}].imageFileName`, level.imageFileName);
      }

      if (level.imageFile) {
        form.append(`levels[${levelIndex}].imageFile`, level.imageFile);
      }

      level.tools.forEach((tool, toolIndex) => {
        form.append(`levels[${levelIndex}].tools[${toolIndex}]`, tool);
      });

      level.outcomes.forEach((outcome, outcomeIndex) => {
        form.append(`levels[${levelIndex}].outcomes[${outcomeIndex}]`, outcome);
      });
    });

    request.admissionSteps.forEach((step, index) => {
      form.append(`admissionSteps[${index}].title`, step.title);
      form.append(`admissionSteps[${index}].description`, step.description);
    });

    form.append('callToActionLabel', request.callToActionLabel);
    form.append('active', String(request.active));

    return form;
  }
}
