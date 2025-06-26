
import { useState, useCallback } from 'react';
import { sanitizeInput, validateEmail, validatePassword } from '@/utils/security';
import { supabase } from '@/integrations/supabase/client';

interface ValidationError {
  field: string;
  message: string;
}

export const useSecurityValidation = () => {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const validateFileUpload = useCallback(async (file: File): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('validate_file_upload', {
        file_name: file.name,
        file_size: file.size,
        content_type: file.type
      });

      if (error) {
        setValidationErrors([{ field: 'file', message: error.message }]);
        return false;
      }

      return true;
    } catch (error) {
      setValidationErrors([{ field: 'file', message: 'File validation failed' }]);
      return false;
    }
  }, []);

  const validateFormData = useCallback((formData: Record<string, any>): boolean => {
    const errors: ValidationError[] = [];

    Object.entries(formData).forEach(([field, value]) => {
      if (typeof value === 'string') {
        const sanitized = sanitizeInput(value);
        if (sanitized !== value) {
          errors.push({ field, message: 'Invalid characters detected' });
        }

        if (field === 'email' && value && !validateEmail(value)) {
          errors.push({ field, message: 'Invalid email format' });
        }

        if (field === 'password' && value) {
          const passwordValidation = validatePassword(value);
          if (!passwordValidation.isValid) {
            errors.push({ field, message: passwordValidation.errors[0] });
          }
        }
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  }, []);

  const clearValidationErrors = useCallback(() => {
    setValidationErrors([]);
  }, []);

  return {
    validationErrors,
    validateFileUpload,
    validateFormData,
    clearValidationErrors
  };
};
