import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ContactMediaResource {
  fileName: string | null;
  url: string | null;
}

export interface ContactPageModel {
  id: string;
  headerEyebrow: string;
  headerTitle: string;
  headerSubtitle: string;
  heroVideo: ContactMediaResource | null;
  heroMetaLine: string;
  primaryCtaLabel: string;
  primaryCtaLink: string;
  consultationOptions: string;
  regionalSupport: string;
  emails: string[];
  formOptions: string[];
  ndaLabel: string;
  responseTime: string;
  officesEyebrow: string;
  officesTitle: string;
  officesDescription: string;
  offices: ContactOfficeModel[];
  mapEmbedUrl: string;
  mapTitle: string;
  headquarters: string;
  businessHours: string[];
  profileDownloadLabel: string;
  profileDownloadUrl: string;
}

export interface SaveContactPageRequest {
  headerEyebrow: string;
  headerTitle: string;
  headerSubtitle: string;
  heroVideoFileName?: string | null;
  heroVideoFile?: File | null;
  heroMetaLine: string;
  primaryCtaLabel: string;
  primaryCtaLink: string;
  consultationOptions: string;
  regionalSupport: string;
  emails: string[];
  formOptions: string[];
  ndaLabel: string;
  responseTime: string;
  officesEyebrow: string;
  officesTitle: string;
  officesDescription: string;
  offices: ContactOfficeModel[];
  mapEmbedUrl: string;
  mapTitle: string;
  headquarters: string;
  businessHours: string[];
  profileDownloadLabel: string;
  profileDownloadUrl: string;
}

export interface ContactOfficeModel {
  name: string;
  headline: string;
  address: string;
  imageUrl: string;
}

@Injectable({ providedIn: 'root' })
export class ContactPageApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  readonly content = signal<ContactPageModel | null>(null);

  load(): void {
    this.fetch().subscribe(page => this.content.set(page));
  }

  fetch(): Observable<ContactPageModel> {
    return this.http.get<ContactPageModel>(`${this.baseUrl}/api/contact-page`).pipe(
      tap(page => this.content.set(page))
    );
  }

  update(request: SaveContactPageRequest): Observable<ContactPageModel> {
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
    form.append('heroMetaLine', request.heroMetaLine);
    form.append('primaryCtaLabel', request.primaryCtaLabel);
    form.append('primaryCtaLink', request.primaryCtaLink);
    form.append('consultationOptions', request.consultationOptions);
    form.append('regionalSupport', request.regionalSupport);
    request.emails.forEach((email, index) => form.append(`emails[${index}]`, email));
    request.formOptions.forEach((option, index) => form.append(`formOptions[${index}]`, option));
    form.append('ndaLabel', request.ndaLabel);
    form.append('responseTime', request.responseTime);
    form.append('officesEyebrow', request.officesEyebrow);
    form.append('officesTitle', request.officesTitle);
    form.append('officesDescription', request.officesDescription);
    form.append('officesJson', JSON.stringify(request.offices));
    form.append('mapEmbedUrl', request.mapEmbedUrl);
    form.append('mapTitle', request.mapTitle);
    form.append('headquarters', request.headquarters);
    request.businessHours.forEach((entry, index) => form.append(`businessHours[${index}]`, entry));
    form.append('profileDownloadLabel', request.profileDownloadLabel);
    form.append('profileDownloadUrl', request.profileDownloadUrl);

    return this.http
      .put<ContactPageModel>(`${this.baseUrl}/api/contact-page`, form)
      .pipe(tap(page => this.content.set(page)));
  }
}
