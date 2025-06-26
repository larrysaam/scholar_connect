
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

export interface StudentSignupData {
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

export interface ExpertSignupData {
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

export interface ResearchAidSignupData {
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

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone_number?: string;
  country?: string;
  university_institution?: string;
  field_of_study?: string;
  level_of_study?: string;
  sex?: 'male' | 'female';
  date_of_birth?: string;
  research_topic?: string;
  research_stage?: string;
  academic_rank?: string;
  highest_education?: string;
  linkedin_account?: string;
  researchgate_account?: string;
  academia_edu_account?: string;
  orcid_id?: string;
  preferred_language?: string;
  fields_of_expertise?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FormFieldProps {
  formData: BaseFormData | any;
  onInputChange: (field: string, value: string | boolean) => void;
}
