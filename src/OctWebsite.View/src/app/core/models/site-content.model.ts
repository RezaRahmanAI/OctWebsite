import { CtaLink } from './home-content.model';

export interface NavLink {
  label: string;
  path: string | string[];
  exact?: boolean;
}

export interface DropdownItem {
  title: string;
  href: string | string[];
  summary?: string;
}

export interface MethodologyLink {
  label: string;
  slug: string;
  summary: string;
}

export interface NavigationContent {
  brand: {
    name: string;
    tagline?: string;
    logo: string;
    link: string | string[];
  };
  primaryLinks: NavLink[];
  aboutMenu: DropdownItem[];
  collaborationMenu: MethodologyLink[];
  technologies: string[];
  hiringLinks: { label: string; href?: string | string[] }[];
  productMenu: DropdownItem[];
}

export interface FooterContentSection {
  title: string;
  links: CtaLink[];
}

export interface FooterContent {
  brand: {
    name: string;
    partner: string;
    logo: string;
    description: string;
    consultationCta: CtaLink;
  };
  sections: FooterContentSection[];
  socialLinks: CtaLink[];
  legalLinks: CtaLink[];
  profileDownload?: CtaLink;
}
