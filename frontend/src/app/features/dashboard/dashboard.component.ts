import { CommonModule } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AboutAdminComponent } from './about-admin.component';
import { TeamAdminComponent } from './team-admin.component';
import { AcademyAdminComponent } from './academy-admin.component';
import { AcademyTracksAdminComponent } from './academy-tracks-admin.component';
import { AuthService } from '../../core/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AboutAdminComponent, TeamAdminComponent, AcademyAdminComponent, AcademyTracksAdminComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly activeTab = signal<'about' | 'team' | 'academy' | 'tracks'>('about');

  select(tab: 'about' | 'team' | 'academy' | 'tracks'): void {
    this.activeTab.set(tab);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
