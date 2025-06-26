
import { useState } from 'react';
import { validateFileType, validateFileSize } from '@/utils/security';

export interface ValidationError {
  field: string;
  message: string;
}

export const useSecurityValidation = () => {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const validateFormData = (formData: { email?: string; password?: string; }): boolean => {
    const errors: ValidationError[] = [];

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }

    if (formData.password && formData.password.length < 8) {
      errors.push({ field: 'password', message: 'Password must be at least 8 characters long' });
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const validateFileUpload = async (file: File): Promise<boolean> => {
    const errors: ValidationError[] = [];

    if (!validateFileType(file)) {
      errors.push({ field: 'file', message: 'File type not allowed. Please upload JPG, PNG, or PDF files only.' });
    }

    if (!validateFileSize(file, 10)) {
      errors.push({ field: 'file', message: 'File size must be less than 10MB.' });
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const clearValidationErrors = () => {
    setValidationErrors([]);
  };

  return {
    validateFormData,
    validateFileUpload,
    validationErrors,
    clearValidationErrors
  };
};
