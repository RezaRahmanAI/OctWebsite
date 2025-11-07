export interface AcademyTrack {
  id: string;
  title: string;
  slug: string;
  ageRange?: string;
  duration?: string;
  levels: {
    name: string;
    tools: string[];
    outcomes: string[];
  }[];
  priceLabel?: string;
  active: boolean;
}
