export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photoFileName?: string;
  photoUrl?: string;
  bio?: string;
  email?: string;
  active: boolean;
}
