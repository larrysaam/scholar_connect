
export interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountType: 'student' | 'expert' | 'aid';
  country: string;
  institution: string;
  faculty: string;
  researchAreas: string[];
  topicTitle: string;
  researchStage: string;
  studyLevel: string;
  sex: string;
  phoneNumber: string;
  dateOfBirth: string;
  languages: string[];
  termsAccepted: boolean;
}

export interface StepProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onMultiSelectChange: (name: string, values: string[]) => void;
  isLoading: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  onSubmit?: (e: React.FormEvent) => void;
}
