export interface ServiceMedia {
  fileName?: string | null;
  url?: string | null;
}

export interface ServiceItem {
  id: string;
  title: string;
  subtitle?: string | null;
  slug: string;
  summary: string;
  description?: string | null;
  icon?: string | null;
  backgroundImage?: ServiceMedia | null;
  headerVideo?: ServiceMedia | null;
  gallery?: ServiceMedia[];
  features: string[];
  active: boolean;
  featured?: boolean;
}
