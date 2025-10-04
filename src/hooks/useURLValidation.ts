import { useState, useEffect } from 'react';
import { validateResearchProfileURL } from '@/utils/urlValidation';

export const useURLValidation = (value: string, fieldName: string) => {
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (value && value.trim() !== '') {
      const validation = validateResearchProfileURL(fieldName, value);
      setError(validation.isValid ? '' : validation.error || '');
    } else {
      setError('');
    }
  }, [value, fieldName]);

  const clearError = () => setError('');

  return { error, clearError };
};
