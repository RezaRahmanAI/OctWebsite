import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { TechStackComponent } from './sections/tech-stack-slider/tech-stack-slider.component';
import { SeoService } from '../../core/services/seo.service';
import { ContentService } from '../../core/services/content.service';
import { SiteIdentityService } from '../../core/services/site-identity.service';
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
import { ProductShowcaseComponent } from './sections/product-showcase/product-showcase';
import { BlogService } from '../../core/services/blog.service';
import { HomePageApiService, CtaLinkModel } from '../../core/services/home-page-api.service';
import type { HomeContent, Testimonial, CtaLink } from '../../core/models/home-content.model';

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
    HomeTrustComponent,
    ProductShowcaseComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly content = inject(ContentService);
  private readonly document = inject(DOCUMENT, { optional: true });
  private readonly blogService = inject(BlogService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly homePageApi = inject(HomePageApiService);

  // Base static site content (for non-API sections & fallback)
  protected readonly home = this.content.homeContent;

  // API home content (hero, trust, testimonials)
  protected readonly apiHome = this.homePageApi.content;

  protected readonly snapEnabled = signal(false);

  // ---------- HERO (API-first) ----------
  // ---------- HERO (API-first, VIDEO FROM API ONLY) ----------
  protected readonly heroData = computed<HomeContent['hero']>(() => {
    const baseHero = this.home().hero;
    const apiHero = this.apiHome()?.hero;

    // ✅ VIDEO: API ONLY (no SiteIdentity, no static fallback)
    const apiVideoSrc = apiHero?.video?.url ?? apiHero?.video?.fileName ?? ''; 

    const apiPosterSrc = apiHero?.poster?.url ?? apiHero?.poster?.fileName ?? '';

    const videoSrc = this.normalizeMediaUrl(apiVideoSrc);
    const videoPoster = this.normalizeMediaUrl(apiPosterSrc);

    // Normalize metrics to match strict theme union
    const metrics: HomeContent['hero']['featurePanel']['metrics'] =
      apiHero?.featurePanel?.metrics && apiHero.featurePanel.metrics.length
        ? apiHero.featurePanel.metrics.map((m) => ({
            label: m.label,
            value: m.value,
            // Only allow 'accent' or 'emerald'; default to 'accent'
            theme: (m.theme === 'emerald' ? 'emerald' : 'accent') as 'accent' | 'emerald',
          }))
        : baseHero.featurePanel.metrics;

    return {
      badge: apiHero?.badge ?? baseHero.badge,
      title: apiHero?.title ?? baseHero.title,
      description: apiHero?.description ?? baseHero.description,

      primaryCta: this.mapCtaForHero(baseHero.primaryCta, apiHero?.primaryCta),
      secondaryCta: this.mapCtaForHero(baseHero.secondaryCta, apiHero?.secondaryCta),

      highlightCard: {
        title: apiHero?.highlightCard?.title ?? baseHero.highlightCard.title,
        description: apiHero?.highlightCard?.description ?? baseHero.highlightCard.description,
      },

      highlightList:
        apiHero?.highlightList && apiHero.highlightList.length
          ? apiHero.highlightList
          : baseHero.highlightList,

      // 🔥 VIDEO ONLY FROM API
      video: {
        src: videoSrc,
        poster: videoPoster,
      },

      featurePanel: {
        eyebrow: apiHero?.featurePanel?.eyebrow ?? baseHero.featurePanel.eyebrow,
        title: apiHero?.featurePanel?.title ?? baseHero.featurePanel.title,
        description: apiHero?.featurePanel?.description ?? baseHero.featurePanel.description,
        metrics,
        partner: {
          label: apiHero?.featurePanel?.partner?.label ?? baseHero.featurePanel.partner.label,
          description:
            apiHero?.featurePanel?.partner?.description ??
            baseHero.featurePanel.partner.description,
        },
      },
    };
  });

  protected readonly heroVideoSrc = computed(() => this.heroData().video.src);
  protected readonly heroVideoPoster = computed(() => this.heroData().video.poster);

  // ---------- TRUST (API-first logos & stats) ----------
  protected readonly trustData = computed<HomeContent['trust']>(() => {
    const baseTrust = this.home().trust;
    const apiTrust = this.apiHome()?.trust;

    const logos =
      apiTrust?.logos && apiTrust.logos.length
        ? apiTrust.logos.map((logo) => ({
            src: this.normalizeMediaUrl(logo.url ?? logo.fileName ?? ''),
            alt: 'Trusted company',
          }))
        : baseTrust.logos;

    const stats =
      apiTrust?.stats && apiTrust.stats.length
        ? apiTrust.stats.map((stat) => ({
            label: stat.label,
            value: stat.value,
            suffix: stat.suffix ?? undefined, // avoid null
            decimals: stat.decimals ?? undefined,
          }))
        : baseTrust.stats;

    return {
      tagline: apiTrust?.tagline ?? baseTrust.tagline,
      logos,
      stats,
    };
  });

  // ---------- TESTIMONIALS (API items + static header) ----------
  protected readonly testimonialsHeader = computed(() => this.home().testimonials.header);

  protected readonly testimonialsItems = computed<Testimonial[]>(() => {
    const apiTestimonials = this.apiHome()?.testimonials ?? [];
    const baseTestimonials = this.home().testimonials.items;

    if (!apiTestimonials.length) {
      return baseTestimonials;
    }

    return apiTestimonials.map<Testimonial>((item) => ({
      quote: item.quote,
      name: item.name,
      title: item.title,
      location: item.location,
      rating: item.rating,
      type: item.type as any,
      image: item.image ? this.normalizeMediaUrl(item.image.url ?? item.image.fileName ?? '') : '',
    }));
  });

  // ---------- BLOG POSTS ----------
  protected readonly featuredPosts = computed(() => {
    return [...this.blogService.posts()]
      .sort(
        (a, b) =>
          (new Date(b.publishedAt ?? '').getTime() || 0) -
          (new Date(a.publishedAt ?? '').getTime() || 0)
      )
      .slice(0, 3);
  });

  constructor() {
    this.seo.update({
      title: 'ObjectCanvas | Software Solutions & Tech Academy',
      description:
        'ObjectCanvas Studios and ObjectCanvas Academy deliver enterprise software, digital marketing, and live technology education for founders, enterprises, and future makers.',
      keywords:
        'objectcanvas, software development Bangladesh, digital marketing, tech academy, angular tailwind',
      canonical: 'https://www.objectcanvas.com',
    });

    this.updateSnapMode();
    this.registerResizeListener();
    this.setupBodySnapClass();
  }

  ngOnInit(): void {
    this.homePageApi.load();
    this.blogService.ensureLoaded();
  }

  // ---------- Helpers ----------

  private normalizeMediaUrl(url: string | null | undefined): string {
    if (!url) {
      return '';
    }

    if (/^(https?:)?\/\//.test(url) || url.startsWith('data:')) {
      return url;
    }

    const normalized = url.startsWith('/') ? url.replace(/^\/+/, '') : url;
    const strippedPublic = normalized.startsWith('public/')
      ? normalized.replace(/^public\//, '')
      : normalized;

    if (
      strippedPublic.startsWith('video/') ||
      strippedPublic.startsWith('images/') ||
      strippedPublic.startsWith('assets/')
    ) {
      const baseHref =
        this.document?.baseURI ?? (typeof location !== 'undefined' ? location.href : '/');
      try {
        const resolved = new URL(strippedPublic, baseHref);
        return `${resolved.pathname}${resolved.search}${resolved.hash}`;
      } catch {
        return `/${strippedPublic}`;
      }
    }

    const apiBase = environment.apiUrl.replace(/\/+$/, '');
    return `${apiBase}/${strippedPublic.replace(/\/+$/, '')}`;
  }

  private mapCtaForHero(base: CtaLink, api?: CtaLinkModel | null): CtaLink {
    if (!api) {
      return base;
    }

    // Map style safely to the union
    let style: CtaLink['style'] = (api.style as CtaLink['style']) ?? base.style;

    if (style && !['primary', 'secondary', 'outline'].includes(style)) {
      style = base.style;
    }

    return {
      label: api.label ?? base.label,
      routerLink: api.routerLink ?? base.routerLink,
      fragment: api.fragment ?? base.fragment,
      externalUrl: api.externalUrl ?? base.externalUrl,
      style,
    };
  }

  private setupBodySnapClass(): void {
    const runner = effect(() => {
      const enabled = this.snapEnabled();
      const body = this.document?.body;

      if (!body) {
        return;
      }

      body.classList.toggle('home-snap-enabled', enabled);
    });

    this.destroyRef.onDestroy(() => {
      runner.destroy();
      this.document?.body?.classList.remove('home-snap-enabled');
    });
  }

  private registerResizeListener(): void {
    const win = this.document?.defaultView;

    if (!win) {
      return;
    }

    const resizeHandler = () => this.updateSnapMode();
    win.addEventListener('resize', resizeHandler, { passive: true });

    this.destroyRef.onDestroy(() => win.removeEventListener('resize', resizeHandler));
  }

  private updateSnapMode(): void {
    const win = this.document?.defaultView;

    if (!win) {
      this.snapEnabled.set(false);
      return;
    }

    const shouldEnable = win.innerWidth >= 768 && win.innerHeight >= 700;
    this.snapEnabled.set(shouldEnable);
  }
}
