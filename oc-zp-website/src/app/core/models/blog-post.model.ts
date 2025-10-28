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
}
