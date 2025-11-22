import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TechStackComponent } from './sections/tech-stack-slider/tech-stack-slider.component';
import { SeoService } from '../../core/services/seo.service';
import { ContentService } from '../../core/services/content.service';
import { SettingsService } from '../../core/services/settings.service';
import { HomeHeroComponent } from './sections/hero/home-hero.component';
import { HomeTrustComponent } from './sections/trust/home-trust.component';
import { HomeServicesComponent } from './sections/services/home-services.component';
import { HomeMethodologyComponent } from './sections/methodology/home-methodology.component';
import { HomeAcademyComponent } from './sections/academy/home-academy.component';
import { HomeTestimonialsComponent } from './sections/testimonials/home-testimonials.component';
import { HomeInsightsComponent } from './sections/insights/home-insights.component';
import { HomeClosingCtasComponent } from './sections/closing-ctas/home-closing-ctas.component';
import { environment } from '../../../environments/environment';
import { HomeCollaborationComponent } from './sections/collaboration/home-collaboration.component';
import { ServicesComponent } from "../services/services.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TechStackComponent,
    HomeHeroComponent,
    HomeServicesComponent,
    HomeMethodologyComponent,
    HomeAcademyComponent,
    HomeTestimonialsComponent,
    HomeInsightsComponent,
    HomeClosingCtasComponent,
    HomeCollaborationComponent,
    HomeTrustComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private readonly seo = inject(SeoService);
  private readonly content = inject(ContentService);
  private readonly settings = inject(SettingsService);

  protected readonly home = this.content.homeContent;
  private readonly siteSettings = this.settings.settings;
  protected readonly heroData = computed(() => {
    const base = this.home().hero;
    const settings = this.siteSettings();

    const safeString = (value: string | undefined) => (value && value.trim().length > 0 ? value.trim() : null);

    return {
      ...base,
      badge: safeString(settings?.heroMediaBadge) ?? base.badge,
      title: safeString(settings?.heroTitle) ?? base.title,
      description: safeString(settings?.heroSubtitle) ?? base.description,
      primaryCta: {
        ...base.primaryCta,
        label: safeString(settings?.primaryCtaLabel) ?? base.primaryCta.label
      },
      highlightCard: {
        ...base.highlightCard,
        description: safeString(settings?.heroMediaCaption) ?? base.highlightCard.description
      },
      video: {
        src: safeString(settings?.heroVideoUrl) ?? base.video.src,
        poster: safeString(settings?.heroVideoPoster) ?? base.video.poster
      }
    };
  });
  protected readonly heroVideoSrc = computed(() =>
    this.normalizeMediaUrl(this.heroData().video.src)
  );
  protected readonly heroVideoPoster = computed(() =>
    this.normalizeMediaUrl(this.heroData().video.poster)
  );

  constructor() {
    this.seo.update({
      title: 'ObjectCanvas × ZeroProgrammingBD | Software Solutions & Tech Academy',
      description:
        'ObjectCanvas Studios and ZeroProgrammingBD Academy deliver enterprise software, digital marketing, and live technology education for founders, enterprises, and future makers.',
      keywords:
        'objectcanvas, zeroprogrammingbd, software development Bangladesh, digital marketing, tech academy, angular tailwind',
      canonical: 'https://www.objectcanvas.com'
    });
  }

  private normalizeMediaUrl(url: string | null | undefined): string {
    if (!url) {
      return '';
    }

    if (/^(https?:)?\/\//.test(url) || url.startsWith('data:')) {
      return url;
    }

    const normalized = url.startsWith('/') ? url : `/${url.replace(/^\/+/, '')}`;

    if (normalized.startsWith('/video/') || normalized.startsWith('/images/') || normalized.startsWith('/assets/')) {
      return normalized;
    }

    const apiBase = environment.apiUrl.replace(/\/+$/, '');
    return `${apiBase}${normalized.replace(/\/+$/, '')}`;
  }
}
