import { Injectable, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { Observable, defer, map, of, tap } from 'rxjs';

import {
  HomeContent,
  InsightItem,
  ServiceCard,
  StatItem,
  Testimonial,
} from '../models/home-content.model';
import { PricingPlanItem } from '../models/pricing-plan.model';
import { NavigationContent } from '../models/site-content.model';
import { SiteContactChannels } from '../models/site-identity.model';
import { SiteIdentityService } from './site-identity.service';
import { HomePageApiService } from './home-page-api.service';

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
  private readonly homeApi = inject(HomePageApiService);
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
      name: 'ObjectCanvas Technology',
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
      badge: 'ObjectCanvas Technology',
      title: 'One Alliance. Infinite Digital Outcomes.',
      description:
        'ObjectCanvas engineers mission-critical software and experiences while  mentors deliver the talent to scale them. Together we help ambitious teams ship faster and learn smarter.',
      primaryCta: {
        label: 'Start Your Project',
        routerLink: '/contact',
      },
      secondaryCta: {
        label: 'Explore Academy',
        routerLink: '/academy',
      },
      highlightCard: {
        title: 'From Bangladesh to the World 🇧🇩',
        description:
          'Trusted by founders, enterprises, and governments across Asia, Europe, North America, the Middle East, and Australia.',
      },
      highlightList: [
        'Tailored enterprise technology for global impact',
        'Dedicated project teams aligned with your timezone',
        'Live instructor-led courses with industry experts',
      ],
      video: {
        src: this.siteIdentity.getHeroVideo('home')?.src ?? '/video/bg.mp4',
        poster:
          this.siteIdentity.getHeroVideo('home')?.poster ??
          'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1600&q=80',
      },
      featurePanel: {
        eyebrow: 'Global Delivery Model',
        title: 'Product squads meet academy mentors',
        description:
          'ObjectCanvas product strategists, engineers, and designers partner with  instructors to align delivery rituals, documentation, and enablement from day one.',
        metrics: [
          { label: 'Timezone aligned', value: 'Asia · EU · NA', theme: 'accent' },
          { label: 'Delivery Velocity', value: '2x faster GTM', theme: 'emerald' },
        ],
        partner: {
          label: 'Trusted technology & academy partner',
          description:
            'Align business outcomes with skill transformation—ObjectCanvas Academy trains your teams to own and scale every solution we deploy.',
        },
      },
    },
    trust: {
      tagline: 'Trusted by teams at',
      companies: ['Walton', 'Tricon', 'Arian', 'Ashaven'],
      stats: [
        { label: 'Projects Delivered', value: 500, suffix: '+' },
        { label: 'Countries Served', value: 50, suffix: '+' },
        { label: 'Students Trained', value: 10, suffix: 'K+' },
        { label: 'Years Combined Experience', value: 15, suffix: '+' },
      ],
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
      title: 'Software Development',
      icon: '💻',
      description:
        'Build resilient platforms across web, mobile, and cloud with modern engineering practices.',
      highlights: [
        'Custom enterprise applications',
        'Mobile experiences for iOS and Android',
        'API integrations & automation',
        'Cloud architecture, DevOps & observability',
      ],
      tagline: 'Building Scalable Solutions',
    },
    {
      title: 'Website Building',
      icon: '🌐',
      description:
        'Design pixel-perfect digital homes that translate your brand into immersive customer journeys.',
      highlights: [
        'Responsive corporate and e-commerce sites',
        'Conversion-optimized landing pages',
        'WordPress & headless CMS implementations',
        'Continuous support and performance tuning',
      ],
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
    {
      title: 'UI/UX Design',
      icon: '🎨',
      description:
        'Craft intuitive, conversion-focused experiences that feel natural on every screen.',
      highlights: [
        'User research & journey mapping',
        'Wireframes, prototypes & design systems',
        'Mobile-first and responsive design',
        'Usability testing & UX audits',
      ],
      tagline: 'Designs That Users Love',
    },
    {
      title: 'Cross-Platform Mobile Apps',
      icon: '📱',
      description:
        'Ship polished apps for iOS and Android from a single, maintainable codebase.',
      highlights: [
        'Flutter, React Native & hybrid stacks',
        'Consistent UI across devices',
        'Offline-first and sync strategies',
        'App Store & Play Store deployment support',
      ],
      tagline: 'One Codebase, Every Device',
    },
    {
      title: 'Software Quality Assurance (SQA)',
      icon: '✅',
      description:
        'Ensure every release is stable, secure, and ready for real users before it ships.',
      highlights: [
        'Manual & automated test suites',
        'Functional, regression & smoke testing',
        'Performance and load testing',
        'Bug reporting, triage & quality gates',
      ],
      tagline: 'Ship with Confidence',
    },
    {
      title: 'Database & DBMS Solutions',
      icon: '🗄️',
      description:
        'Design and optimize data architectures that scale with your business, not against it.',
      highlights: [
        'Relational & NoSQL database design',
        'Query optimization & indexing',
        'Data migration & backup strategies',
        'High availability & replication setups',
      ],
      tagline: 'Data You Can Rely On',
    },
    {
      title: 'Cloud Infrastructure & Services',
      icon: '☁️',
      description:
        'Leverage AWS, Azure, and GCP to build secure, scalable, and cost-efficient platforms.',
      highlights: [
        'Cloud architecture & cost optimization',
        'Containerization with Docker & Kubernetes',
        'CI/CD pipelines & DevOps practices',
        'Monitoring, logging & incident response',
      ],
      tagline: 'Scale Faster, Spend Smarter',
    }
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
        {
          title: 'Proven Track Record',
          description:
            '500+ successful projects across fintech, retail, telco, and startups spanning 50+ countries.',
        },
        {
          title: 'End-to-End Solutions',
          description:
            'Strategy, execution, maintenance, and training handled by dedicated cross-functional teams.',
        },
        {
          title: 'Transparent Communication',
          description:
            'Real-time reporting, dedicated PMs, and communication aligned to your timezone and toolstack.',
        },
        {
          title: 'Certified Professionals',
          description:
            'Engineers and marketers certified by AWS, Google, Microsoft, Meta, and HubSpot.',
        },
        {
          title: 'Beyond Delivery',
          description:
            'We empower your team with upskilling and internal enablement through ObjectCanvas Academy programs.',
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
          step: 'Support',
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
          client: 'Aarong Global',
          industry: 'Retail & E-commerce',
          challenge: 'Low conversion rates and fragmented customer journeys.',
          solution: 'Full-stack replatforming, UX revamp, and omnichannel marketing automation.',
          result: '250% increase in online revenue within 6 months.',
        },
        {
          client: 'NovaCare Health',
          industry: 'Healthcare',
          challenge: 'Legacy systems limiting patient experience across regions.',
          solution: 'HIPAA-compliant patient portal with mobile apps and AI triage assistant.',
          result: 'Customer satisfaction jumped to 4.9/5 and support tickets reduced by 63%.',
        },
        {
          client: 'Velocity Fintech',
          industry: 'Financial Services',
          challenge: 'Needed a scalable API layer to expand into new markets quickly.',
          solution:
            'Microservices architecture with automated compliance checks and observability.',
          result: 'Launch speed improved by 3x across 5 new countries.',
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
    testimonials: {
      header: {
        eyebrow: 'Testimonials',
        title: 'What Our Clients & Students Say',
        subtitle:
          'Real outcomes, global voices. Explore how partnerships and learning experiences reshape careers and companies.',
        align: 'center',
      },
      items: [
        {
          quote:
            'ObjectCanvas transformed our digital presence and unified our customer journey across markets. Their strategy and execution rival the best global agencies.',
          name: 'Arif Khan',
          title: 'Chief Digital Officer, Aarong Global',
          location: 'Dhaka & Dubai',
          rating: 5,
          type: 'client',
          image:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
        },
        {
          quote:
            'The engineering team delivered a robust fintech platform ahead of schedule. Their communication cadence and technical depth were outstanding.',
          name: 'Sophia Patel',
          title: 'VP Product, Velocity Fintech',
          location: 'Singapore',
          rating: 5,
          type: 'client',
          image:
            'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80',
        },
        {
          quote:
            'ObjectCanvas Academy’s DevOps bootcamp helped me transition from support engineer to cloud engineer in under six months with real mentorship.',
          name: 'Mahim Islam',
          title: 'Cloud Engineer, Sydney',
          location: 'Sydney, Australia',
          rating: 5,
          type: 'student',
          image:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        },
        {
          quote:
            'Practical, hands-on sessions with industry leaders. The marketing accelerator gave me the confidence and portfolio to land international clients.',
          name: 'Faria Noor',
          title: 'Performance Marketer',
          location: 'Toronto, Canada',
          rating: 5,
          type: 'student',
          image:
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        },
      ],
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

  private readonly defaultPages: Record<PageKey, unknown> = {
    services: {
      header: {
        eyebrow: 'Services',
        title: 'Integrated Services for Ambitious Teams',
        subtitle:
          'Technology, marketing, and learning experiences designed to help you scale globally.',
      },
      categories: [
        {
          name: 'Digital Marketing & Growth',
          description:
            'Integrated performance marketing, organic growth, and brand storytelling executed across markets and languages.',
          deliverables: [
            'Global SEO and content operations',
            'Paid media management (Google, Meta, LinkedIn, TikTok)',
            'Marketing automation & CRM integration',
            'Brand strategy, messaging, and creative production',
          ],
          outcomes: [
            '3x average uplift in qualified leads',
            '40% improvement in multi-touch attribution accuracy',
            'Consistent brand voice across all regions',
          ],
        },
        {
          name: 'Software & Product Engineering',
          description:
            'Modern engineering teams delivering resilient products across cloud, mobile, and enterprise ecosystems.',
          deliverables: [
            'Product discovery, UX research, and service design',
            'Full-stack development with Angular, React, Node.js, Python, Go',
            'Mobile apps (Flutter, Swift, Kotlin, React Native)',
            'DevOps, CI/CD, observability, and managed cloud',
          ],
          outcomes: [
            'Accelerated launches with agile delivery and automation',
            'Battle-tested architecture prepared for scale and compliance',
            'Knowledge transfer to internal teams via ObjectCanvas Academy enablement',
          ],
        },
        {
          name: 'Experience Design & Websites',
          description:
            'Strategic design systems, conversion-first experiences, and high-performing websites for global audiences.',
          deliverables: [
            'Customer journey mapping and UX/UI design systems',
            'Corporate websites, landing pages, and e-commerce experiences',
            'Headless CMS and Jamstack implementations',
            'Accessibility, localization, and performance optimization',
          ],
          outcomes: [
            'Higher conversion rates with optimized user flows',
            'Design systems that scale across products and regions',
            'A/B testing frameworks and analytics dashboards',
          ],
        },
      ],
    },
    academy: {
      header: {
        eyebrow: 'Academy',
        title: 'Live Cohort-Based Learning Programs',
        subtitle:
          'Outcome-driven tracks designed with industry mentors and real project experience.',
      },
      tracks: [
        {
          title: 'Engineering & Cloud',
          description:
            'Live cohort-based programs for frontend, backend, DevOps, and cloud-native architecture.',
          modules: [
            'Angular, React, and Next.js production bootcamps',
            'Microservices with Node.js, NestJS, and Python',
            'DevOps pipelines with GitHub Actions, Docker, Kubernetes',
            'AWS, Azure, and GCP certification readiness',
          ],
          outcomes: [
            'Portfolio-ready projects',
            'Certification support',
            '1:1 mentorship and code reviews',
          ],
        },
        {
          title: 'Digital Marketing & Product Growth',
          description:
            'Performance-driven programs that blend storytelling with analytics and automation.',
          modules: [
            'Growth marketing strategy and experimentation',
            'SEO, content operations, and localization',
            'Paid media mastery with real campaign labs',
            'Analytics, attribution, and CRO frameworks',
          ],
          outcomes: [
            'Campaign playbooks',
            'Live client simulations',
            'Career coaching & placement support',
          ],
        },
        {
          title: 'Design & Product Leadership',
          description:
            'Human-centered design programs for product designers, researchers, and product managers.',
          modules: [
            'Design thinking and research practices',
            'Design systems and component libraries',
            'Product strategy, roadmapping, and OKRs',
            'Leadership communication and stakeholder management',
          ],
          outcomes: [
            'Industry portfolio critiques',
            'Executive mentorship circles',
            'Access to job network partners',
          ],
        },
      ],
    },
    portfolio: {
      header: {
        eyebrow: 'Portfolio',
        title: 'Selected Partnerships & Case Studies',
        subtitle:
          'Experience the business outcomes we unlock for leading brands and public sector teams.',
      },
      work: [
        {
          title: 'Retail Reimagined with Aarong Global',
          client: 'Aarong Global',
          region: 'Dhaka · Dubai',
          summary:
            'Unified e-commerce platform, localized content operations, and omnichannel analytics delivering 250% revenue growth.',
          tags: ['E-commerce', 'UX/UI', 'SEO', 'Marketing Automation'],
        },
        {
          title: 'Velocity Fintech Developer Platform',
          client: 'Velocity Fintech',
          region: 'Singapore · London',
          summary:
            'API marketplace, developer portal, and compliance automation enabling expansion into five new markets in under 12 months.',
          tags: ['Fintech', 'APIs', 'Microservices', 'DevOps'],
        },
        {
          title: 'Healthtech Telemedicine Experience',
          client: 'NovaCare Health',
          region: 'Sydney · Kuala Lumpur',
          summary:
            'HIPAA-compliant telehealth apps with AI triage, improving patient satisfaction to 4.9/5 and reducing support tickets by 63%.',
          tags: ['Healthcare', 'Mobile Apps', 'AI Assistant', 'Compliance'],
        },
        {
          title: 'Government Digital Services in Bangladesh',
          client: 'GovTech Bangladesh',
          region: 'Dhaka',
          summary:
            'Citizen-first portal with multilingual support, accessibility, and data dashboards serving 12M monthly visits.',
          tags: ['Public Sector', 'Accessibility', 'Localization', 'Data Visualization'],
        },
      ],
    },
    about: {
      header: {
        eyebrow: 'About',
        title: 'Human-centered innovation from Bangladesh to the world',
        subtitle:
          'ObjectCanvas Studios and ObjectCanvas Academy partner to ship resilient products while upskilling future talent.',
      },
      intro:
        'ObjectCanvas product strategists, engineers, data scientists, digital marketers, and  educators collaborate as one team. Delivery excellence and capability building move in lockstep, so every engagement ships solutions and skills together.',
      values: [
        {
          title: 'Human First Innovation',
          description:
            'We design technology that augments human potential, embracing accessibility, inclusion, and empathy.',
        },
        {
          title: 'Craftsmanship & Accountability',
          description:
            'Every sprint, deliverable, and training cohort is measured against the outcomes we commit to.',
        },
        {
          title: 'Global Mindset, Local Impact',
          description:
            'We bring international expertise while nurturing Bangladesh’s tech ecosystem and talent pipeline.',
        },
      ],
      leadership: {
        title: 'Leadership & Culture',
        description:
          'Our leadership team brings experience from Google, Microsoft, Meta, and leading Bangladeshi enterprises. We cultivate a culture where curiosity, inclusive collaboration, and continuous learning are rewarded.',
        highlights: [
          '100+ specialists across engineering, design, marketing, and education',
          'Hybrid teams operating from Dhaka, Singapore, Dubai, London, and Toronto',
          'Community programs mentoring 500+ emerging technologists annually',
        ],
        cta: {
          label: "Explore Careers – We're Hiring",
          routerLink: '/about',
          fragment: 'careers',
        },
      },
    },
    insights: {
      header: {
        eyebrow: 'Insights',
        title: 'Perspectives from our build and learn teams',
        subtitle:
          'Explore case studies, technical deep dives, and playbooks for scaling teams and technology.',
      },
      entries: [
        {
          title: 'Building Global Platforms from Bangladesh',
          category: 'Thought Leadership',
          excerpt:
            'How distributed squads, lean experimentation, and academy enablement power our multinational partnerships.',
          readTime: '8 min read',
        },
        {
          title: 'Designing Inclusive Digital Services',
          category: 'Experience Design',
          excerpt:
            'Practical accessibility, localization, and performance strategies for public sector portals and citizen services.',
          readTime: '6 min read',
        },
        {
          title: 'Upskilling Product Teams with ObjectCanvas Academy',
          category: 'Learning',
          excerpt:
            'Playbooks for aligning training roadmaps with product delivery to reduce onboarding time and talent gaps.',
          readTime: '5 min read',
        },
      ],
    },
    contact: {
      header: {
        eyebrow: 'Contact',
        title: 'Partner with ObjectCanvas × ',
        subtitle:
          'Share your goals and we will prepare a tailored action plan, timeline, and resourcing model.',
      },
      consultationOptions: 'Schedule a discovery call, request a proposal, or invite us to an RFP.',
      regionalSupport: 'Dhaka · Singapore · Dubai · London · Toronto',
      emails: [
        this.siteIdentity.contactChannels().businessEmail,
        'admissions@.com',
        this.siteIdentity.contactChannels().supportEmail,
      ],
      formOptions: [
        'Digital Marketing',
        'Software Development',
        'Website Building',
        'ObjectCanvas Academy Programs',
        'General Inquiry',
      ],
      ndaLabel: 'I would like to sign an NDA prior to sharing sensitive information.',
      responseTime: `We respond within 24 business hours. For urgent queries, call ${
        this.siteIdentity.contactChannels().phoneNumbers.local
      }.`,
    },
    navigation: this.defaultNavigation,
    sitemap: {
      links: [
        { label: 'Home', url: '/' },
        { label: 'Services', url: '/services' },
        { label: 'Methodology', url: '/methodology' },
        { label: 'Academy', url: '/academy' },
        { label: 'Portfolio', url: '/portfolio' },
        { label: 'About', url: '/about' },
        { label: 'Contact', url: '/contact' },
        { label: 'Insights', url: '/insights' },
        { label: 'Privacy Policy', url: '/legal/privacy' },
        { label: 'Terms of Service', url: '/legal/terms' },
        { label: 'Refund Policy', url: '/legal/refund' },
      ],
    },
  };

  private readonly pageSignals = new Map<PageKey, WritableSignal<unknown | null>>();

  constructor() {
    this.initializePageSignals();
    this.fetchHomeFromApi();
  }

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

  fetchHomeFromApi(): void {
    this.homeApi.fetch().subscribe({
      next: response => {
        const next = this.mergeHomeContent(this.initialHomeContent, response.content);
        this.homeState.set(next);
        this.writeHomeContent(next);
      },
    });
  }

  saveHomeContent(content: HomeContent): Observable<HomeContent> {
    const payload = this.clone(content);
    return this.homeApi.update(payload).pipe(
      tap(response => {
        const next = this.mergeHomeContent(this.initialHomeContent, response.content);
        this.homeState.set(next);
        this.writeHomeContent(next);
      }),
      map(response => this.mergeHomeContent(this.initialHomeContent, response.content)),
    );
  }

  getPageSignal<T>(key: PageKey): Signal<T | null> {
    const pageSignal = this.ensurePageSignal<T>(key);
    return computed(() => pageSignal());
  }

  loadPage<T>(key: PageKey): Observable<T | null> {
    return defer(() => {
      const stored = this.readPageFromStorage<T>(key);
      const fallback = this.defaultPages[key] as T | undefined;
      const value = stored ?? (fallback ? this.clone(fallback) : null);
      const pageSignal = this.ensurePageSignal<T>(key);
      pageSignal.set(value);
      return of(value);
    });
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

  resetPage<T>(key: PageKey): void {
    const fallback = this.defaultPages[key] as T | undefined;
    const pageSignal = this.ensurePageSignal<T>(key);
    const value = fallback ? this.clone(fallback) : null;
    pageSignal.set(value);
    this.removePageFromStorage(key);
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
          emails: [...this.buildContactEmails(channels), { label: 'Academy', value: 'admissions@.com' }],
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

  private buildContactPhones(channels: SiteContactChannels = this.siteIdentity.contactChannels()): string[] {
    return [
      `Local: ${channels.phoneNumbers.local}`,
      `International: ${channels.phoneNumbers.international}`,
      `${channels.whatsapp.local.label}: ${channels.whatsapp.local.number}`,
      `${channels.whatsapp.international.label}: ${channels.whatsapp.international.number}`,
    ];
  }

  private buildContactEmails(channels: SiteContactChannels = this.siteIdentity.contactChannels()): { label: string; value: string }[] {
    return [
      { label: 'Business', value: channels.businessEmail },
      { label: 'Support', value: channels.supportEmail },
    ];
  }

  private buildSocialLinks(channels: SiteContactChannels = this.siteIdentity.contactChannels()): { label: string; url: string }[] {
    return channels.socialLinks.map((link) => ({ ...link }));
  }

  private initializePageSignals(): void {
    (Object.keys(this.defaultPages) as PageKey[]).forEach((key) => {
      const stored = this.readPageFromStorage<unknown>(key);
      const fallback = this.defaultPages[key];
      const initial = stored ?? (fallback ? this.clone(fallback) : null);
      this.pageSignals.set(key, signal(initial));
    });
  }

  private mergeHomeContent(base: HomeContent, incoming: HomeContent): HomeContent {
    const fallback = this.clone(base);
    const incomingContent = this.clone(incoming);

    const mergedHero = {
      ...fallback.hero,
      ...incomingContent.hero,
      primaryCta: { ...fallback.hero.primaryCta, ...incomingContent.hero?.primaryCta },
      secondaryCta: { ...fallback.hero.secondaryCta, ...incomingContent.hero?.secondaryCta },
      highlightCard: { ...fallback.hero.highlightCard, ...incomingContent.hero?.highlightCard },
      video: { ...fallback.hero.video, ...incomingContent.hero?.video },
      featurePanel: { ...fallback.hero.featurePanel, ...incomingContent.hero?.featurePanel },
    };

    const mergedTrust = {
      ...fallback.trust,
      ...incomingContent.trust,
      companies: incomingContent.trust?.companies ?? fallback.trust.companies,
      stats: incomingContent.trust?.stats ?? fallback.trust.stats,
    };

    const mergedServices = {
      ...fallback.services,
      ...incomingContent.services,
      items: incomingContent.services?.items ?? fallback.services.items,
    };

    const mergedTestimonials = {
      ...fallback.testimonials,
      ...incomingContent.testimonials,
      items: incomingContent.testimonials?.items ?? fallback.testimonials.items,
    };

    const mergedClosing = {
      ...fallback.closingCtas,
      ...incomingContent.closingCtas,
      business: {
        ...fallback.closingCtas.business,
        ...incomingContent.closingCtas?.business,
        cta: { ...fallback.closingCtas.business.cta, ...incomingContent.closingCtas?.business?.cta },
      },
      academy: {
        ...fallback.closingCtas.academy,
        ...incomingContent.closingCtas?.academy,
        cta: { ...fallback.closingCtas.academy.cta, ...incomingContent.closingCtas?.academy?.cta },
      },
    };

    return {
      ...fallback,
      ...incomingContent,
      hero: mergedHero,
      trust: mergedTrust,
      services: mergedServices,
      testimonials: mergedTestimonials,
      closingCtas: mergedClosing,
    };
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

  private readPageFromStorage<T>(key: PageKey): T | null {
    if (!this.canUseStorage()) {
      return null;
    }
    const raw = localStorage.getItem(`${this.pageStorageKeyPrefix}${key}`);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  private writePageToStorage<T>(key: PageKey, value: T): void {
    if (!this.canUseStorage()) {
      return;
    }
    localStorage.setItem(`${this.pageStorageKeyPrefix}${key}`, JSON.stringify(value));
  }

  private removePageFromStorage(key: PageKey): void {
    if (!this.canUseStorage()) {
      return;
    }
    localStorage.removeItem(`${this.pageStorageKeyPrefix}${key}`);
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
