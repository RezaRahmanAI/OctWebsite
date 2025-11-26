export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverUrl?: string;
  content: string;
  tags: string[];
  published: boolean;
  publishedAt?: string;
  author?: string;
  authorTitle?: string;
  readTime?: string;
  heroQuote?: string;
  keyPoints?: string[];
  stats?: { label: string; value: string }[];
}
