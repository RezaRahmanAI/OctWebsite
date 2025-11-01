import { AcademyTrack, BlogPost, CompanyAbout, Lead, ProductItem, ServiceItem, SiteSettings, TeamMember } from '../models';

export const teamSeed: TeamMember[] = [
  {
    id: '1b8c4d2c-1e41-4ba2-84d5-1d5e8a1f0a01',
    name: 'Sophia Rahman',
    role: 'Chief Executive Officer',
    photoUrl: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=640&q=80',
    bio: 'Sophia leads the strategic direction of ObjectCanvas, connecting vision with execution across teams.',
    email: 'sophia@objectcanvas.com',
    active: true,
  },
  {
    id: '6a5345ce-66f6-4c81-88fb-3d69f739ba19',
    name: 'Arman Chowdhury',
    role: 'Director of Engineering',
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=640&q=80',
    bio: 'Arman architects platform solutions for clients ranging from startups to enterprises.',
    email: 'arman@objectcanvas.com',
    active: true,
  },
  {
    id: '95d4b3c3-22b6-4b63-9419-091223a2d4b2',
    name: 'Priya Sultana',
    role: 'Head of ZeroProgramming Academy',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=640&q=80',
    bio: 'Priya curates outcome-based tracks that empower learners to build portfolio-ready skills.',
    email: 'priya@zeroprogramming.academy',
    active: true,
  },
  {
    id: '0c1de8a6-7f87-4d38-92bf-3a86df206a26',
    name: 'Daniel Hasan',
    role: 'Product Strategist',
    photoUrl: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=640&q=80',
    bio: 'Daniel aligns client objectives with measurable KPIs and product roadmaps.',
    email: 'daniel@objectcanvas.com',
    active: true,
  },
];

export const aboutSeed: CompanyAbout[] = [
  {
    id: 'b9ed8969-4ae2-4f73-a045-428b8274652a',
    key: 'overview',
    content:
      'ObjectCanvas Studios and ZeroProgrammingBD Academy partner to deliver full-spectrum digital innovation. Our blended team of engineers, designers, mentors, and strategists help organizations ship resilient products while enabling the next generation of makers.',
  },
  {
    id: '13b2d390-a3ad-4258-915c-34eaf56bd38b',
    key: 'mission',
    content:
      'Our mission is to unlock reliable software for every ambitious business while upskilling talent with industry-ready programs. We create an ecosystem where services and education fuel one another.',
  },
  {
    id: 'adf0582d-00c9-4c66-9058-4ce0fd6cb8b7',
    key: 'vision',
    content:
      'We envision a region where founders, enterprises, and learners co-create the future—shipping human-centered platforms and jobs of tomorrow from right here in Bangladesh.',
  },
];

export const servicesSeed: ServiceItem[] = [
  {
    id: 'f5323454-8be0-4c8e-8d17-2f5667a3f1ab',
    title: 'Software Development',
    slug: 'software-development',
    summary: 'Dedicated squads delivering robust platforms, integrations, and cloud-native solutions.',
    icon: 'code',
    features: ['Full-stack product teams', 'Agile discovery & delivery', 'Quality automation & DevOps'],
    active: true,
  },
  {
    id: 'c8bdb5b8-cd2e-43c2-9a05-5076b878f0ea',
    title: 'Website Development',
    slug: 'website-development',
    summary: 'High-performance marketing and corporate sites with modern composable stacks.',
    icon: 'globe',
    features: ['Next-gen Jamstack builds', 'CMS implementation', 'Accessibility-first UI'],
    active: true,
  },
  {
    id: '32f26e79-49af-4ae7-a26d-6ff5ec52ffb6',
    title: 'Mobile App Development',
    slug: 'mobile-app-development',
    summary: 'Cross-platform native experiences that your users love and trust.',
    icon: 'smartphone',
    features: ['iOS and Android delivery', 'Offline-first architectures', 'App Store launch support'],
    active: true,
  },
  {
    id: 'f9cd91fa-2cb0-4f60-8b89-e6308d0d8791',
    title: 'Ecommerce Website',
    slug: 'ecommerce-website',
    summary: 'Conversion-optimized commerce platforms with secure checkout and automation.',
    icon: 'shopping-bag',
    features: ['Headless commerce builds', 'Payment & fulfillment integrations', 'Growth analytics dashboard'],
    active: true,
  },
];

export const productsSeed: ProductItem[] = [
  {
    id: '4fb0c5ec-41f9-44ac-b0a9-ccb8717345d5',
    title: 'Accounting-Inventory',
    slug: 'accounting-inventory',
    summary: 'A single source of truth for finances, inventory, and compliance.',
    icon: 'file-text',
    features: ['Automated ledgers', 'Purchase & sales workflows', 'Compliance ready reports'],
    active: true,
  },
  {
    id: '1b238c58-9086-47d9-8c9a-a71a15fe4f27',
    title: 'POS Software',
    slug: 'pos-software',
    summary: 'Modern POS across retail channels with real-time stock syncing.',
    icon: 'credit-card',
    features: ['Multi-branch support', 'Inventory reconciliation', 'Offline billing'],
    active: true,
  },
  {
    id: '0ee8f3dc-0162-4ba3-9faf-7d3bce84185f',
    title: 'Real Estate Management',
    slug: 'real-estate-management',
    summary: 'Lead-to-lease pipelines and smart property upkeep dashboards.',
    icon: 'home',
    features: ['Unit availability tracking', 'Tenant portal', 'Expense analytics'],
    active: true,
  },
  {
    id: '9d7a8452-bd34-42a2-b51a-2e9f7dcc5b1e',
    title: 'Production Management',
    slug: 'production-management',
    summary: 'Monitor production cycles, downtime, and yield insights in one view.',
    icon: 'factory',
    features: ['Workflow automation', 'Maintenance alerts', 'Operational dashboards'],
    active: true,
  },
  {
    id: '4cf942ed-1af5-4a92-bf66-1b7e24fabd90',
    title: 'Hardware Business',
    slug: 'hardware-business',
    summary: 'Distribution-ready platform for hardware inventory and procurement.',
    icon: 'cpu',
    features: ['Supplier management', 'Warranty tracking', 'Analytics & forecasting'],
    active: true,
  },
  {
    id: '4c6e2c27-49c0-44cb-b881-d919cb0124a1',
    title: 'Mobile Shop Management',
    slug: 'mobile-shop-management',
    summary: 'Point of sale, buyback, and repair workflows in one simplified interface.',
    icon: 'smartphone',
    features: ['IMEI tracking', 'Repair management', 'Bundle promotions'],
    active: true,
  },
  {
    id: 'e9fc36dc-5983-4e61-8265-bc2a27c893fa',
    title: 'Electronics Showroom',
    slug: 'electronics-showroom',
    summary: 'Delightful catalog-first experience with AR/VR-ready modules.',
    icon: 'tv',
    features: ['Product comparison', 'Assisted selling tools', 'Warranty automation'],
    active: true,
  },
  {
    id: '3a6e3b68-9175-4c76-a163-46339ca774b0',
    title: 'Distribution Management',
    slug: 'distribution-management',
    summary: 'Optimize distribution with intelligent routing and demand forecasting.',
    icon: 'truck',
    features: ['Route planning', 'Distributor portal', 'Sales gamification'],
    active: true,
  },
];

export const academySeed: AcademyTrack[] = [
  {
    id: 'c8502826-f7c5-4b77-8584-60c9fb73ef2d',
    title: 'Kids Computing',
    slug: 'kids-computing',
    ageRange: 'Age 8-12',
    duration: '16 weeks',
    priceLabel: '৳8,500',
    levels: [
      {
        name: 'Discover',
        tools: ['Scratch', 'Micro:bit'],
        outcomes: ['Fundamental logic skills', 'Confidence with creative coding'],
      },
      {
        name: 'Build',
        tools: ['Thunkable', 'TinkerCAD'],
        outcomes: ['Prototype hardware projects', 'Story-driven games'],
      },
    ],
    active: true,
  },
  {
    id: '9c8141b2-6539-44b3-9c1f-d9bca6f1e77a',
    title: 'Zero Programing',
    slug: 'zero-programing',
    ageRange: 'Age 13+',
    duration: '20 weeks',
    priceLabel: '৳12,500',
    levels: [
      {
        name: 'No-Code Foundations',
        tools: ['Notion', 'Zapier', 'Bubble'],
        outcomes: ['Ship workflows visually', 'Launch MVPs without code'],
      },
      {
        name: 'Automation Studio',
        tools: ['Make.com', 'Airtable'],
        outcomes: ['Automate business ops', 'Build client-ready templates'],
      },
      {
        name: 'Launchpad',
        tools: ['Webflow', 'Figma'],
        outcomes: ['Design to deploy landing pages', 'Portfolio-ready case studies'],
      },
    ],
    active: true,
  },
  {
    id: '7e8151fe-d683-4580-bf24-0d8257393d3b',
    title: 'Freelanching',
    slug: 'freelanching',
    duration: '12 weeks',
    priceLabel: '৳9,500',
    levels: [
      {
        name: 'Profile Sprint',
        tools: ['Upwork', 'Fiverr', 'Behance'],
        outcomes: ['Story-driven gig positioning', 'Proposal frameworks that convert'],
      },
      {
        name: 'Delivery Excellence',
        tools: ['ClickUp', 'Loom'],
        outcomes: ['Client communication playbook', 'Repeat business strategies'],
      },
    ],
    active: true,
  },
];

export const blogSeed: BlogPost[] = [
  {
    id: 'b0f34359-4f0c-4f1f-86e0-4b232d42928b',
    title: 'How We Blend Services with Learning',
    slug: 'blend-services-with-learning',
    excerpt: 'A behind-the-scenes look at how our delivery squads collaborate with academy mentors.',
    coverUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    content:
      '<p>Our dual-engine model creates a feedback loop between client projects and the academy. We share playbooks, tooling, and retrospectives with our learners so they build market-ready confidence.</p><p>Every sprint uncovers new teaching moments that shape ZeroProgrammingBD curriculum updates.</p>',
    tags: ['Culture', 'Academy'],
    published: true,
    publishedAt: '2025-01-10T09:00:00.000Z',
  },
  {
    id: '7b8fb0dd-7721-4e7b-a5e3-08f6d93e4a4f',
    title: 'Designing Reliable Commerce Experiences',
    slug: 'designing-reliable-commerce-experiences',
    excerpt: 'Discover the blueprints we use to launch commerce platforms that delight shoppers.',
    coverUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    content:
      '<p>From modular UI kits to rigorous QA automation, we ensure ecommerce ecosystems stay performant under scale.</p><p>Our teams blend analytics with CRO experimentation to keep conversion at the center.</p>',
    tags: ['Commerce', 'Product'],
    published: true,
    publishedAt: '2025-02-02T11:30:00.000Z',
  },
  {
    id: 'ec4554a2-22fd-4b4e-bdf6-7bc7566e1fe0',
    title: 'Preparing Learners for Freelancing Wins',
    slug: 'preparing-learners-for-freelancing-wins',
    excerpt: 'How we pair career coaching with portfolio challenges to help learners earn globally.',
    coverUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    content:
      '<p>Freelancing success is more than technical skills. We mentor communication, pricing, and client operations.</p><p>Learners graduate with templates, scripts, and confidence to thrive independently.</p>',
    tags: ['Academy', 'Career'],
    published: true,
    publishedAt: '2025-03-15T14:00:00.000Z',
  },
];

export const leadsSeed: Lead[] = [];

export const settingsSeed: SiteSettings[] = [
  {
    id: '3d3d78a9-df62-44c9-9217-6f25cfcf380b',
    siteTitle: 'ObjectCanvas × ZeroProgrammingBD',
    tagline: 'We build reliable software and empower future-ready talent.',
    heroTitle: 'Innovative Software Solutions for Global Business',
    heroSubtitle:
      'Transforming digital challenges into opportunities with cross-functional teams dedicated to speed, quality, and enablement.',
    primaryCtaLabel: 'Get Started',
    heroImageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80',
    heroImageAlt: 'ObjectCanvas and ZeroProgramming teams collaborating in a modern workspace',
    heroVideoUrl: 'https://cdn.coverr.co/videos/coverr-engineers-collaborating-over-laptops-9050/1080p.mp4',
    heroVideoPoster: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80',
    heroMediaBadge: 'Hybrid studio',
    heroMediaCaption: 'ObjectCanvas squads and ZeroProgrammingBD mentors co-create every launch.',
  },
];
