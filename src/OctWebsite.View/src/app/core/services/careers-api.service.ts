import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface JobPosting {
  id: string;
  title: string;
  location: string;
  employmentType: string;
  description: string;
  summary: string;
  active: boolean;
  publishedAt: string;
}

export interface SaveJobPostingRequest {
  title: string;
  location: string;
  employmentType: string;
  description: string;
  summary: string;
  active: boolean;
}

export interface CareerApplicationRequest {
  jobPostingId: string;
  fullName: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  cv?: File | null;
}

export interface CareerApplication {
  id: string;
  jobPostingId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  cvFileName?: string | null;
  cvUrl?: string | null;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class CareersApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  getOpenings(): Observable<JobPosting[]> {
    return this.http.get<JobPosting[]>(`${this.baseUrl}/api/careers`);
  }

  getAll(): Observable<JobPosting[]> {
    return this.http.get<JobPosting[]>(`${this.baseUrl}/api/careers/manage`);
  }

  createPosting(request: SaveJobPostingRequest): Observable<JobPosting> {
    return this.http.post<JobPosting>(`${this.baseUrl}/api/careers`, request);
  }

  updatePosting(id: string, request: SaveJobPostingRequest): Observable<JobPosting> {
    return this.http.put<JobPosting>(`${this.baseUrl}/api/careers/${id}`, request);
  }

  deletePosting(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/careers/${id}`);
  }

  submitApplication(request: CareerApplicationRequest): Observable<CareerApplication> {
    const form = new FormData();
    form.append('jobPostingId', request.jobPostingId);
    form.append('fullName', request.fullName);
    form.append('email', request.email);
    form.append('phone', request.phone ?? '');
    form.append('message', request.message ?? '');

    if (request.cv) {
      form.append('cv', request.cv);
    }

    return this.http.post<CareerApplication>(`${this.baseUrl}/api/career-applications`, form);
  }

  getApplications(take = 200): Observable<CareerApplication[]> {
    return this.http.get<CareerApplication[]>(`${this.baseUrl}/api/career-applications`, {
      params: { take },
    });
  }
}
