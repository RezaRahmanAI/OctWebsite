export interface ProductItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  icon?: string;
  features: string[];
  active: boolean;
}
