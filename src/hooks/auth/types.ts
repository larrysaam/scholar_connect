
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'expert' | 'aid' | 'admin';
  phone_number?: string;
  country?: string;
  university_institution?: string;
  field_of_study?: string;
  level_of_study?: string;
  research_topic?: string;
  academic_rank?: string;
  highest_education?: string;
  fields_of_expertise?: string;
  linkedin_account?: string;
  researchgate_account?: string;
  academia_edu_account?: string;
  orcid_id?: string;
  preferred_language?: string;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}
