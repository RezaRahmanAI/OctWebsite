import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/auth';

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-shell.component.html',
  styleUrls: ['./dashboard-shell.component.css'],
})
export class DashboardShellComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  navItems = [
    { label: 'Overview', link: '/dashboard' },
    { label: 'About', link: '/dashboard/about' },
    { label: 'Team', link: '/dashboard/team' },
    { label: 'Services', link: '/dashboard/services' },
    { label: 'Products', link: '/dashboard/products' },
    { label: 'Academy', link: '/dashboard/academy' },
    { label: 'Blog', link: '/dashboard/blog' },
    { label: 'Media', link: '/dashboard/media', disabled: true },
    { label: 'Leads', link: '/dashboard/leads' },
    { label: 'Settings', link: '/dashboard/settings' },
  ];

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
