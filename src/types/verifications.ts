// Verification document statuses
export type VerificationStatus = 'approved' | 'pending' | 'rejected';

// Single verification document structure
export interface VerificationDocument {
  id: string;
  type: string;
  url: string;
  filename: string;
  uploadedAt: string;
  status: VerificationStatus;
  rejectionReason?: string;
}

// Category of verifications
export interface VerificationCategory {
  name: string;
  label: string;
  description: string;
  required: boolean;
  allowMultiple: boolean;
  maxFiles?: number;
}

// Overall verifications structure
export interface Verifications {
  [key: string]: {
    documents: VerificationDocument[];
    otherDetails?: string;
  };
}

// Verification item configuration
export interface VerificationItem {
  key: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  maxFiles?: number;
  required?: boolean;
}

export const VERIFICATION_CATEGORIES: VerificationCategory[] = [
  {
    name: 'identity',
    label: 'Identity Document',
    description: 'A government-issued ID (passport, national ID, or driver\'s license)',
    required: true,
    allowMultiple: false
  },
  {
    name: 'academic',
    label: 'Academic Credentials',
    description: 'Your highest academic qualification (degree, diploma, or certificate)',
    required: true,
    allowMultiple: true,
    maxFiles: 3
  },
  {
    name: 'professional',
    label: 'Professional Certifications',
    description: 'Any relevant professional certifications or licenses',
    required: false,
    allowMultiple: true,
    maxFiles: 5
  }
];
