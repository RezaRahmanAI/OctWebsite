import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, forkJoin, map, tap } from 'rxjs';
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
  id: string;
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
  id: string;
  tagline: string;
  logos: MediaResource[];
  stats: { label: string; value: number; suffix?: string | null; decimals?: number | null }[];
}

export interface HomeTestimonialModel {
  id: string;
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

export interface SaveHomeHeroRequest {
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
}

export interface SaveHomeTrustRequest {
  tagline: string;
  logos: (MediaResource & { logoFile?: File | null })[];
  stats: { label: string; value: number; suffix?: string | null; decimals?: number | null }[];
}

export interface SaveHomeTestimonialRequest {
  quote: string;
  name: string;
  title: string;
  location: string;
  rating: number;
  type: string;
  imageFileName?: string | null;
  imageFile?: File | null;
}

@Injectable({ providedIn: 'root' })
export class HomePageApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  readonly content = signal<HomePageModel | null>(null);

  load() {
    return this.fetch().subscribe();
  }

  fetch(): Observable<HomePageModel> {
    return forkJoin({
      hero: this.http.get<HomeHeroModel>(`${this.baseUrl}/api/home-hero`),
      trust: this.http.get<HomeTrustModel>(`${this.baseUrl}/api/home-trust`),
      testimonials: this.http.get<HomeTestimonialModel[]>(`${this.baseUrl}/api/home-testimonials`),
    }).pipe(
      map(
        ({ hero, trust, testimonials }) =>
          ({ id: hero.id, hero, trust, testimonials } satisfies HomePageModel)
      ),
      tap((page) => this.content.set(page))
    );
  }

  updateHero(request: SaveHomeHeroRequest): Observable<HomeHeroModel> {
    const form = new FormData();
    form.append('heroBadge', request.badge);
    form.append('heroTitle', request.title);
    form.append('heroDescription', request.description);
    form.append('primaryCtaLabel', request.primaryCta.label);
    if (request.primaryCta.routerLink) form.append('primaryCtaLink', request.primaryCta.routerLink);
    if (request.primaryCta.fragment) form.append('primaryCtaFragment', request.primaryCta.fragment);
    if (request.primaryCta.externalUrl)
      form.append('primaryCtaExternalUrl', request.primaryCta.externalUrl);
    if (request.primaryCta.style) form.append('primaryCtaStyle', request.primaryCta.style);

    form.append('secondaryCtaLabel', request.secondaryCta.label);
    if (request.secondaryCta.routerLink)
      form.append('secondaryCtaLink', request.secondaryCta.routerLink);
    if (request.secondaryCta.fragment)
      form.append('secondaryCtaFragment', request.secondaryCta.fragment);
    if (request.secondaryCta.externalUrl)
      form.append('secondaryCtaExternalUrl', request.secondaryCta.externalUrl);
    if (request.secondaryCta.style) form.append('secondaryCtaStyle', request.secondaryCta.style);

    form.append('heroHighlightTitle', request.highlightCard.title);
    form.append('heroHighlightDescription', request.highlightCard.description);
    request.highlightList.forEach((item, index) =>
      form.append(`heroHighlightList[${index}]`, item)
    );

    if (request.videoFileName) form.append('heroVideoFileName', request.videoFileName);
    if (request.videoFile) form.append('heroVideo', request.videoFile);
    if (request.posterFileName) form.append('heroPosterFileName', request.posterFileName);
    if (request.posterFile) form.append('heroPoster', request.posterFile);

    form.append('featureEyebrow', request.featurePanel.eyebrow);
    form.append('featureTitle', request.featurePanel.title);
    form.append('featureDescription', request.featurePanel.description);
    request.featurePanel.metrics.forEach((metric, index) => {
      form.append(`heroMetrics[${index}].label`, metric.label);
      form.append(`heroMetrics[${index}].value`, metric.value);
      form.append(`heroMetrics[${index}].theme`, metric.theme);
    });
    form.append('partnerLabel', request.featurePanel.partner.label);
    form.append('partnerDescription', request.featurePanel.partner.description);

    return this.http
      .post<HomeHeroModel>(`${this.baseUrl}/api/home-hero`, form)
      .pipe(tap((hero) => this.mergeContent({ hero, id: hero.id })));
  }

  updateTrust(request: SaveHomeTrustRequest): Observable<HomeTrustModel> {
    const form = new FormData();
    form.append('trustTagline', request.tagline);
    request.logos.forEach((logo, index) => {
      if (logo.fileName) form.append(`trustLogos[${index}].logoFileName`, logo.fileName);
      const file = (logo as any).logoFile as File | undefined;
      if (file) form.append(`trustLogos[${index}].logo`, file);
    });
    request.stats.forEach((stat, index) => {
      form.append(`trustStats[${index}].label`, stat.label);
      form.append(`trustStats[${index}].value`, `${stat.value}`);
      if (stat.suffix) form.append(`trustStats[${index}].suffix`, stat.suffix);
      if (stat.decimals !== undefined && stat.decimals !== null) {
        form.append(`trustStats[${index}].decimals`, `${stat.decimals}`);
      }
    });

    return this.http
      .put<HomeTrustModel>(`${this.baseUrl}/api/home-trust`, form)
      .pipe(tap((trust) => this.mergeContent({ trust })));
  }

  createTestimonial(request: SaveHomeTestimonialRequest): Observable<HomeTestimonialModel> {
    const form = this.toTestimonialFormData(request);
    return this.http.post<HomeTestimonialModel>(`${this.baseUrl}/api/home-testimonials`, form).pipe(
      tap((testimonial) =>
        this.mergeContent({
          testimonials: [...(this.content()?.testimonials ?? []), testimonial],
        })
      )
    );
  }

  updateTestimonial(
    id: string,
    request: SaveHomeTestimonialRequest
  ): Observable<HomeTestimonialModel> {
    const form = this.toTestimonialFormData(request);
    return this.http
      .put<HomeTestimonialModel>(`${this.baseUrl}/api/home-testimonials/${id}`, form)
      .pipe(
        tap((testimonial) => {
          const existing = this.content()?.testimonials ?? [];
          const updated = existing.map((item) => (item.id === id ? testimonial : item));
          this.mergeContent({ testimonials: updated });
        })
      );
  }

  deleteTestimonial(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/home-testimonials/${id}`).pipe(
      tap(() => {
        const remaining = (this.content()?.testimonials ?? []).filter((t) => t.id !== id);
        this.mergeContent({ testimonials: remaining });
      })
    );
  }

  private toTestimonialFormData(request: SaveHomeTestimonialRequest): FormData {
    const form = new FormData();
    form.append('quote', request.quote);
    form.append('name', request.name);
    form.append('title', request.title);
    form.append('location', request.location);
    form.append('rating', `${request.rating}`);
    form.append('type', request.type);
    if (request.imageFileName) form.append('imageFileName', request.imageFileName);
    if (request.imageFile) form.append('image', request.imageFile);
    return form;
  }

  private mergeContent(update: Partial<HomePageModel>) {
    const current = this.content();
    const next: HomePageModel | null = current
      ? {
          ...current,
          ...update,
          hero: update.hero ?? current.hero,
          trust: update.trust ?? current.trust,
          testimonials: update.testimonials ?? current.testimonials,
        }
      : null;
    if (next) {
      this.content.set(next);
    }
  }
}
