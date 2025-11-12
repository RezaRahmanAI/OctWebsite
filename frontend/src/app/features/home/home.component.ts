import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TechStackComponent } from './tech-stack-slider/tech-stack-slider.component';
import { SeoService } from '../../core/services/seo.service';
import { ContentService } from '../../core/services/content.service';
import { HomeHeroComponent } from './sections/hero/home-hero.component';
import { HomeTrustComponent } from './sections/trust/home-trust.component';
import { HomeServicesComponent } from './sections/services/home-services.component';
import { HomeDifferentiatorsComponent } from './sections/differentiators/home-differentiators.component';
import { HomeMethodologyComponent } from './sections/methodology/home-methodology.component';
import { HomeCaseStudiesComponent } from './sections/case-studies/home-case-studies.component';
import { HomeAcademyComponent } from './sections/academy/home-academy.component';
import { HomeGlobalPresenceComponent } from './sections/global-presence/home-global-presence.component';
import { HomeTestimonialsComponent } from './sections/testimonials/home-testimonials.component';
import { HomeInsightsComponent } from './sections/insights/home-insights.component';
import { HomeClosingCtasComponent } from './sections/closing-ctas/home-closing-ctas.component';
import { HomeContactComponent } from './sections/contact/home-contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TechStackComponent,
    HomeHeroComponent,
    HomeTrustComponent,
    HomeServicesComponent,
    HomeDifferentiatorsComponent,
    HomeMethodologyComponent,
    HomeCaseStudiesComponent,
    HomeAcademyComponent,
    HomeGlobalPresenceComponent,
    HomeTestimonialsComponent,
    HomeInsightsComponent,
    HomeClosingCtasComponent,
    HomeContactComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private readonly seo = inject(SeoService);
  private readonly content = inject(ContentService);

  protected readonly home = this.content.homeContent;
  protected readonly heroVideoSrc = computed(() => this.normalizeMediaUrl(this.home().hero.video.src));
  protected readonly heroVideoPoster = computed(() => this.normalizeMediaUrl(this.home().hero.video.poster));

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
    return normalized.replace(/\/+$/, '');
  }
}
