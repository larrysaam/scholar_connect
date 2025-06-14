
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'expert' | 'aid' | 'admin';
  phone_number?: string;
  country?: string;
  institution?: string;
  faculty?: string;
  study_level?: string;
  research_areas?: string[];
  topic_title?: string;
  research_stage?: string;
  linkedin_url?: string;
  experience?: string;
  expertise?: string[];
  languages?: string[];
  created_at?: string;
  updated_at?: string;
}
