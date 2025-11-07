export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string;
  content: string;
  tags: string[];
  isPublished: boolean;
  publishedAt: string;
}
