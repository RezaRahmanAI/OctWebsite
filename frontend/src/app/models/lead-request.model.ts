export interface LeadRequest {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
}
