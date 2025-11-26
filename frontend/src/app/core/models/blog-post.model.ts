export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnailFileName?: string | null;
  thumbnailUrl?: string | null;
  headerVideo?: { fileName: string | null; url: string | null } | null;
  headerVideoUrl?: string | null;
  coverUrl?: string;
  heroQuote?: string;
  keyPoints?: string[];
  stats?: { label: string; value: string }[];
  author?: string;
  authorTitle?: string;
  readTime?: string;
  tags: string[];
  published: boolean;
  publishedAt?: string;
  createdDate?: string;
  updatedDate?: string | null;
}
