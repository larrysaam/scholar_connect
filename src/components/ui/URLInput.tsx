import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { validateResearchProfileURL } from '@/utils/urlValidation';

interface URLInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  fieldName: string; // For specific URL validation rules
  className?: string;
}

const URLInput = ({
  id,
  value,
  onChange,
  disabled = false,
  placeholder,
  fieldName,
  className
}: URLInputProps) => {
  const [urlError, setUrlError] = useState<string>('');

  // URL validation effect
  useEffect(() => {
    if (value && value.trim() !== '') {
      const validation = validateResearchProfileURL(fieldName, value);
      setUrlError(validation.isValid ? '' : validation.error || '');
    } else {
      setUrlError('');
    }
  }, [value, fieldName]);

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);
    
    // Clear URL error when user starts typing
    if (urlError) {
      setUrlError('');
    }
  };

  return (
    <div className="space-y-1">
      <Input
        id={id}
        type="url"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={`${urlError ? 'border-red-500 focus-visible:ring-red-500' : ''} ${className || ''}`}
      />
      {urlError && (
        <p className="text-sm text-red-500">{urlError}</p>
      )}
    </div>
  );
};

export default URLInput;
