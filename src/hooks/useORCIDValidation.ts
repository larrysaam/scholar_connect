import { useState, useCallback } from 'react';
import { validateORCIDID, formatORCIDID } from '@/utils/urlValidation';

interface UseORCIDValidationReturn {
  error: string | null;
  isValid: boolean;
  formattedValue: string;
  clearError: () => void;
  handleORCIDChange: (value: string) => string;
}

/**
 * Hook for ORCID ID validation and formatting
 */
export const useORCIDValidation = (value: string): UseORCIDValidationReturn => {
  const [error, setError] = useState<string | null>(null);

  // Validate the ORCID ID
  const validation = validateORCIDID(value);
  const isValid = validation.isValid;

  // Set error if validation fails
  if (!isValid && validation.error && error !== validation.error) {
    setError(validation.error);
  } else if (isValid && error) {
    setError(null);
  }

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Handle ORCID ID changes with formatting
  const handleORCIDChange = useCallback((newValue: string) => {
    // Clear error when user starts typing
    setError(null);
    
    // Remove any non-digit characters except dashes for intermediate input
    const cleanValue = newValue.replace(/[^\d-]/g, '');
    
    // Limit to 19 characters (16 digits + 3 dashes)
    const limitedValue = cleanValue.slice(0, 19);
    
    // Auto-format with dashes as user types
    const digitsOnly = limitedValue.replace(/[-]/g, '');
    
    // Format with dashes if we have enough digits
    if (digitsOnly.length > 4) {
      const formatted = formatORCIDID(digitsOnly);
      return formatted;
    }
    
    return digitsOnly;
  }, []);

  const formattedValue = formatORCIDID(value);

  return {
    error,
    isValid,
    formattedValue,
    clearError,
    handleORCIDChange
  };
};
