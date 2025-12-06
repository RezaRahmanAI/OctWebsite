import { CommonModule } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AboutAdminComponent } from './about-admin.component';
import { TeamAdminComponent } from './team-admin.component';
import { AcademyAdminComponent } from './academy-admin.component';
import { AcademyTracksAdminComponent } from './academy-tracks-admin.component';
import { BlogAdminComponent } from './blog-admin.component';
import { ContactAdminComponent } from './contact-admin.component';
import { ContactChannelsAdminComponent } from './contact-channels-admin.component';
import { ContactSubmissionsAdminComponent } from './contact-submissions-admin.component';
import { AuthService } from '../../core/auth';
import { ServicesAdminComponent } from './services-admin.component';
import { HomeAdminComponent } from './home-admin.component';
import { ProductAdminComponent } from './product-admin.component';
import { ProductShowcaseAdminComponent } from './product-showcase-admin.component';
import { CareerPostingsAdminComponent } from './career-postings-admin.component';
import { CareerApplicationsAdminComponent } from './career-applications-admin.component';
import { CareerPageAdminComponent } from './career-page-admin.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AboutAdminComponent,
    TeamAdminComponent,
    AcademyAdminComponent,
    AcademyTracksAdminComponent,
    BlogAdminComponent,
    ContactAdminComponent,
    ContactChannelsAdminComponent,
    ContactSubmissionsAdminComponent,
    ServicesAdminComponent,
    HomeAdminComponent,
    ProductAdminComponent,
    ProductShowcaseAdminComponent,
    CareerPostingsAdminComponent,
    CareerApplicationsAdminComponent,
    CareerPageAdminComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly activeTab = signal<
    | 'home'
    | 'about'
    | 'team'
    | 'academy'
    | 'tracks'
    | 'blog'
    | 'contact'
    | 'channels'
    | 'submissions'
    | 'services'
    | 'products'
    | 'showcase'
    | 'careers'
  >('home');

  select(
    tab:
      | 'home'
      | 'about'
      | 'team'
      | 'academy'
      | 'tracks'
      | 'blog'
      | 'contact'
      | 'channels'
      | 'submissions'
      | 'services'
      | 'products'
      | 'showcase'
      | 'careers'
  ): void {
    this.activeTab.set(tab);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
