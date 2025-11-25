import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TeamMember } from '../models';
import { Observable } from 'rxjs';

export interface SaveTeamMemberRequest {
  name: string;
  role: string;
  photoUrl: string;
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
    return this.http.post<TeamMember>(`${this.baseUrl}/api/team`, request);
  }

  update(id: string, request: SaveTeamMemberRequest): Observable<TeamMember> {
    return this.http.put<TeamMember>(`${this.baseUrl}/api/team/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/team/${id}`);
  }
}
