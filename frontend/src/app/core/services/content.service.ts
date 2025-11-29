import { Injectable, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { Observable, defer, of } from 'rxjs';

import {
  HomeContent,
} from '../models/home-content.model';
import { PricingPlanItem } from '../models/pricing-plan.model';
import { NavigationContent } from '../models/site-content.model';
import { SiteContactChannels } from '../models/site-identity.model';
import { SiteIdentityService } from './site-identity.service';

type PageKey =
  | 'services'
  | 'academy'
  | 'portfolio'
  | 'about'
  | 'insights'
  | 'contact'
  | 'navigation'
  | 'sitemap';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly storageKey = 'objectcanvas-zeroprogramming-home-content';
  private readonly pricingPlans: PricingPlanItem[] = [
    {
      id: 'starter',
      name: 'Starter Track',
      duration: '3 Months',
      features: ['Live classes twice per week', 'Weekly project labs', 'Parent progress updates'],
    },
    {
      id: 'growth',
      name: 'Growth Track',
      duration: '6 Months',
      features: ['Everything in Starter', 'STEM club membership', 'Monthly mentor coaching'],
    },
    {
      id: 'explorer',
      name: 'Explorer Track',
      duration: '12 Months',
      features: [
        'Everything in Growth',
        'Quarterly innovation sprints',
        'Dedicated learning concierge',
      ],
    },
  ];

  private readonly defaultNavigation: NavigationContent = {
    brand: {
      name: 'ObjectCanvas',
      tagline: '',
      logo: '/images/logo/oct_logo.png',
      link: '/',
    },
    primaryLinks: [
      { label: 'Home', path: '/', exact: true },
      { label: 'About', path: '/about', exact: true },
      { label: 'Product', path: '/product', exact: true },
      { label: 'Academy', path: '/academy', exact: true },
      { label: 'Blog', path: '/blog', exact: false },
      { label: 'Contact', path: '/contact', exact: true },
    ],
    aboutMenu: [
      { title: 'Company Overview', href: '/about/overview' },
      { title: 'Mission', href: '/about/mission' },
      { title: 'Vision', href: '/about/vision' },
      { title: 'Team Member', href: '/about/team' },
    ],
    collaborationMenu: [
      {
        label: 'Team Augmentation',
        slug: 'team-augmentation',
        summary: 'Embed elite engineers directly into your teams with rapid onboarding.',
      },
      {
        label: 'End-to-End Development',
        slug: 'end-to-end-development',
        summary: 'Full lifecycle builds from discovery to launch with cohesive teams.',
      },
      {
        label: 'MVP Development',
        slug: 'mvp-development',
        summary: 'Lean experiments and fast iterations to validate the right product.',
      },
      {
        label: 'Offshore Development',
        slug: 'offshore-development',
        summary: 'Build and scale cost-effectively with dedicated offshore squads.',
      },
    ],
    technologies: ['C#', '.Net', 'JavaScript', 'C++', 'Python', 'Java', 'PHP', 'Golang', 'Flutter'],
    hiringLinks: [
      { label: '.NET Developers', href: '/services' },
      { label: 'JavaScript Developers', href: '/services' },
      { label: 'Python Developers', href: '/services' },
      { label: 'Java Developers', href: '/services' },
      { label: 'Golang Developers', href: '/services' },
    ],
    productMenu: [
      { title: 'Accounting -Inventory', href: '/products/accounting-inventory' },
      { title: 'POS Software', href: '/products/pos-software' },
      { title: 'Real Estate Management', href: '/products/real-estate-management' },
      { title: 'Production Management', href: '/products/production-management' },
      { title: 'Hardware Business', href: '/products/hardware-business' },
      { title: 'Mobile Shop Management', href: '/products/mobile-shop-management' },
      { title: 'Electronics Showroom', href: '/products/electronics-showroom' },
      { title: 'Distribution Management', href: '/products/distribution-management' },
    ],
  };

  private readonly siteIdentity = inject(SiteIdentityService);

  private readonly initialHomeContent: HomeContent = {
    hero: {
      badge: '',
      title: '',
      description: '',
      primaryCta: {
        label: '',
        routerLink: undefined,
      },
      secondaryCta: {
        label: '',
        routerLink: undefined,
      },
      highlightCard: {
        title: '',
        description: '',
      },
      highlightList: [],
      video: {
        src: '',
        poster: '',
      },
      featurePanel: {
        eyebrow: '',
        title: '',
        description: '',
        metrics: [],
        partner: {
          label: '',
          description: '',
        },
      },
    },

    trust: {
      tagline: '',
      logos: [],
      stats: [],
    },
    collaboration: {
      header: {
        eyebrow: 'Collaboration',
        title: 'Our Methodology to Collaboration',
        subtitle:
          'Engagement models tailored to how you want to work—with clear ownership and predictable outcomes.',
        align: 'center',
      },
      items: [
        {
          order: '01',
          title: 'Team Augmentation',
          description:
            'Deploy a dedicated tech team that integrates seamlessly with your business. They’ll tackle your project needs with precision.',
          cta: { label: 'Explore Now', routerLink: '/methodology/team-augmentation' },
        },
        {
          order: '02',
          title: 'MVP Services',
          description:
            'From idea to launch, we provide the essentials to build your startup’s minimum viable product effectively.',
          cta: { label: 'Explore Now', routerLink: '/methodology/mvp-development' },
        },
        {
          order: '03',
          title: 'End to End Development',
          description:
            'Comprehensive development services from initial design through deployment and maintenance.',
          cta: { label: 'Explore Now', routerLink: '/methodology/end-to-end-development' },
        },
        {
          order: '04',
          title: 'Offshore Office Expansion',
          description:
            'Grow your presence internationally with our strategic office setup services in key markets around the globe.',
          cta: { label: 'Explore Now', routerLink: '/methodology/offshore-development' },
        },
      ],
    },
    services: {
      header: {
        eyebrow: 'Solutions',
        title: 'Comprehensive Technology Solutions',
      },
      items: [
        {
          title: '',
          icon: '💻',
          description: '',
          highlights: [],
          tagline: '',
        },
        {
          title: '',
          icon: '',
          description: '',
          highlights: [],
          tagline: 'Your Digital Home, Perfected',
        },
        {
          title: 'Digital Marketing',
          icon: '🎯',
          description:
            'Grow your global visibility with performance-driven campaigns and storytelling that resonates.',
          highlights: [
            'SEO & multi-language content strategy',
            'Full-funnel paid media management',
            'Brand development & identity systems',
            'Data-driven analytics and conversion optimization',
          ],
          tagline: 'Grow Your Digital Presence Globally',
        },
      ],
    },

    differentiators: {
      header: {
        eyebrow: 'Why ObjectCanvas ',
        title: 'Why Leading Companies Choose Us',
        subtitle:
          'End-to-end partnership, measurable outcomes, and a commitment to the teams who rely on our solutions every day.',
      },
      items: [
        {
          title: 'Global Standards, Local Expertise',
          description:
            'International delivery quality with a deep understanding of Bangladesh and emerging markets to localize impact.',
        },
      ],
      partnershipPanel: {
        eyebrow: 'Partnership DNA',
        title: 'Strategy, build, enablement and continuous optimization—one integrated team.',
        description:
          'We embed with your teams, align KPIs, and share knowledge through ObjectCanvas Academy so you stay in control long after launch.',
        highlights: [
          { label: 'Dedicated PMO', value: 'Weekly sprints & dashboards' },
          { label: 'Academy Enablement', value: 'Workshops & certifications' },
        ],
      },
    },
    methodology: {
      header: {
        eyebrow: 'Our Methodology',
        title: 'How We Work',
        subtitle: 'A proven framework that keeps delivery transparent, collaborative, and fast.',
        align: 'center',
      },
      steps: [
        {
          step: 'Discover',
          detail: 'Deep dive workshops to understand objectives, users, and success metrics.',
        },
        {
          step: 'Design',
          detail: 'Collaborative prototyping, technical architecture, and experience design.',
        },
        {
          step: 'Develop',
          detail:
            'Agile delivery with continuous integration, QA automation, and security reviews.',
        },
        {
          step: 'Deploy',
          detail: 'Cloud-native deployment, observability setup, and go-live orchestration.',
        },
        {
          step: 'Discover',
          detail: '24/7 monitoring, optimization sprints, and on-demand training for your teams.',
        },
      ],
    },
    caseStudies: {
      header: {
        eyebrow: 'Success Stories',
        title: 'Success Stories That Inspire',
        subtitle:
          'Experience the measurable outcomes we deliver for Bangladesh and international brands.',
        align: 'center',
      },
      items: [
        {
          client: '',
          industry: '',
          challenge: '',
          solution: '',
          result: '',
        },
      ],
    },
    academy: {
      header: {
        eyebrow: 'ObjectCanvas Academy',
        title: 'ObjectCanvas Academy: Learn Technology, Build Careers',
        subtitle: 'Live online courses taught by industry experts. From beginner to professional.',
      },
      categories: [
        'Web Development',
        'Digital Marketing',
        'Software Engineering',
        'Mobile Development',
        'Data Science & AI',
        'UI/UX Design',
      ],
      stats: [
        { label: 'Students Enrolled', value: 10, suffix: 'K+' },
        { label: 'Course Completion Rate', value: 95, suffix: '%' },
        { label: 'Average Rating', value: 4.9, suffix: '/5', decimals: 1 },
        { label: 'Courses Available', value: 80, suffix: '+' },
      ],
      featuredCourses: [
        {
          title: 'Full-Stack Web Development with Angular & Node.js',
          instructor: 'Sadia Rahman (Ex-Google)',
          duration: '12 weeks · Live · Capstone Project',
          rating: '4.9/5 (320 reviews)',
          price: 'BDT 18,500 | $165',
        },
        {
          title: 'Performance Marketing Accelerator',
          instructor: 'Tahmid Hasan (Meta Certified)',
          duration: '8 weeks · Live Campaign Clinics',
          rating: '4.8/5 (210 reviews)',
          price: 'BDT 14,000 | $125',
        },
        {
          title: 'Cloud & DevOps Engineer Program',
          instructor: 'Farzana Chowdhury (AWS Community Builder)',
          duration: '10 weeks · Labs & Certifications',
          rating: '4.9/5 (185 reviews)',
          price: 'BDT 22,000 | $195',
        },
      ],
      benefits: [
        'Live interactive sessions (not pre-recorded)',
        'Mentors aligned with active ObjectCanvas projects',
        'Lifetime access to resources',
        'Job placement support & mentorship',
      ],
    },
    globalPresence: {
      header: {
        eyebrow: 'Global Presence',
        title: 'From Dhaka to the World',
        subtitle:
          'Proudly Bangladeshi, globally connected—delivering excellence across continents with the agility of local teams.',
      },
      headquarters: {
        title: 'Headquarters',
        location: '📍 Dhaka, Bangladesh',
        address: 'Innovation Avenue, Tejgaon, Dhaka 1207',
      },
      marketsServed: 'Asia · Europe · North America · Middle East · Australia',
      verticals: 'Fintech · Retail · Healthcare · SaaS · Public Sector · Education',
      map: {
        title: 'Global Delivery Map',
        description:
          'Animated map placeholder — highlight major hubs in Dhaka, Singapore, Dubai, London, Toronto, Sydney.',
        badge: 'Cloud-first. Remote-native. 24/7 support.',
      },
    },
    // ✅ Empty testimonials – API will fully drive this
    testimonials: {
      header: {
        eyebrow: 'Testimonials',
        title: 'What Our Clients & Students Say',
        subtitle:
          'Real outcomes, global voices. Explore how partnerships and learning experiences reshape careers and companies.',
        align: 'center',
      },
      items: [],
    },

    impact: {
      header: {
        eyebrow: 'Numbers That Matter',
        title: 'Impact in Every Engagement',
        subtitle:
          'Metrics that capture our commitment to excellence, support, and continuous learning.',
        align: 'center',
      },
      stats: [
        { label: 'Projects Delivered', value: 500, suffix: '+' },
        { label: 'Countries Served', value: 50, suffix: '+' },
        { label: 'Students Trained', value: 10, suffix: 'K+' },
        { label: 'Years Combined Experience', value: 15, suffix: '+' },
      ],
    },
    insights: {
      header: {
        eyebrow: 'Latest Insights',
        title: 'Tech Insights & Learning Resources',
        subtitle:
          'Deep dives, playbooks, and tutorials from our engineering, marketing, and academy teams.',
        align: 'center',
      },
      items: [
        {
          title: 'Designing Omni-Channel Experiences for Emerging Markets',
          category: 'Case Study',
          summary:
            'How ObjectCanvas reimagined retail experiences with localized content and automation.',
          readTime: '7 min read',
        },
        {
          title: 'Scaling Engineering Teams with Academy-led Upskilling',
          category: 'Academy',
          summary:
            'Building engineering excellence through custom training journeys and mentorship.',
          readTime: '5 min read',
        },
        {
          title: 'The Playbook for High-Converting SaaS Websites',
          category: 'Insights',
          summary:
            'UI/UX strategies and experimentation frameworks that deliver measurable growth.',
          readTime: '8 min read',
        },
      ],
    },
    closingCtas: {
      business: {
        title: 'Ready to Transform Your Business?',
        description:
          'Collaborate with our strategists and engineers to design your next breakthrough.',
        cta: {
          label: 'Start Your Project',
          routerLink: '/contact',
        },
      },
      academy: {
        title: 'Ready to Advance Your Career?',
        description:
          'Enroll in ObjectCanvas Academy programs to upgrade your skills with mentorship from industry practitioners.',
        cta: {
          label: 'Browse Courses',
          routerLink: '/academy',
        },
      },
    },
    contact: {
      header: {
        eyebrow: 'Contact',
        title: "Let's Build Something Amazing Together",
        subtitle: 'Tell us about your goals and we will curate a dedicated team for you.',
      },
      headquarters:
        'ObjectCanvas Studios & ObjectCanvas Academy, 12/2 Innovation Avenue, Tejgaon, Dhaka 1207',
      phones: this.buildContactPhones(),
      emails: [...this.buildContactEmails(), { label: 'Academy', value: 'admissions@.com' }],
      businessHours: ['Sun-Thu: 9:00 AM - 6:00 PM (GMT+6)', 'Fri-Sat: Closed'],
      socials: this.buildSocialLinks(),
      consultation: {
        label: 'Schedule a Free Consultation',
        routerLink: '/contact',
        fragment: 'consultation',
      },
      profileDownload: {
        label: 'Download Company Profile (PDF)',
        url: 'https://objectcanvas.com/company-profile.pdf',
      },
    },
  };

  private readonly homeState = signal<HomeContent>(this.loadHomeContent());
  private readonly pageStorageKeyPrefix = 'objectcanvas-zeroprogramming-page-';

  private readonly pageSignals = new Map<PageKey, WritableSignal<unknown | null>>();

  readonly homeContent = computed(() => this.homeState());
  readonly navigationContent = this.getPageSignal<NavigationContent>('navigation');

  getDefaultNavigation(): NavigationContent {
    return this.clone(this.defaultNavigation);
  }

  setHomeContent(content: HomeContent): void {
    const next = this.clone(content);
    this.homeState.set(next);
    this.writeHomeContent(next);
  }

  setNavigationContent(content: NavigationContent): void {
    this.setPageContent('navigation', content);
  }

  getPricingPlans(): Observable<PricingPlanItem[]> {
    return defer(() => of(this.clone(this.pricingPlans)));
  }

  resetHomeContent(): void {
    this.homeState.set(this.clone(this.initialHomeContent));
    if (this.canUseStorage()) {
      localStorage.removeItem(this.storageKey);
    }
  }

  getPageSignal<T>(key: PageKey): Signal<T | null> {
    const pageSignal = this.ensurePageSignal<T>(key);
    return computed(() => pageSignal());
  }

  savePage<T>(key: PageKey, content: T): Observable<T> {
    return defer(() => {
      const next = this.clone(content);
      const pageSignal = this.ensurePageSignal<T>(key);
      pageSignal.set(next);
      this.writePageToStorage(key, next);
      return of(next);
    });
  }

  private setPageContent<T>(key: PageKey, content: T): void {
    const next = this.clone(content);
    const pageSignal = this.ensurePageSignal<T>(key);
    pageSignal.set(next);
    this.writePageToStorage(key, next);
  }

  applyContactChannels(channels: SiteContactChannels): void {
    this.siteIdentity.updateContactChannels(channels);

    this.homeState.update((home) => {
      if (!home) {
        return home;
      }

      return {
        ...home,
        contact: {
          ...home.contact,
          phones: this.buildContactPhones(channels),
          emails: [
            ...this.buildContactEmails(channels),
            { label: 'Academy', value: 'admissions@.com' },
          ],
          socials: this.buildSocialLinks(channels),
          responseTime: `We respond within 24 business hours. For urgent queries, call ${channels.phoneNumbers.local}.`,
        },
      };
    });

    const contactSignal = this.pageSignals.get('contact');
    if (contactSignal) {
      const current = contactSignal() as any;
      if (current) {
        contactSignal.set({
          ...current,
          emails: [channels.businessEmail, 'admissions@.com', channels.supportEmail],
          responseTime: `We respond within 24 business hours. For urgent queries, call ${channels.phoneNumbers.local}.`,
        });
        this.writePageToStorage('contact', contactSignal());
      }
    }
  }

  private buildContactPhones(
    channels: SiteContactChannels = this.siteIdentity.contactChannels()
  ): string[] {
    return [
      `Local: ${channels.phoneNumbers.local}`,
      `International: ${channels.phoneNumbers.international}`,
      `${channels.whatsapp.local.label}: ${channels.whatsapp.local.number}`,
      `${channels.whatsapp.international.label}: ${channels.whatsapp.international.number}`,
    ];
  }

  private buildContactEmails(
    channels: SiteContactChannels = this.siteIdentity.contactChannels()
  ): { label: string; value: string }[] {
    return [
      { label: 'Business', value: channels.businessEmail },
      { label: 'Support', value: channels.supportEmail },
    ];
  }

  private buildSocialLinks(
    channels: SiteContactChannels = this.siteIdentity.contactChannels()
  ): { label: string; url: string }[] {
    return channels.socialLinks.map((link) => ({ ...link }));
  }

  private loadHomeContent(): HomeContent {
    if (!this.canUseStorage()) {
      return this.clone(this.initialHomeContent);
    }
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return this.clone(this.initialHomeContent);
    }
    try {
      const parsed = JSON.parse(raw) as HomeContent;
      return this.clone({
        ...parsed,
        collaboration: parsed.collaboration ?? this.initialHomeContent.collaboration,
      });
    } catch {
      return this.clone(this.initialHomeContent);
    }
  }

  private writeHomeContent(content: HomeContent): void {
    if (!this.canUseStorage()) {
      return;
    }
    localStorage.setItem(this.storageKey, JSON.stringify(content));
  }

  private ensurePageSignal<T>(key: PageKey): WritableSignal<T | null> {
    let pageSignal = this.pageSignals.get(key) as WritableSignal<T | null> | undefined;
    if (!pageSignal) {
      pageSignal = signal<T | null>(null);
      this.pageSignals.set(key, pageSignal);
    }
    return pageSignal;
  }

  private writePageToStorage<T>(key: PageKey, value: T): void {
    if (!this.canUseStorage()) {
      return;
    }
    localStorage.setItem(`${this.pageStorageKeyPrefix}${key}`, JSON.stringify(value));
  }

  private canUseStorage(): boolean {
    try {
      return typeof window !== 'undefined' && !!window.localStorage;
    } catch {
      return false;
    }
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  }
}
