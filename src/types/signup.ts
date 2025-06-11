
// Comprehensive TypeScript types for signup forms

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
  institution: string;
  faculty: string;
  studyLevel: 'undergraduate' | 'masters' | 'phd' | 'postdoc';
  researchAreas: string[];
  topicTitle: string;
  researchStage: string;
  country: string;
  dateOfBirth: string;
  sex: 'male' | 'female';
}

export interface ExpertSignupData extends BaseFormData {
  organization: string;
  position: string;
  experience: string;
  expertise: string[];
  otherExpertise: string;
  bio: string;
  linkedInUrl: string;
  languages: string[];
  country: string;
  dateOfBirth: string;
  sex: 'male' | 'female';
}

export interface ResearchAidSignupData extends BaseFormData {
  organization: string;
  position: string;
  experience: string;
  expertise: string[];
  otherExpertise: string;
  bio: string;
  linkedInUrl: string;
  languages: string[];
  country: string;
  cvFile: File | null;
  certificationFile: File | null;
  dateOfBirth: string;
  sex: 'male' | 'female';
}

export interface SignupFormProps {
  formData: any;
  onInputChange: (field: string, value: string | boolean | string[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  userType: 'student' | 'expert' | 'aid';
}

export interface FormFieldProps {
  formData: any;
  onInputChange: (field: string, value: string | boolean) => void;
}

// Database enum types for consistency
export type UserRole = 'student' | 'expert' | 'aid' | 'admin';
export type SexType = 'male' | 'female';
export type StudyLevel = 'undergraduate' | 'masters' | 'phd' | 'postdoc';
export type PayoutMethod = 'mobile_money' | 'bank_transfer' | 'paypal';

// User profile interface matching database schema
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone_number?: string;
  country?: string;
  institution?: string;
  faculty?: string;
  sex?: SexType;
  study_level?: StudyLevel;
  preferred_payout_method?: PayoutMethod;
  expertise?: string[];
  languages?: string[];
  experience?: string;
  linkedin_url?: string;
  other_expertise?: string;
  research_areas?: string[];
  topic_title?: string;
  research_stage?: string;
  wallet_balance?: number;
  created_at?: string;
  updated_at?: string;
}

// Form validation rules
export interface ValidationRules {
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
}

export interface FieldValidation {
  [key: string]: ValidationRules;
}
