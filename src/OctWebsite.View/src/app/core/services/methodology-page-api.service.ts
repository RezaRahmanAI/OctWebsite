import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MediaResourceModel {
  fileName: string | null;
  url: string | null;
}

export interface StatHighlightModel {
  label: string;
  value: string;
}

export interface MatrixColumnModel {
  key: string;
  label: string;
}

export interface MatrixFeatureModel {
  name: string;
  appliesTo: string[];
}

export interface BenefitCardModel {
  title: string;
  description: string;
}

export interface ProcessStepModel {
  title: string;
  description: string;
}

export interface MethodologyClosingModel {
  title: string;
  bullets: string[];
  ctaLabel: string;
}

export interface MethodologyOfferingModel {
  id: string;
  slug: string;
  badge: string;
  headline: string;
  subheadline: string;
  intro: string[];
  stats: StatHighlightModel[];
  benefits: BenefitCardModel[];
  process: ProcessStepModel[];
  closing: MethodologyClosingModel;
  active: boolean;
}

export interface MethodologyPageModel {
  headerEyebrow: string;
  headerTitle: string;
  headerSubtitle: string;
  heroDescription: string;
  heroVideo: MediaResourceModel | null;
  heroHighlights: StatHighlightModel[];
  matrixColumns: MatrixColumnModel[];
  featureMatrix: MatrixFeatureModel[];
  contactFields: string[];
  offerings: MethodologyOfferingModel[];
}

export interface SaveMethodologyPageRequest {
  headerEyebrow: string;
  headerTitle: string;
  headerSubtitle: string;
  heroDescription: string;
  heroVideoFileName?: string | null;
  heroVideoFile?: File | null;
  heroHighlights: StatHighlightModel[];
  matrixColumns: MatrixColumnModel[];
  featureMatrix: MatrixFeatureModel[];
  contactFields: string[];
}

export interface SaveMethodologyOfferingRequest extends Omit<MethodologyOfferingModel, 'id'> {}

@Injectable({ providedIn: 'root' })
export class MethodologyPageApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  readonly page = signal<MethodologyPageModel | null>(null);
  readonly offerings = signal<MethodologyOfferingModel[]>([]);

  loadPage(): void {
    this.fetchPage().subscribe();
  }

  fetchPage(): Observable<MethodologyPageModel> {
    return this.http.get<MethodologyPageModel>(`${this.baseUrl}/api/methodology-page`).pipe(
      tap((page) => {
        this.page.set(page);
        this.offerings.set(page.offerings);
      })
    );
  }

  upsertPage(request: SaveMethodologyPageRequest): Observable<MethodologyPageModel> {
    const form = new FormData();
    form.append('headerEyebrow', request.headerEyebrow);
    form.append('headerTitle', request.headerTitle);
    form.append('headerSubtitle', request.headerSubtitle);
    form.append('heroDescription', request.heroDescription);
    if (request.heroVideoFileName) {
      form.append('heroVideoFileName', request.heroVideoFileName);
    }
    if (request.heroVideoFile) {
      form.append('heroVideo', request.heroVideoFile);
    }

    request.heroHighlights.forEach((highlight, index) => {
      form.append(`heroHighlights[${index}].label`, highlight.label);
      form.append(`heroHighlights[${index}].value`, highlight.value);
    });

    request.matrixColumns.forEach((column, index) => {
      form.append(`matrixColumns[${index}].key`, column.key);
      form.append(`matrixColumns[${index}].label`, column.label);
    });

    request.featureMatrix.forEach((feature, featureIndex) => {
      form.append(`featureMatrix[${featureIndex}].name`, feature.name);
      feature.appliesTo.forEach((value, applyIndex) =>
        form.append(`featureMatrix[${featureIndex}].appliesTo[${applyIndex}]`, value)
      );
    });

    request.contactFields.forEach((field, index) => form.append(`contactFields[${index}]`, field));

    return this.http
      .post<MethodologyPageModel>(`${this.baseUrl}/api/methodology-page`, form)
      .pipe(tap((page) => this.page.set(page)));
  }

  fetchOfferings(): Observable<MethodologyOfferingModel[]> {
    return this.http
      .get<MethodologyOfferingModel[]>(`${this.baseUrl}/api/methodology-offerings`)
      .pipe(tap((offerings) => this.offerings.set(offerings)));
  }

  fetchOffering(slug: string): Observable<MethodologyOfferingModel> {
    return this.http.get<MethodologyOfferingModel>(
      `${this.baseUrl}/api/methodology-offerings/${slug}`
    );
  }

  createOffering(request: SaveMethodologyOfferingRequest): Observable<MethodologyOfferingModel> {
    return this.http
      .post<MethodologyOfferingModel>(`${this.baseUrl}/api/methodology-offerings`, request)
      .pipe(tap((offering) => this.offerings.set([...this.offerings(), offering])));
  }

  updateOffering(
    id: string,
    request: SaveMethodologyOfferingRequest
  ): Observable<MethodologyOfferingModel> {
    return this.http
      .post<MethodologyOfferingModel>(`${this.baseUrl}/api/methodology-offerings/${id}`, request)
      .pipe(
        tap((updated) =>
          this.offerings.set(
            this.offerings().map((offering) => (offering.id === id ? updated : offering))
          )
        )
      );
  }

  deleteOffering(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/api/methodology-offerings/${id}`)
      .pipe(
        tap(() => this.offerings.set(this.offerings().filter((offering) => offering.id !== id)))
      );
  }
}
