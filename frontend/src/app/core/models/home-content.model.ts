export interface CtaLink {
  label: string;
  routerLink?: string | any[];
  fragment?: string;
  externalUrl?: string;
  style?: 'primary' | 'secondary' | 'outline';
}

export interface SectionHeaderContent {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export interface ServiceCard {
  title: string;
  icon: string;
  description: string;
  highlights: string[];
  tagline: string;
  featured?: boolean;
}

export interface StatItem {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
}

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  location: string;
  rating: number;
  type: 'client' | 'student';
}

export interface InsightItem {
  title: string;
  category: string;
  summary: string;
  readTime: string;
}

export interface HomeContent {
  hero: {
    badge: string;
    title: string;
    description: string;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
    highlightCard: {
      title: string;
      description: string;
    };
    highlightList: string[];
    video: {
      src: string;
      poster: string;
    };
    featurePanel: {
      eyebrow: string;
      title: string;
      description: string;
      metrics: { label: string; value: string; theme: 'accent' | 'emerald' }[];
      partner: { label: string; description: string };
    };
  };
  trust: {
    tagline: string;
    companies: string[];
    stats: StatItem[];
  };
  services: {
    header: SectionHeaderContent;
    items: ServiceCard[];
  };
  differentiators: {
    header: SectionHeaderContent;
    items: { title: string; description: string }[];
    partnershipPanel: {
      eyebrow: string;
      title: string;
      description: string;
      highlights: { label: string; value: string }[];
    };
  };
  methodology: {
    header: SectionHeaderContent;
    steps: { step: string; detail: string }[];
  };
  caseStudies: {
    header: SectionHeaderContent;
    items: {
      client: string;
      industry: string;
      challenge: string;
      solution: string;
      result: string;
    }[];
  };
  academy: {
    header: SectionHeaderContent;
    categories: string[];
    stats: StatItem[];
    featuredCourses: {
      title: string;
      instructor: string;
      duration: string;
      rating: string;
      price: string;
    }[];
    benefits: string[];
  };
  globalPresence: {
    header: SectionHeaderContent;
    headquarters: {
      title: string;
      location: string;
      address: string;
    };
    marketsServed: string;
    verticals: string;
    map: {
      title: string;
      description: string;
      badge: string;
    };
  };
  testimonials: {
    header: SectionHeaderContent;
    items: Testimonial[];
  };
  impact: {
    header: SectionHeaderContent;
    stats: StatItem[];
  };
  insights: {
    header: SectionHeaderContent;
    items: InsightItem[];
  };
  closingCtas: {
    business: {
      title: string;
      description: string;
      cta: CtaLink;
    };
    academy: {
      title: string;
      description: string;
      cta: CtaLink;
    };
  };
  contact: {
    header: SectionHeaderContent;
    headquarters: string;
    phones: string[];
    emails: { label: string; value: string }[];
    businessHours: string[];
    socials: { label: string; url: string }[];
    consultation: CtaLink;
    profileDownload: { label: string; url: string };
  };
}
