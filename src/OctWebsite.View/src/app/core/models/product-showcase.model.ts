export interface ProductShowcaseItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  imageFileName?: string | null;
  backgroundColor: string;
  projectScreenshotUrl: string;
  projectScreenshotFileName?: string | null;
  highlights: string[];
}
