
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
  fieldOfStudy?: string;
  levelOfStudy?: string;
  researchTopic?: string;
  country?: string;
  dateOfBirth?: string;
  sex?: string;
}

export interface ExpertSignupData extends BaseFormData {
  organization?: string;
  academicRank?: string;
  highestEducation?: string;
  fieldsOfExpertise?: string;
  linkedinAccount?: string;
  researchgateAccount?: string;
  academiaEduAccount?: string;
  orcidId?: string;
  country?: string;
  dateOfBirth?: string;
  sex?: string;
}

export interface FormFieldProps {
  formData: any;
  onInputChange: (field: string, value: string | boolean) => void;
}
