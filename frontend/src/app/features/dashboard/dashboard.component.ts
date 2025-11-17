import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentService } from '../../core/services/content.service';
import {
  HomeContent,
  InsightItem,
  ServiceCard,
  StatItem,
  Testimonial
} from '../../core/models/home-content.model';
import { take } from 'rxjs';
import { MediaService } from '../../core/services/media.service';

interface ServicesPageContent {
  header: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  categories: {
    name: string;
    description: string;
    deliverables: string[];
    outcomes: string[];
  }[];
}

interface AcademyPageContent {
  header: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  tracks: {
    title: string;
    description: string;
    modules: string[];
    outcomes: string[];
  }[];
}

interface PortfolioPageContent {
  header: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  work: {
    title: string;
    client: string;
    region: string;
    summary: string;
    tags: string[];
  }[];
}

interface AboutPageContent {
  header: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  intro: string;
  values: {
    title: string;
    description: string;
  }[];
  leadership: {
    title: string;
    description: string;
    highlights: string[];
    cta: {
      label: string;
      routerLink: string;
      fragment?: string;
    };
  };
}

interface InsightsPageContent {
  header: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  entries: {
    title: string;
    category: string;
    excerpt: string;
    readTime: string;
  }[];
}

interface ContactPageContent {
  header: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  consultationOptions: string;
  regionalSupport: string;
  emails: string[];
  formOptions: string[];
  ndaLabel: string;
  responseTime: string;
}

interface NavigationContent {
  links: {
    label: string;
    path: string;
  }[];
}

interface FooterContent {
  socialLinks: {
    label: string;
    url: string;
  }[];
}

interface SitemapContent {
  links: {
    label: string;
    url: string;
  }[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private readonly content = inject(ContentService);
  private readonly pageContent = inject(ContentService);
  private readonly media = inject(MediaService);
  protected draft: HomeContent;
  protected readonly sectionNav = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'trust', label: 'Trust & Stats' },
    { id: 'services', label: 'Services' },
    { id: 'differentiators', label: 'Differentiators' },
    { id: 'methodology', label: 'Methodology' },
    { id: 'case-studies', label: 'Case Studies' },
    { id: 'academy', label: 'Academy' },
    { id: 'global-presence', label: 'Global Presence' },
    { id: 'testimonials', label: 'Testimonials & Impact' },
    { id: 'impact', label: 'Impact Metrics' },
    { id: 'insights', label: 'Insights' },
    { id: 'closing-ctas', label: 'Closing CTAs' },
    { id: 'contact', label: 'Contact' },
    { id: 'page-services', label: 'Services Page' },
    { id: 'page-academy', label: 'Academy Page' },
    { id: 'page-portfolio', label: 'Portfolio Page' },
    { id: 'page-about', label: 'About Page' },
    { id: 'page-insights', label: 'Insights Page' },
    { id: 'page-contact', label: 'Contact Page' },
    { id: 'page-navigation', label: 'Navigation Links' },
    { id: 'page-footer', label: 'Footer Socials' },
    { id: 'page-sitemap', label: 'Sitemap Links' }
  ];

  private readonly servicesContentSignal = this.pageContent.getPageSignal<ServicesPageContent>('services');
  private readonly academyContentSignal = this.pageContent.getPageSignal<AcademyPageContent>('academy');
  private readonly portfolioContentSignal = this.pageContent.getPageSignal<PortfolioPageContent>('portfolio');
  private readonly aboutContentSignal = this.pageContent.getPageSignal<AboutPageContent>('about');
  private readonly insightsContentSignal = this.pageContent.getPageSignal<InsightsPageContent>('insights');
  private readonly contactContentSignal = this.pageContent.getPageSignal<ContactPageContent>('contact');
  private readonly navigationContentSignal = this.pageContent.getPageSignal<NavigationContent>('navigation');
  private readonly footerContentSignal = this.pageContent.getPageSignal<FooterContent>('footer');
  private readonly sitemapContentSignal = this.pageContent.getPageSignal<SitemapContent>('sitemap');

  protected servicesDraft: ServicesPageContent | null = null;
  protected academyDraft: AcademyPageContent | null = null;
  protected portfolioDraft: PortfolioPageContent | null = null;
  protected aboutDraft: AboutPageContent | null = null;
  protected insightsDraft: InsightsPageContent | null = null;
  protected contactDraft: ContactPageContent | null = null;
  protected navigationDraft: NavigationContent | null = null;
  protected footerDraft: FooterContent | null = null;
  protected sitemapDraft: SitemapContent | null = null;
  protected heroVideoUploadInProgress = false;
  protected heroVideoUploadError: string | null = null;

  constructor() {
    this.draft = this.clone(this.content.homeContent());
    effect(() => {
      this.draft = this.clone(this.content.homeContent());
    });

    effect(() => {
      const content = this.servicesContentSignal();
      if (content) {
        this.servicesDraft = this.clone(content);
      }
    });

    effect(() => {
      const content = this.academyContentSignal();
      if (content) {
        this.academyDraft = this.clone(content);
      }
    });

    effect(() => {
      const content = this.portfolioContentSignal();
      if (content) {
        this.portfolioDraft = this.clone(content);
      }
    });

    effect(() => {
      const content = this.aboutContentSignal();
      if (content) {
        this.aboutDraft = this.clone(content);
      }
    });

    effect(() => {
      const content = this.insightsContentSignal();
      if (content) {
        this.insightsDraft = this.clone(content);
      }
    });

    effect(() => {
      const content = this.contactContentSignal();
      if (content) {
        this.contactDraft = this.clone(content);
      }
    });

    effect(() => {
      const content = this.navigationContentSignal();
      if (content) {
        this.navigationDraft = this.clone(content);
      }
    });

    effect(() => {
      const content = this.footerContentSignal();
      if (content) {
        this.footerDraft = this.clone(content);
      }
    });

    effect(() => {
      const content = this.sitemapContentSignal();
      if (content) {
        this.sitemapDraft = this.clone(content);
      }
    });

    this.pageContent.loadPage<ServicesPageContent>('services').pipe(take(1)).subscribe();
    this.pageContent.loadPage<AcademyPageContent>('academy').pipe(take(1)).subscribe();
    this.pageContent.loadPage<PortfolioPageContent>('portfolio').pipe(take(1)).subscribe();
    this.pageContent.loadPage<AboutPageContent>('about').pipe(take(1)).subscribe();
    this.pageContent.loadPage<InsightsPageContent>('insights').pipe(take(1)).subscribe();
    this.pageContent.loadPage<ContactPageContent>('contact').pipe(take(1)).subscribe();
    this.pageContent.loadPage<NavigationContent>('navigation').pipe(take(1)).subscribe();
    this.pageContent.loadPage<FooterContent>('footer').pipe(take(1)).subscribe();
    this.pageContent.loadPage<SitemapContent>('sitemap').pipe(take(1)).subscribe();
  }

  protected saveHomeContent(): void {
    this.content.setHomeContent(this.clone(this.draft));
    this.draft = this.clone(this.content.homeContent());
  }

  protected resetHomeContent(): void {
    this.content.resetHomeContent();
    this.draft = this.clone(this.content.homeContent());
  }

  protected addHeroHighlight(): void {
    this.draft.hero.highlightList.push('');
  }

  protected removeHeroHighlight(index: number): void {
    this.draft.hero.highlightList.splice(index, 1);
  }

  protected async onHeroVideoSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.heroVideoUploadError = null;
    this.heroVideoUploadInProgress = true;

    this.media
      .uploadVideo(file)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.draft.hero.video.src = response.url;
          this.heroVideoUploadInProgress = false;
        },
        error: (error) => {
          console.error('Failed to upload hero video', error);
          this.heroVideoUploadError = 'Video upload failed. Please try again.';
          this.heroVideoUploadInProgress = false;
        }
      });
  }

  protected addHeroMetric(): void {
    this.draft.hero.featurePanel.metrics.push({ label: '', value: '', theme: 'accent' });
  }

  protected removeHeroMetric(index: number): void {
    this.draft.hero.featurePanel.metrics.splice(index, 1);
  }

  protected addTrustCompany(): void {
    this.draft.trust.companies.push('');
  }

  protected removeTrustCompany(index: number): void {
    this.draft.trust.companies.splice(index, 1);
  }

  protected addTrustStat(): void {
    this.draft.trust.stats.push(this.createStat());
  }

  protected removeTrustStat(index: number): void {
    this.draft.trust.stats.splice(index, 1);
  }

  protected addService(): void {
    this.draft.services.items.push(this.createService());
  }

  protected removeService(index: number): void {
    this.draft.services.items.splice(index, 1);
  }

  protected addServiceHighlight(service: ServiceCard): void {
    service.highlights.push('');
  }

  protected removeServiceHighlight(service: ServiceCard, index: number): void {
    service.highlights.splice(index, 1);
  }

  protected addDifferentiator(): void {
    this.draft.differentiators.items.push({ title: '', description: '' });
  }

  protected removeDifferentiator(index: number): void {
    this.draft.differentiators.items.splice(index, 1);
  }

  protected addPartnershipHighlight(): void {
    this.draft.differentiators.partnershipPanel.highlights.push({ label: '', value: '' });
  }

  protected removePartnershipHighlight(index: number): void {
    this.draft.differentiators.partnershipPanel.highlights.splice(index, 1);
  }

  protected addMethodStep(): void {
    this.draft.methodology.steps.push({ step: '', detail: '' });
  }

  protected removeMethodStep(index: number): void {
    this.draft.methodology.steps.splice(index, 1);
  }

  protected addCaseStudy(): void {
    this.draft.caseStudies.items.push({ client: '', industry: '', challenge: '', solution: '', result: '' });
  }

  protected removeCaseStudy(index: number): void {
    this.draft.caseStudies.items.splice(index, 1);
  }

  protected addAcademyCategory(): void {
    this.draft.academy.categories.push('');
  }

  protected removeAcademyCategory(index: number): void {
    this.draft.academy.categories.splice(index, 1);
  }

  protected addAcademyStat(): void {
    this.draft.academy.stats.push(this.createStat());
  }

  protected removeAcademyStat(index: number): void {
    this.draft.academy.stats.splice(index, 1);
  }

  protected addFeaturedCourse(): void {
    this.draft.academy.featuredCourses.push({ title: '', instructor: '', duration: '', rating: '', price: '' });
  }

  protected removeFeaturedCourse(index: number): void {
    this.draft.academy.featuredCourses.splice(index, 1);
  }

  protected addAcademyBenefit(): void {
    this.draft.academy.benefits.push('');
  }

  protected removeAcademyBenefit(index: number): void {
    this.draft.academy.benefits.splice(index, 1);
  }

  protected addTestimonial(): void {
    this.draft.testimonials.items.push(this.createTestimonial());
  }

  protected removeTestimonial(index: number): void {
    this.draft.testimonials.items.splice(index, 1);
  }

  protected addImpactStat(): void {
    this.draft.impact.stats.push(this.createStat());
  }

  protected removeImpactStat(index: number): void {
    this.draft.impact.stats.splice(index, 1);
  }

  protected addInsight(): void {
    this.draft.insights.items.push(this.createInsight());
  }

  protected removeInsight(index: number): void {
    this.draft.insights.items.splice(index, 1);
  }

  protected addContactPhone(): void {
    this.draft.contact.phones.push('');
  }

  protected removeContactPhone(index: number): void {
    this.draft.contact.phones.splice(index, 1);
  }

  protected addContactEmail(): void {
    this.draft.contact.emails.push({ label: '', value: '' });
  }

  protected removeContactEmail(index: number): void {
    this.draft.contact.emails.splice(index, 1);
  }

  protected addBusinessHour(): void {
    this.draft.contact.businessHours.push('');
  }

  protected removeBusinessHour(index: number): void {
    this.draft.contact.businessHours.splice(index, 1);
  }

  protected addSocialLink(): void {
    this.draft.contact.socials.push({ label: '', url: '' });
  }

  protected removeSocialLink(index: number): void {
    this.draft.contact.socials.splice(index, 1);
  }

  private createStat(): StatItem {
    return { label: '', value: 0, suffix: '' };
  }

  private createService(): ServiceCard {
    return {
      title: '',
      icon: '✨',
      description: '',
      highlights: [''],
      tagline: ''
    };
  }

  private createTestimonial(): Testimonial {
    return {
      quote: '',
      name: '',
      title: '',
      location: '',
      rating: 5,
      type: 'client'
    };
  }

  private createInsight(): InsightItem {
    return {
      title: '',
      category: '',
      summary: '',
      readTime: ''
    };
  }

  protected addServicesCategory(): void {
    this.servicesDraft?.categories.push({
      name: '',
      description: '',
      deliverables: [''],
      outcomes: ['']
    });
  }

  protected removeServicesCategory(index: number): void {
    this.servicesDraft?.categories.splice(index, 1);
  }

  protected addServicesDeliverable(category: ServicesPageContent['categories'][number]): void {
    category.deliverables.push('');
  }

  protected removeServicesDeliverable(category: ServicesPageContent['categories'][number], index: number): void {
    category.deliverables.splice(index, 1);
  }

  protected addServicesOutcome(category: ServicesPageContent['categories'][number]): void {
    category.outcomes.push('');
  }

  protected removeServicesOutcome(category: ServicesPageContent['categories'][number], index: number): void {
    category.outcomes.splice(index, 1);
  }

  protected saveServicesContent(): void {
    if (!this.servicesDraft) {
      return;
    }
    this.pageContent
      .savePage('services', this.clone(this.servicesDraft))
      .pipe(take(1))
      .subscribe({
        error: (error) => console.error('Failed to save services content', error)
      });
  }

  protected resetServicesContent(): void {
    const current = this.servicesContentSignal();
    if (current) {
      this.servicesDraft = this.clone(current);
    }
  }

  protected addAcademyTrack(): void {
    this.academyDraft?.tracks.push({
      title: '',
      description: '',
      modules: [''],
      outcomes: ['']
    });
  }

  protected removeAcademyTrack(index: number): void {
    this.academyDraft?.tracks.splice(index, 1);
  }

  protected addTrackModule(track: AcademyPageContent['tracks'][number]): void {
    track.modules.push('');
  }

  protected removeTrackModule(track: AcademyPageContent['tracks'][number], index: number): void {
    track.modules.splice(index, 1);
  }

  protected addTrackOutcome(track: AcademyPageContent['tracks'][number]): void {
    track.outcomes.push('');
  }

  protected removeTrackOutcome(track: AcademyPageContent['tracks'][number], index: number): void {
    track.outcomes.splice(index, 1);
  }

  protected saveAcademyContent(): void {
    if (!this.academyDraft) {
      return;
    }
    this.pageContent
      .savePage('academy', this.clone(this.academyDraft))
      .pipe(take(1))
      .subscribe({
        error: (error) => console.error('Failed to save academy content', error)
      });
  }

  protected resetAcademyContent(): void {
    const current = this.academyContentSignal();
    if (current) {
      this.academyDraft = this.clone(current);
    }
  }

  protected addPortfolioWork(): void {
    this.portfolioDraft?.work.push({
      title: '',
      client: '',
      region: '',
      summary: '',
      tags: ['']
    });
  }

  protected removePortfolioWork(index: number): void {
    this.portfolioDraft?.work.splice(index, 1);
  }

  protected addPortfolioTag(work: PortfolioPageContent['work'][number]): void {
    work.tags.push('');
  }

  protected removePortfolioTag(work: PortfolioPageContent['work'][number], index: number): void {
    work.tags.splice(index, 1);
  }

  protected savePortfolioContent(): void {
    if (!this.portfolioDraft) {
      return;
    }
    this.pageContent
      .savePage('portfolio', this.clone(this.portfolioDraft))
      .pipe(take(1))
      .subscribe({
        error: (error) => console.error('Failed to save portfolio content', error)
      });
  }

  protected resetPortfolioContent(): void {
    const current = this.portfolioContentSignal();
    if (current) {
      this.portfolioDraft = this.clone(current);
    }
  }

  protected addAboutValue(): void {
    this.aboutDraft?.values.push({ title: '', description: '' });
  }

  protected removeAboutValue(index: number): void {
    this.aboutDraft?.values.splice(index, 1);
  }

  protected addAboutLeadershipHighlight(): void {
    this.aboutDraft?.leadership.highlights.push('');
  }

  protected removeAboutLeadershipHighlight(index: number): void {
    this.aboutDraft?.leadership.highlights.splice(index, 1);
  }

  protected saveAboutContent(): void {
    if (!this.aboutDraft) {
      return;
    }
    this.pageContent
      .savePage('about', this.clone(this.aboutDraft))
      .pipe(take(1))
      .subscribe({
        error: (error) => console.error('Failed to save about content', error)
      });
  }

  protected resetAboutContent(): void {
    const current = this.aboutContentSignal();
    if (current) {
      this.aboutDraft = this.clone(current);
    }
  }

  protected addInsightEntry(): void {
    this.insightsDraft?.entries.push({ title: '', category: '', excerpt: '', readTime: '' });
  }

  protected removeInsightEntry(index: number): void {
    this.insightsDraft?.entries.splice(index, 1);
  }

  protected saveInsightsContent(): void {
    if (!this.insightsDraft) {
      return;
    }
    this.pageContent
      .savePage('insights', this.clone(this.insightsDraft))
      .pipe(take(1))
      .subscribe({
        error: (error) => console.error('Failed to save insights content', error)
      });
  }

  protected resetInsightsContent(): void {
    const current = this.insightsContentSignal();
    if (current) {
      this.insightsDraft = this.clone(current);
    }
  }

  protected addContactPageEmail(): void {
    this.contactDraft?.emails.push('');
  }

  protected removeContactPageEmail(index: number): void {
    this.contactDraft?.emails.splice(index, 1);
  }

  protected addContactFormOption(): void {
    this.contactDraft?.formOptions.push('');
  }

  protected removeContactFormOption(index: number): void {
    this.contactDraft?.formOptions.splice(index, 1);
  }

  protected saveContactPageContent(): void {
    if (!this.contactDraft) {
      return;
    }
    this.pageContent
      .savePage('contact', this.clone(this.contactDraft))
      .pipe(take(1))
      .subscribe({
        error: (error) => console.error('Failed to save contact page content', error)
      });
  }

  protected resetContactPageContent(): void {
    const current = this.contactContentSignal();
    if (current) {
      this.contactDraft = this.clone(current);
    }
  }

  protected addNavigationLink(): void {
    this.navigationDraft?.links.push({ label: '', path: '' });
  }

  protected removeNavigationLink(index: number): void {
    this.navigationDraft?.links.splice(index, 1);
  }

  protected saveNavigationLinks(): void {
    if (!this.navigationDraft) {
      return;
    }
    this.pageContent
      .savePage('navigation', this.clone(this.navigationDraft))
      .pipe(take(1))
      .subscribe({
        error: (error) => console.error('Failed to save navigation links', error)
      });
  }

  protected resetNavigationLinks(): void {
    const current = this.navigationContentSignal();
    if (current) {
      this.navigationDraft = this.clone(current);
    }
  }

  protected addFooterSocial(): void {
    this.footerDraft?.socialLinks.push({ label: '', url: '' });
  }

  protected removeFooterSocial(index: number): void {
    this.footerDraft?.socialLinks.splice(index, 1);
  }

  protected saveFooterSocials(): void {
    if (!this.footerDraft) {
      return;
    }
    this.pageContent
      .savePage('footer', this.clone(this.footerDraft))
      .pipe(take(1))
      .subscribe({
        error: (error) => console.error('Failed to save footer socials', error)
      });
  }

  protected resetFooterSocials(): void {
    const current = this.footerContentSignal();
    if (current) {
      this.footerDraft = this.clone(current);
    }
  }

  protected addSitemapLink(): void {
    this.sitemapDraft?.links.push({ label: '', url: '' });
  }

  protected removeSitemapLink(index: number): void {
    this.sitemapDraft?.links.splice(index, 1);
  }

  protected saveSitemapLinks(): void {
    if (!this.sitemapDraft) {
      return;
    }
    this.pageContent
      .savePage('sitemap', this.clone(this.sitemapDraft))
      .pipe(take(1))
      .subscribe({
        error: (error) => console.error('Failed to save sitemap links', error)
      });
  }

  protected resetSitemapLinks(): void {
    const current = this.sitemapContentSignal();
    if (current) {
      this.sitemapDraft = this.clone(current);
    }
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  }
}
