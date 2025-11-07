export interface AcademyTrackLevel {
  name: string;
  tools: string[];
  outcomes: string[];
}

export interface AcademyTrack {
  id: string;
  name: string;
  slug: string;
  audience?: string | null;
  duration: string;
  investment: string;
  levels: AcademyTrackLevel[];
  isActive: boolean;
}
