import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MediaResource {
  fileName: string | null;
  url: string | null;
}

export interface CtaLinkModel {
  label: string;
  routerLink?: string | null;
  fragment?: string | null;
  externalUrl?: string | null;
  style?: string | null;
}

export interface HomeMetricModel {
  label: string;
  value: string;
  theme: string;
}

export interface HomeFeaturePanelModel {
  eyebrow: string;
  title: string;
  description: string;
  metrics: HomeMetricModel[];
  partner: { label: string; description: string };
}

export interface HomeHeroModel {
  badge: string;
  title: string;
  description: string;
  primaryCta: CtaLinkModel;
  secondaryCta: CtaLinkModel;
  highlightCard: { title: string; description: string };
  highlightList: string[];
  video: MediaResource | null;
  poster: MediaResource | null;
  featurePanel: HomeFeaturePanelModel;
}

export interface HomeTrustModel {
  tagline: string;
  companies: string[];
  stats: { label: string; value: number; suffix?: string | null; decimals?: number | null }[];
}

export interface HomeTestimonialModel {
  quote: string;
  name: string;
  title: string;
  location: string;
  rating: number;
  type: string;
  image: MediaResource | null;
}

export interface HomePageModel {
  id: string;
  hero: HomeHeroModel;
  trust: HomeTrustModel;
  testimonials: HomeTestimonialModel[];
}

export interface SaveHomePageRequest {
  hero: {
    badge: string;
    title: string;
    description: string;
    primaryCta: CtaLinkModel;
    secondaryCta: CtaLinkModel;
    highlightCard: { title: string; description: string };
    highlightList: string[];
    videoFileName?: string | null;
    videoFile?: File | null;
    posterFileName?: string | null;
    posterFile?: File | null;
    featurePanel: HomeFeaturePanelModel;
  };
  trust: HomeTrustModel;
  testimonials: (HomeTestimonialModel & { imageFileName?: string | null; imageFile?: File | null })[];
}

@Injectable({ providedIn: 'root' })
export class HomePageApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  readonly content = signal<HomePageModel | null>(null);

  load() {
    return this.fetch().subscribe(page => this.content.set(page));
  }

  fetch(): Observable<HomePageModel> {
    return this.http.get<HomePageModel>(`${this.baseUrl}/api/home-page`);
  }

  save(request: SaveHomePageRequest) {
    return this.update(request).subscribe(page => this.content.set(page));
  }

  update(request: SaveHomePageRequest): Observable<HomePageModel> {
    const form = new FormData();
    form.append('heroBadge', request.hero.badge);
    form.append('heroTitle', request.hero.title);
    form.append('heroDescription', request.hero.description);
    form.append('primaryCtaLabel', request.hero.primaryCta.label);
    if (request.hero.primaryCta.routerLink) form.append('primaryCtaLink', request.hero.primaryCta.routerLink);
    if (request.hero.primaryCta.fragment) form.append('primaryCtaFragment', request.hero.primaryCta.fragment);
    if (request.hero.primaryCta.externalUrl) form.append('primaryCtaExternalUrl', request.hero.primaryCta.externalUrl);
    if (request.hero.primaryCta.style) form.append('primaryCtaStyle', request.hero.primaryCta.style);

    form.append('secondaryCtaLabel', request.hero.secondaryCta.label);
    if (request.hero.secondaryCta.routerLink) form.append('secondaryCtaLink', request.hero.secondaryCta.routerLink);
    if (request.hero.secondaryCta.fragment) form.append('secondaryCtaFragment', request.hero.secondaryCta.fragment);
    if (request.hero.secondaryCta.externalUrl) form.append('secondaryCtaExternalUrl', request.hero.secondaryCta.externalUrl);
    if (request.hero.secondaryCta.style) form.append('secondaryCtaStyle', request.hero.secondaryCta.style);

    form.append('heroHighlightTitle', request.hero.highlightCard.title);
    form.append('heroHighlightDescription', request.hero.highlightCard.description);
    request.hero.highlightList.forEach((item, index) => form.append(`heroHighlightList[${index}]`, item));

    if (request.hero.videoFileName) form.append('heroVideoFileName', request.hero.videoFileName);
    if (request.hero.videoFile) form.append('heroVideo', request.hero.videoFile);
    if (request.hero.posterFileName) form.append('heroPosterFileName', request.hero.posterFileName);
    if (request.hero.posterFile) form.append('heroPoster', request.hero.posterFile);

    form.append('featureEyebrow', request.hero.featurePanel.eyebrow);
    form.append('featureTitle', request.hero.featurePanel.title);
    form.append('featureDescription', request.hero.featurePanel.description);
    request.hero.featurePanel.metrics.forEach((metric, index) => {
      form.append(`heroMetrics[${index}].label`, metric.label);
      form.append(`heroMetrics[${index}].value`, metric.value);
      form.append(`heroMetrics[${index}].theme`, metric.theme);
    });
    form.append('partnerLabel', request.hero.featurePanel.partner.label);
    form.append('partnerDescription', request.hero.featurePanel.partner.description);

    form.append('trustTagline', request.trust.tagline);
    request.trust.companies.forEach((company, index) => form.append(`trustCompanies[${index}]`, company));
    request.trust.stats.forEach((stat, index) => {
      form.append(`trustStats[${index}].label`, stat.label);
      form.append(`trustStats[${index}].value`, `${stat.value}`);
      if (stat.suffix) form.append(`trustStats[${index}].suffix`, stat.suffix);
      if (stat.decimals !== undefined && stat.decimals !== null) {
        form.append(`trustStats[${index}].decimals`, `${stat.decimals}`);
      }
    });

    request.testimonials.forEach((testimonial, index) => {
      form.append(`testimonials[${index}].quote`, testimonial.quote);
      form.append(`testimonials[${index}].name`, testimonial.name);
      form.append(`testimonials[${index}].title`, testimonial.title);
      form.append(`testimonials[${index}].location`, testimonial.location);
      form.append(`testimonials[${index}].rating`, `${testimonial.rating}`);
      form.append(`testimonials[${index}].type`, testimonial.type);
      if (testimonial.imageFileName) form.append(`testimonials[${index}].imageFileName`, testimonial.imageFileName);
      if ((testimonial as any).imageFile) form.append(`testimonials[${index}].image`, (testimonial as any).imageFile);
    });

    return this.http
      .put<HomePageModel>(`${this.baseUrl}/api/home-page`, form)
      .pipe(tap(page => this.content.set(page)));
  }
}
