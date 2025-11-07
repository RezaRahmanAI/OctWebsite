import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outputDir = join(__dirname, '../../backend/src/OctWebsite.Infrastructure/Data/PageContentDefaults');
mkdirSync(outputDir, { recursive: true });

const homeContent = {
  hero: {
    badge: 'Premium Multinational Technology Partner',
    title: 'Where Technology Meets Excellence',
    description:
      'Empowering businesses worldwide with cutting-edge software, marketing, and digital experiences—while transforming careers through expert-led technology education.',
    primaryCta: {
      label: 'Start Your Project',
      routerLink: '/contact'
    },
    secondaryCta: {
      label: 'Explore Academy',
      routerLink: '/academy'
    },
    highlightCard: {
      title: 'From Bangladesh to the World 🇧🇩',
      description:
        'Trusted by founders, enterprises, and governments across Asia, Europe, North America, the Middle East, and Australia.'
    },
    highlightList: [
      'Tailored enterprise technology for global impact',
      'Dedicated project teams aligned with your timezone',
      'Live instructor-led courses with industry experts'
    ],
    video: {
      src: '/video/hero.mp4',
      poster: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1600&q=80'
    },
    featurePanel: {
      eyebrow: 'Global Delivery Model',
      title: 'Fortune 500 quality with local insight',
      description:
        'Dedicated project squads, design strategists, cloud architects, and certified instructors aligned to your timezone with daily progress rituals.',
      metrics: [
        { label: 'Timezone aligned', value: 'Asia · EU · NA', theme: 'accent' },
        { label: 'Delivery Velocity', value: '2x faster GTM', theme: 'emerald' }
      ],
      partner: {
        label: 'Trusted technology & academy partner',
        description:
          'Align business outcomes with skill transformation—our Academy trains your teams to own and scale the solutions we deliver.'
      }
    }
  },
  trust: {
    tagline: 'Trusted by teams at',
    companies: ['Anthropic', 'Stripe', 'Vercel', 'Linear'],
    stats: [
      { label: 'Projects Delivered', value: 500, suffix: '+' },
      { label: 'Countries Served', value: 50, suffix: '+' },
      { label: 'Students Trained', value: 10, suffix: 'K+' },
      { label: 'Years Combined Experience', value: 15, suffix: '+' }
    ]
  },
  services: {
    header: {
      eyebrow: 'Solutions',
      title: 'Comprehensive Technology Solutions',
      subtitle: 'Strategy, delivery, and enablement crafted for ambitious brands and fast-scaling ventures.',
      align: 'center'
    },
    items: [
      {
        title: 'Digital Marketing',
        icon: '🎯',
        description: 'Grow your global visibility with performance-driven campaigns and storytelling that resonates.',
        highlights: [
          'SEO & multi-language content strategy',
          'Full-funnel paid media management',
          'Brand development & identity systems',
          'Data-driven analytics and conversion optimization'
        ],
        tagline: 'Grow Your Digital Presence Globally'
      },
      {
        title: 'Software Development',
        icon: '💻',
        description: 'Build resilient platforms across web, mobile, and cloud with modern engineering practices.',
        highlights: [
          'Custom enterprise applications',
          'Mobile experiences for iOS and Android',
          'API integrations & automation',
          'Cloud architecture, DevOps & observability'
        ],
        tagline: 'Building Scalable Solutions'
      },
      {
        title: 'Website Building',
        icon: '🌐',
        description: 'Design pixel-perfect digital homes that translate your brand into immersive customer journeys.',
        highlights: [
          'Responsive corporate and e-commerce sites',
          'Conversion-optimized landing pages',
          'WordPress & headless CMS implementations',
          'Continuous support and performance tuning'
        ],
        tagline: 'Your Digital Home, Perfected'
      },
      {
        title: 'Hum Academy',
        icon: '🎓',
        description: 'Future-ready tech education with live cohorts, real-world projects, and mentorship from industry leaders.',
        highlights: [
          'Live interactive bootcamps and micro-courses',
          'Industry-recognized certificates',
          'Career coaching & placement support',
          'Hands-on projects reviewed by senior engineers'
        ],
        tagline: 'Learn From the Best, Become the Best',
        featured: true
      }
    ]
  },
  differentiators: {
    header: {
      eyebrow: 'Why Hum Tech & Academy',
      title: 'Why Leading Companies Choose Us',
      subtitle:
        'End-to-end partnership, measurable outcomes, and a commitment to the teams who rely on our solutions every day.'
    },
    items: [
      {
        title: 'Global Standards, Local Expertise',
        description:
          'International delivery quality with a deep understanding of Bangladesh and emerging markets to localize impact.'
      },
      {
        title: 'Proven Track Record',
        description: '500+ successful projects across fintech, retail, telco, and startups spanning 50+ countries.'
      },
      {
        title: 'End-to-End Solutions',
        description: 'Strategy, execution, maintenance, and training handled by dedicated cross-functional teams.'
      },
      {
        title: 'Transparent Communication',
        description: 'Real-time reporting, dedicated PMs, and communication aligned to your timezone and toolstack.'
      },
      {
        title: 'Certified Professionals',
        description: 'Engineers and marketers certified by AWS, Google, Microsoft, Meta, and HubSpot.'
      },
      {
        title: 'Beyond Delivery',
        description: 'We empower your team with upskilling and internal enablement through Hum Academy programs.'
      }
    ],
    partnershipPanel: {
      eyebrow: 'Partnership DNA',
      title: 'Strategy, build, enablement and continuous optimization—one integrated team.',
      description:
        'We embed with your teams, align KPIs, and share knowledge through Hum Academy so you stay in control long after launch.',
      highlights: [
        { label: 'Dedicated PMO', value: 'Weekly sprints & dashboards' },
        { label: 'Academy Enablement', value: 'Workshops & certifications' }
      ]
    }
  },
  methodology: {
    header: {
      eyebrow: 'Our Methodology',
      title: 'How We Work',
      subtitle: 'A proven framework that keeps delivery transparent, collaborative, and fast.',
      align: 'center'
    },
    steps: [
      { step: 'Discover', detail: 'Deep dive workshops to understand objectives, users, and success metrics.' },
      { step: 'Design', detail: 'Collaborative prototyping, technical architecture, and experience design.' },
      { step: 'Develop', detail: 'Agile delivery with continuous integration, QA automation, and security reviews.' },
      { step: 'Deploy', detail: 'Cloud-native deployment, observability setup, and go-live orchestration.' },
      { step: 'Support', detail: '24/7 monitoring, optimization sprints, and on-demand training for your teams.' }
    ]
  },
  caseStudies: {
    header: {
      eyebrow: 'Success Stories',
      title: 'Success Stories That Inspire',
      subtitle: 'Experience the measurable outcomes we deliver for Bangladesh and international brands.',
      align: 'center'
    },
    items: [
      {
        client: 'Aarong Global',
        industry: 'Retail & E-commerce',
        challenge: 'Low conversion rates and fragmented customer journeys.',
        solution: 'Full-stack replatforming, UX revamp, and omnichannel marketing automation.',
        result: '250% increase in online revenue within 6 months.'
      },
      {
        client: 'NovaCare Health',
        industry: 'Healthcare',
        challenge: 'Legacy systems limiting patient experience across regions.',
        solution: 'HIPAA-compliant patient portal with mobile apps and AI triage assistant.',
        result: 'Customer satisfaction jumped to 4.9/5 and support tickets reduced by 63%.'
      },
      {
        client: 'Velocity Fintech',
        industry: 'Financial Services',
        challenge: 'Needed a scalable API layer to expand into new markets quickly.',
        solution: 'Microservices architecture with automated compliance checks and observability.',
        result: 'Launch speed improved by 3x across 5 new countries.'
      }
    ]
  },
  academy: {
    header: {
      eyebrow: 'Hum Academy',
      title: 'Hum Academy: Learn Technology, Build Careers',
      subtitle: 'Live online courses taught by industry experts. From beginner to professional.'
    },
    categories: [
      'Web Development',
      'Digital Marketing',
      'Software Engineering',
      'Mobile Development',
      'Data Science & AI',
      'UI/UX Design'
    ],
    stats: [
      { label: 'Students Enrolled', value: 10, suffix: 'K+' },
      { label: 'Course Completion Rate', value: 95, suffix: '%', decimals: undefined },
      { label: 'Average Rating', value: 4.9, suffix: '/5', decimals: 1 },
      { label: 'Courses Available', value: 80, suffix: '+' }
    ],
    featuredCourses: [
      {
        title: 'Full-Stack Web Development with Angular & Node.js',
        instructor: 'Sadia Rahman (Ex-Google)',
        duration: '12 weeks · Live · Capstone Project',
        rating: '4.9/5 (320 reviews)',
        price: 'BDT 18,500 | $165'
      },
      {
        title: 'Performance Marketing Accelerator',
        instructor: 'Tahmid Hasan (Meta Certified)',
        duration: '8 weeks · Live Campaign Clinics',
        rating: '4.8/5 (210 reviews)',
        price: 'BDT 14,000 | $125'
      },
      {
        title: 'Cloud & DevOps Engineer Program',
        instructor: 'Farzana Chowdhury (AWS Community Builder)',
        duration: '10 weeks · Labs & Certifications',
        rating: '4.9/5 (185 reviews)',
        price: 'BDT 22,000 | $195'
      }
    ],
    benefits: [
      'Live interactive sessions (not pre-recorded)',
      'Industry expert instructors',
      'Lifetime access to resources',
      'Job placement support & mentorship'
    ]
  },
  globalPresence: {
    header: {
      eyebrow: 'Global Presence',
      title: 'From Dhaka to the World',
      subtitle:
        'Proudly Bangladeshi, globally connected—delivering excellence across continents with the agility of local teams.'
    },
    headquarters: {
      title: 'Headquarters',
      location: '📍 Dhaka, Bangladesh',
      address: 'Innovation Avenue, Tejgaon, Dhaka 1207'
    },
    marketsServed: 'Asia · Europe · North America · Middle East · Australia',
    verticals: 'Fintech · Retail · Healthcare · SaaS · Public Sector · Education',
    map: {
      title: 'Global Delivery Map',
      description:
        'Animated map placeholder — highlight major hubs in Dhaka, Singapore, Dubai, London, Toronto, Sydney.',
      badge: 'Cloud-first. Remote-native. 24/7 support.'
    }
  },
  testimonials: {
    header: {
      eyebrow: 'Testimonials',
      title: 'What Our Clients & Students Say',
      subtitle:
        'Real outcomes, global voices. Explore how partnerships and learning experiences reshape careers and companies.',
      align: 'center'
    },
    items: [
      {
        quote:
          'Hum Tech transformed our digital presence and unified our customer journey across markets. Their strategy and execution rival the best global agencies.',
        name: 'Arif Khan',
        title: 'Chief Digital Officer, Aarong Global',
        location: 'Dhaka & Dubai',
        rating: 5,
        type: 'client'
      },
      {
        quote:
          'The engineering team delivered a robust fintech platform ahead of schedule. Their communication cadence and technical depth were outstanding.',
        name: 'Sophia Patel',
        title: 'VP Product, Velocity Fintech',
        location: 'Singapore',
        rating: 5,
        type: 'client'
      },
      {
        quote:
          'Hum Academy’s DevOps bootcamp helped me transition from support engineer to cloud engineer in under six months with real mentorship.',
        name: 'Mahim Islam',
        title: 'Cloud Engineer, Sydney',
        location: 'Sydney, Australia',
        rating: 5,
        type: 'student'
      },
      {
        quote:
          'Practical, hands-on sessions with industry leaders. The marketing accelerator gave me the confidence and portfolio to land international clients.',
        name: 'Faria Noor',
        title: 'Performance Marketer',
        location: 'Toronto, Canada',
        rating: 5,
        type: 'student'
      }
    ]
  },
  impact: {
    header: {
      eyebrow: 'Numbers That Matter',
      title: 'Impact in Every Engagement',
      subtitle: 'Metrics that capture our commitment to excellence, support, and continuous learning.',
      align: 'center'
    },
    stats: [
      { label: 'Projects Delivered', value: 500, suffix: '+' },
      { label: 'Countries Served', value: 50, suffix: '+' },
      { label: 'Students Trained', value: 10, suffix: 'K+' },
      { label: 'Years Combined Experience', value: 15, suffix: '+' }
    ]
  },
  insights: {
    header: {
      eyebrow: 'Latest Insights',
      title: 'Tech Insights & Learning Resources',
      subtitle: 'Deep dives, playbooks, and tutorials from our engineering, marketing, and academy teams.',
      align: 'center'
    },
    items: [
      {
        title: 'Designing Omni-Channel Experiences for Emerging Markets',
        category: 'Case Study',
        summary: 'How Hum Tech reimagined retail experiences with localized content and automation.',
        readTime: '7 min read'
      },
      {
        title: 'Scaling Engineering Teams with Academy-led Upskilling',
        category: 'Academy',
        summary: 'Building engineering excellence through custom training journeys and mentorship.',
        readTime: '5 min read'
      },
      {
        title: 'The Playbook for High-Converting SaaS Websites',
        category: 'Insights',
        summary: 'UI/UX strategies and experimentation frameworks that deliver measurable growth.',
        readTime: '8 min read'
      }
    ]
  },
  closingCtas: {
    business: {
      title: 'Ready to Transform Your Business?',
      description: 'Collaborate with our strategists and engineers to design your next breakthrough.',
      cta: {
        label: 'Start Your Project',
        routerLink: '/contact'
      }
    },
    academy: {
      title: 'Ready to Advance Your Career?',
      description: 'Enroll in Hum Academy programs to upgrade your skills with mentorship from industry practitioners.',
      cta: {
        label: 'Browse Courses',
        routerLink: '/academy'
      }
    }
  },
  contact: {
    header: {
      eyebrow: 'Contact',
      title: "Let's Build Something Amazing Together",
      subtitle: 'Tell us about your goals and we will curate a dedicated team for you.'
    },
    headquarters: 'Hum Tech & Academy, 123 Innovation Avenue, Tejgaon, Dhaka 1207',
    phones: ['Bangladesh: +880 1234-567890', 'International: +1 415-555-0198'],
    emails: [
      { label: 'Business', value: 'hello@humtech.academy' },
      { label: 'Academy', value: 'courses@humtech.academy' },
      { label: 'Support', value: 'support@humtech.academy' }
    ],
    businessHours: ['Sun-Thu: 9:00 AM - 6:00 PM (GMT+6)', 'Fri-Sat: Closed'],
    socials: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/company/humtechacademy' },
      { label: 'Facebook', url: 'https://www.facebook.com/humtechacademy' },
      { label: 'Twitter', url: 'https://twitter.com/humtechacademy' },
      { label: 'Instagram', url: 'https://www.instagram.com/humtechacademy' },
      { label: 'YouTube', url: 'https://www.youtube.com/@humtechacademy' },
      { label: 'GitHub', url: 'https://github.com/humtechacademy' }
    ],
    consultation: {
      label: 'Schedule a Free Consultation',
      routerLink: '/contact',
      fragment: 'consultation'
    },
    profileDownload: {
      label: 'Download Company Profile (PDF)',
      url: 'https://www.humtech.academy/assets/company-profile.pdf'
    }
  }
};

const servicesPage = {
  header: {
    eyebrow: 'Services',
    title: 'Integrated Services for Ambitious Teams',
    subtitle: 'Technology, marketing, and learning experiences designed to help you scale globally.'
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
        'Brand strategy, messaging, and creative production'
      ],
      outcomes: [
        '3x average uplift in qualified leads',
        '40% improvement in multi-touch attribution accuracy',
        'Consistent brand voice across all regions'
      ]
    },
    {
      name: 'Software & Product Engineering',
      description:
        'Modern engineering teams delivering resilient products across cloud, mobile, and enterprise ecosystems.',
      deliverables: [
        'Product discovery, UX research, and service design',
        'Full-stack development with Angular, React, Node.js, Python, Go',
        'Mobile apps (Flutter, Swift, Kotlin, React Native)',
        'DevOps, CI/CD, observability, and managed cloud'
      ],
      outcomes: [
        'Accelerated launches with agile delivery and automation',
        'Battle-tested architecture prepared for scale and compliance',
        'Knowledge transfer to internal teams via Hum Academy enablement'
      ]
    },
    {
      name: 'Experience Design & Websites',
      description:
        'Strategic design systems, conversion-first experiences, and high-performing websites for global audiences.',
      deliverables: [
        'Customer journey mapping and UX/UI design systems',
        'Corporate websites, landing pages, and e-commerce experiences',
        'Headless CMS and Jamstack implementations',
        'Accessibility, localization, and performance optimization'
      ],
      outcomes: [
        'Higher conversion rates with optimized user flows',
        'Design systems that scale across products and regions',
        'A/B testing frameworks and analytics dashboards'
      ]
    }
  ]
};

const academyPage = {
  header: {
    eyebrow: 'Academy',
    title: 'Live Cohort-Based Learning Programs',
    subtitle: 'Outcome-driven tracks designed with industry mentors and real project experience.'
  },
  tracks: [
    {
      title: 'Engineering & Cloud',
      description: 'Live cohort-based programs for frontend, backend, DevOps, and cloud-native architecture.',
      modules: [
        'Angular, React, and Next.js production bootcamps',
        'Microservices with Node.js, NestJS, and Python',
        'DevOps pipelines with GitHub Actions, Docker, Kubernetes',
        'AWS, Azure, and GCP certification readiness'
      ],
      outcomes: ['Portfolio-ready projects', 'Certification support', '1:1 mentorship and code reviews']
    },
    {
      title: 'Digital Marketing & Product Growth',
      description: 'Performance-driven programs that blend storytelling with analytics and automation.',
      modules: [
        'Growth marketing strategy and experimentation',
        'SEO, content operations, and localization',
        'Paid media mastery with real campaign labs',
        'Analytics, attribution, and CRO frameworks'
      ],
      outcomes: ['Campaign playbooks', 'Live client simulations', 'Career coaching & placement support']
    },
    {
      title: 'Design & Product Leadership',
      description: 'Human-centered design programs for product designers, researchers, and product managers.',
      modules: [
        'Design thinking and research practices',
        'Design systems and component libraries',
        'Product strategy, roadmapping, and OKRs',
        'Leadership communication and stakeholder management'
      ],
      outcomes: ['Industry portfolio critiques', 'Executive mentorship circles', 'Access to job network partners']
    }
  ]
};

const portfolioPage = {
  header: {
    eyebrow: 'Portfolio',
    title: 'Selected Partnerships & Case Studies',
    subtitle: 'Experience the business outcomes we unlock for leading brands and public sector teams.'
  },
  work: [
    {
      title: 'Retail Reimagined with Aarong Global',
      client: 'Aarong Global',
      region: 'Dhaka · Dubai',
      summary:
        'Unified e-commerce platform, localized content operations, and omnichannel analytics delivering 250% revenue growth.',
      tags: ['E-commerce', 'UX/UI', 'SEO', 'Marketing Automation']
    },
    {
      title: 'Velocity Fintech Developer Platform',
      client: 'Velocity Fintech',
      region: 'Singapore · London',
      summary:
        'API marketplace, developer portal, and compliance automation enabling expansion into five new markets in under 12 months.',
      tags: ['Fintech', 'APIs', 'Microservices', 'DevOps']
    },
    {
      title: 'Healthtech Telemedicine Experience',
      client: 'NovaCare Health',
      region: 'Sydney · Kuala Lumpur',
      summary:
        'HIPAA-compliant telehealth apps with AI triage, improving patient satisfaction to 4.9/5 and reducing support tickets by 63%.',
      tags: ['Healthcare', 'Mobile Apps', 'AI Assistant', 'Compliance']
    },
    {
      title: 'Government Digital Services in Bangladesh',
      client: 'GovTech Bangladesh',
      region: 'Dhaka',
      summary:
        'Citizen-first portal with multilingual support, accessibility, and data dashboards serving 12M monthly visits.',
      tags: ['Public Sector', 'Accessibility', 'Localization', 'Data Visualization']
    }
  ]
};

const aboutPage = {
  header: {
    eyebrow: 'About',
    title: 'Human-centered innovation from Bangladesh to the world',
    subtitle:
      'ObjectCanvas Studios and ZeroProgrammingBD Academy partner to ship resilient products while upskilling future talent.'
  },
  intro:
    'Our multidisciplinary team blends product strategists, engineers, data scientists, digital marketers, and educators. We believe the best partnerships combine delivery excellence with capability building, which is why Hum Academy is woven into every engagement.',
  values: [
    {
      title: 'Human First Innovation',
      description: 'We design technology that augments human potential, embracing accessibility, inclusion, and empathy.'
    },
    {
      title: 'Craftsmanship & Accountability',
      description: 'Every sprint, deliverable, and training cohort is measured against the outcomes we commit to.'
    },
    {
      title: 'Global Mindset, Local Impact',
      description: 'We bring international expertise while nurturing Bangladesh’s tech ecosystem and talent pipeline.'
    }
  ],
  leadership: {
    title: 'Leadership & Culture',
    description:
      'Our leadership team brings experience from Google, Microsoft, Meta, and leading Bangladeshi enterprises. We cultivate a culture where curiosity, inclusive collaboration, and continuous learning are rewarded.',
    highlights: [
      '100+ specialists across engineering, design, marketing, and education',
      'Hybrid teams operating from Dhaka, Singapore, Dubai, London, and Toronto',
      'Community programs mentoring 500+ emerging technologists annually'
    ],
    cta: {
      label: "Explore Careers – We're Hiring",
      routerLink: '/about',
      fragment: 'careers'
    }
  }
};

const insightsPage = {
  header: {
    eyebrow: 'Insights',
    title: 'Perspectives from our build and learn teams',
    subtitle: 'Explore case studies, technical deep dives, and playbooks for scaling teams and technology.'
  },
  entries: [
    {
      title: 'Building Global Platforms from Bangladesh',
      category: 'Thought Leadership',
      excerpt:
        'How distributed squads, lean experimentation, and academy enablement power our multinational partnerships.',
      readTime: '8 min read'
    },
    {
      title: 'Designing Inclusive Digital Services',
      category: 'Experience Design',
      excerpt:
        'Practical accessibility, localization, and performance strategies for public sector portals and citizen services.',
      readTime: '6 min read'
    },
    {
      title: 'Upskilling Product Teams with Hum Academy',
      category: 'Learning',
      excerpt: 'Playbooks for aligning training roadmaps with product delivery to reduce onboarding time and talent gaps.',
      readTime: '5 min read'
    }
  ]
};

const contactPage = {
  header: {
    eyebrow: 'Contact',
    title: 'Partner with Hum Tech & Academy',
    subtitle: 'Share your goals and we will prepare a tailored action plan, timeline, and resourcing model.'
  },
  consultationOptions: 'Schedule a discovery call, request a proposal, or invite us to an RFP.',
  regionalSupport: 'Dhaka · Singapore · Dubai · London · Toronto',
  emails: ['hello@humtech.academy', 'courses@humtech.academy', 'support@humtech.academy'],
  formOptions: ['Digital Marketing', 'Software Development', 'Website Building', 'Hum Academy Programs', 'General Inquiry'],
  ndaLabel: 'I would like to sign an NDA prior to sharing sensitive information.',
  responseTime: 'We respond within 24 business hours. For urgent queries, call +880 1234-567890.'
};

const sitemapPage = {
  links: [
    { label: 'Home', url: '/' },
    { label: 'Services', url: '/services' },
    { label: 'Academy', url: '/academy' },
    { label: 'Portfolio', url: '/portfolio' },
    { label: 'About', url: '/about' },
    { label: 'Contact', url: '/contact' },
    { label: 'Insights', url: '/insights' },
    { label: 'Privacy Policy', url: '/legal/privacy' },
    { label: 'Terms of Service', url: '/legal/terms' },
    { label: 'Refund Policy', url: '/legal/refund' }
  ]
};

const navigation = {
  links: [
    { label: 'Services', path: '/services' },
    { label: 'Academy', path: '/academy' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Dashboard', path: '/dashboard' }
  ]
};

const footerContent = {
  socialLinks: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/company/humtechacademy' },
    { label: 'Facebook', url: 'https://www.facebook.com/humtechacademy' },
    { label: 'Twitter', url: 'https://twitter.com/humtechacademy' },
    { label: 'Instagram', url: 'https://www.instagram.com/humtechacademy' },
    { label: 'YouTube', url: 'https://www.youtube.com/@humtechacademy' },
    { label: 'GitHub', url: 'https://github.com/humtechacademy' }
  ]
};

const pages = new Map([
  ['home', homeContent],
  ['services', servicesPage],
  ['academy', academyPage],
  ['portfolio', portfolioPage],
  ['about', aboutPage],
  ['insights', insightsPage],
  ['contact', contactPage],
  ['sitemap', sitemapPage],
  ['navigation', navigation],
  ['footer', footerContent]
]);

for (const [key, value] of pages) {
  writeFileSync(join(outputDir, `${key}.json`), JSON.stringify(value, null, 2));
}

console.log('Exported page content defaults to', outputDir);
