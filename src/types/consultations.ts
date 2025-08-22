export interface AcademicLevelPrice {
  id?: string;
  academic_level: 'Undergraduate' | 'Masters' | 'PhD' | 'Postdoc';
  price: number;
  currency: string;
}

export interface ServiceAddon {
  id?: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  is_active: boolean;
}

export interface ServiceAvailability {
  id?: string;
  day_of_week: number; // 0 = Sunday, 6 = Saturday
  start_time: string;
  end_time: string;
  timezone: string;
  is_active: boolean;
}

export interface ConsultationService {
  id: string;
  user_id: string;
  category: 'General Consultation' | 'Chapter Review' | 'Full Thesis Cycle Support' | 'Full Thesis Review';
  title: string;
  description: string;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  pricing: AcademicLevelPrice[];
  addons: ServiceAddon[];
  availability: ServiceAvailability[];
  google_meet_link?: string;
}
