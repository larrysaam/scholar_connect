
export type UserRole = 'student' | 'expert' | 'aid' | 'admin';

export interface BaseFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  agreedToTerms: boolean;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  country: string;
  institution: string;
  organization: string;
  position: string;
  fieldOfStudy: string;
  levelOfStudy: string;
  researchTopic: string;
  dateOfBirth: string;
  sex: string;
  academicRank: string;
  highestEducation: string;
  fieldsOfExpertise: string;
  linkedinAccount: string;
  researchgateAccount: string;
  academiaEduAccount: string;
  orcidId: string;
  preferredLanguage: string;
  agreedToTerms: boolean;
}
