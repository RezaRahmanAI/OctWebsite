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
import { SettingsService } from '../../core/services/settings.service';
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
import { HomePageApiService, HomePageModel } from '../../core/services/home-page-api.service';

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
  private readonly settings = inject(SettingsService);
  private readonly siteIdentity = inject(SiteIdentityService);
  private readonly document = inject(DOCUMENT, { optional: true });
  private readonly blogService = inject(BlogService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly homePageApi = inject(HomePageApiService);

  protected readonly home = this.content.homeContent;
  protected readonly apiHome = this.homePageApi.content;
  protected readonly mergedHome = computed(() => this.mergeHome(this.home(), this.apiHome()));
  private readonly siteSettings = this.settings.settings;
  protected readonly snapEnabled = signal(false);
  protected readonly heroData = computed(() => {
    const base = this.mergedHome().hero;
    const settings = this.siteSettings();
    const heroVideo = this.siteIdentity.getHeroVideo('home');

    const safeString = (value: string | undefined) =>
      value && value.trim().length > 0 ? value.trim() : null;

    return {
      ...base,
      badge: safeString(settings?.heroMediaBadge) ?? base.badge,
      title: safeString(settings?.heroTitle) ?? base.title,
      description: safeString(settings?.heroSubtitle) ?? base.description,
      primaryCta: {
        ...base.primaryCta,
        label: safeString(settings?.primaryCtaLabel) ?? base.primaryCta.label,
      },
      highlightCard: {
        ...base.highlightCard,
        description: safeString(settings?.heroMediaCaption) ?? base.highlightCard.description,
      },
      video: {
        src: heroVideo?.src ?? safeString(settings?.heroVideoUrl) ?? base.video.src,
        poster: heroVideo?.poster ?? safeString(settings?.heroVideoPoster) ?? base.video.poster,
      },
    };
  });
  protected readonly heroVideoSrc = computed(() =>
    this.normalizeMediaUrl(this.heroData().video.src)
  );
  protected readonly heroVideoPoster = computed(() =>
    this.normalizeMediaUrl(this.heroData().video.poster)
  );

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

  private mergeHome(base: any, api: HomePageModel | null) {
    if (!api) {
      return base;
    }

    const mapMedia = (media: any) => media?.url || media?.fileName || '';
    const mappedHero = {
      ...base.hero,
      badge: api.hero.badge || base.hero.badge,
      title: api.hero.title || base.hero.title,
      description: api.hero.description || base.hero.description,
      primaryCta: {
        ...base.hero.primaryCta,
        ...api.hero.primaryCta,
      },
      secondaryCta: {
        ...base.hero.secondaryCta,
        ...api.hero.secondaryCta,
      },
      highlightCard: {
        ...base.hero.highlightCard,
        ...api.hero.highlightCard,
      },
      highlightList: api.hero.highlightList.length ? api.hero.highlightList : base.hero.highlightList,
      video: {
        src: mapMedia(api.hero.video) || base.hero.video.src,
        poster: mapMedia(api.hero.poster) || base.hero.video.poster,
      },
      featurePanel: {
        ...base.hero.featurePanel,
        ...api.hero.featurePanel,
      },
    };

    return {
      ...base,
      hero: mappedHero,
      trust: api.trust ?? base.trust,
      testimonials: {
        ...base.testimonials,
        items: api.testimonials.length ? api.testimonials.map(item => ({
          quote: item.quote,
          name: item.name,
          title: item.title,
          location: item.location,
          rating: item.rating,
          type: item.type as any,
          image: mapMedia(item.image),
        })) : base.testimonials.items,
      },
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

    this.destroyRef.onDestroy(() =>
      win.removeEventListener('resize', resizeHandler)
    );
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
