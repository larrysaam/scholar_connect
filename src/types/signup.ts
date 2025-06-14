
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

export type UserRole = 'student' | 'expert' | 'aid' | 'admin';

export interface BaseFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

export interface StudentSignupData extends BaseFormData {
  institution?: string;
  faculty?: string;
  studyLevel?: string;
  researchAreas?: string[];
  topicTitle?: string;
  researchStage?: string;
  country?: string;
  dateOfBirth?: string;
  sex?: string;
}

export interface ExpertSignupData extends BaseFormData {
  organization?: string;
  experience?: string;
  expertise?: string[];
  otherExpertise?: string;
  languages?: string[];
  linkedInUrl?: string;
  country?: string;
  dateOfBirth?: string;
  sex?: string;
}

export interface ResearchAidSignupData extends BaseFormData {
  organization?: string;
  experience?: string;
  expertise: string[];
  otherExpertise: string;
  languages: string[];
  linkedInUrl?: string;
  country: string;
  dateOfBirth: string;
  sex: string;
}

export interface FormFieldProps {
  formData: any;
  onInputChange: (field: string, value: string | boolean) => void;
}
