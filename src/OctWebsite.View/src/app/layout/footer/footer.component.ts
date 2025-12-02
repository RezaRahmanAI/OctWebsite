import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteIdentityService } from '../../core/services/site-identity.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  private readonly siteIdentity = inject(SiteIdentityService);

  protected readonly currentYear = new Date().getFullYear();

  protected readonly socialLinks = computed(() => this.siteIdentity.contactChannels().socialLinks);

  protected readonly socialIcons: Record<string, string> = {
    LinkedIn:
      'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-9.6 16H6.4V10h3v9Zm-1.5-10.3a1.74 1.74 0 1 1 1.75-1.73A1.73 1.73 0 0 1 7.9 8.7Zm11.1 10.3h-3v-4.6c0-1.1-.2-2.2-1.5-2.2-1.4 0-1.6 1.1-1.6 2.1V19h-3v-9h2.9v1.2h.1a3.2 3.2 0 0 1 2.9-1.6c3.1 0 3.2 2 3.2 4.5Z',
    Facebook:
      'M13 10h2.5l.5-3H13V5.5a1.25 1.25 0 0 1 1.4-1.35H16V1.36A16 16 0 0 0 13.6 1c-2.3 0-3.7 1.4-3.7 3.9V7H7v3h2.9v10h3.1Z',
    Twitter:
      'M22 5.9a6.7 6.7 0 0 1-1.9.5 3.3 3.3 0 0 0 1.5-1.8 6.6 6.6 0 0 1-2.1.8 3.3 3.3 0 0 0-5.7 2.3 3 3 0 0 0 .1.7 9.4 9.4 0 0 1-6.8-3.4 3.3 3.3 0 0 0 1 4.4 3.2 3.2 0 0 1-1.5-.4v.1a3.3 3.3 0 0 0 2.7 3.3 3.2 3.2 0 0 1-.9.1 3.5 3.5 0 0 1-.6-.1 3.3 3.3 0 0 0 3.1 2.3A6.6 6.6 0 0 1 2 18.5a9.4 9.4 0 0 0 5.1 1.5c6.1 0 9.4-5 9.4-9.4v-.4A7 7 0 0 0 22 5.9Z',
    Instagram:
      'M16 2H8a6 6 0 0 0-6 6v8a6 6 0 0 0 6 6h8a6 6 0 0 0 6-6V8a6 6 0 0 0-6-6Zm4 14a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4Zm-4-7.5a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 16 8.5Zm-4 1.5a5 5 0 1 0 5 5a5 5 0 0 0-5-5Zm0 8a3 3 0 1 1 3-3a3 3 0 0 1-3 3Z',
    YouTube:
      'M21.8 7.2a2.6 2.6 0 0 0-1.8-1.8C18 5 12 5 12 5s-6 0-8 .4A2.6 2.6 0 0 0 2.2 7.2A27.3 27.3 0 0 0 2 12a27.3 27.3 0 0 0 .2 4.8a2.6 2.6 0 0 0 1.8 1.8C6 19 12 19 12 19s6 0 8-.4a2.6 2.6 0 0 0 1.8-1.8A27.3 27.3 0 0 0 22 12a27.3 27.3 0 0 0-.2-4.8ZM10 15V9l5 3Z',
    GitHub:
      'M12 .7A11.3 11.3 0 0 0 .7 12c0 4.9 3.2 9 7.6 10.5c.6.1.8-.3.8-.6v-2c-3 .7-3.6-1.4-3.6-1.4c-.5-1.1-1.2-1.4-1.2-1.4c-1-.7.1-.7.1-.7c1 .1 1.5 1 1.5 1c.9 1.5 2.4 1.1 3 .8c.1-.6.3-1.1.6-1.3c-2.4-.3-4.9-1.2-4.9-5.4c0-1.2.4-2.2 1-3c-.1-.3-.4-1.5.1-3c0 0 .9-.3 3 1c.9-.2 1.9-.3 2.8-.3s1.9.1 2.8.3c2.1-1.3 3-1 3-1c.5 1.5.2 2.7.1 3c.7.8 1 1.8 1 3c0 4.2-2.5 5.1-4.9 5.4c.4.3.7.9.7 1.8v2.7c0 .3.2.7.8.6A11.3 11.3 0 0 0 23.3 12A11.3 11.3 0 0 0 12 .7Z',
  };
}
