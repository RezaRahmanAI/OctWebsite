import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sitemap',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SitemapComponent {
  // Static list of sitemap links
  protected readonly links = [
    { label: 'Home', url: '/' },
    { label: 'About', url: '/about' },
    { label: 'Profile', url: '/profile' },
    { label: 'Services', url: '/services' },
    { label: 'Academy', url: '/academy' },
    { label: 'Blog', url: '/blog' },
    { label: 'Contact', url: '/contact' },
    { label: 'Privacy Policy', url: '/privacy-policy' },
    { label: 'Terms of Service', url: '/terms-of-service' },
  ];
}
