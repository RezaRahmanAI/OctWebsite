import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TeamMember } from '../models';
import { Observable } from 'rxjs';

export interface SaveTeamMemberRequest {
  name: string;
  role: string;
  photo?: File | null;
  photoFileName?: string | null;
  bio: string;
  email: string;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class TeamApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  list(): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(`${this.baseUrl}/api/team`);
  }

  create(request: SaveTeamMemberRequest): Observable<TeamMember> {
    const formData = this.buildFormData(request);
    return this.http.post<TeamMember>(`${this.baseUrl}/api/team`, formData);
  }

  update(id: string, request: SaveTeamMemberRequest): Observable<TeamMember> {
    const formData = this.buildFormData(request);
    return this.http.post<TeamMember>(`${this.baseUrl}/api/team/${id}`, formData);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/team/${id}`);
  }

  private buildFormData(request: SaveTeamMemberRequest): FormData {
    const formData = new FormData();
    formData.append('name', request.name);
    formData.append('role', request.role);
    formData.append('bio', request.bio);
    formData.append('email', request.email);
    formData.append('active', String(request.active));

    if (request.photo) {
      formData.append('photo', request.photo, request.photo.name);
    }

    if (request.photoFileName) {
      formData.append('photoFileName', request.photoFileName);
    }

    return formData;
  }
}
