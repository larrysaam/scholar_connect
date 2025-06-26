
import { useState } from 'react';

interface ValidationError {
  field: string;
  message: string;
}

export const useSecurityValidation = () => {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const validateFormData = (formData: { email?: string; password?: string }) => {
    const errors: ValidationError[] = [];

    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.push({ field: 'email', message: 'Please enter a valid email address' });
      }
    }

    if (formData.password) {
      if (formData.password.length < 6) {
        errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const clearValidationErrors = () => {
    setValidationErrors([]);
  };

  return {
    validateFormData,
    validationErrors,
    clearValidationErrors
  };
};
