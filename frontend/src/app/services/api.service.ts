import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SiteSettings } from '../models/site-settings.model';
import { ServiceItem } from '../models/service-item.model';
import { ProductItem } from '../models/product-item.model';
import { AcademyTrack } from '../models/academy-track.model';
import { BlogPost } from '../models/blog-post.model';
import { TeamMember } from '../models/team-member.model';
import { AboutSection } from '../models/about-section.model';
import { LeadRequest } from '../models/lead-request.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getSiteSettings(): Observable<SiteSettings> {
    return this.http.get<SiteSettings>(`${this.baseUrl}/settings`);
  }

  getAboutSections(): Observable<AboutSection[]> {
    return this.http.get<AboutSection[]>(`${this.baseUrl}/about`);
  }

  getServices(): Observable<ServiceItem[]> {
    return this.http.get<ServiceItem[]>(`${this.baseUrl}/services`);
  }

  getProducts(): Observable<ProductItem[]> {
    return this.http.get<ProductItem[]>(`${this.baseUrl}/products`);
  }

  getAcademyTracks(): Observable<AcademyTrack[]> {
    return this.http.get<AcademyTrack[]>(`${this.baseUrl}/academy/tracks`);
  }

  getBlogPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.baseUrl}/blog`);
  }

  getTeam(): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(`${this.baseUrl}/team`);
  }

  submitLead(payload: LeadRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/leads`, payload);
  }
}
