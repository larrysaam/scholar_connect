
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { validateResearchProfileURL } from '@/utils/urlValidation';
import { useORCIDValidation } from '@/hooks/useORCIDValidation';

interface FormFieldProps {
  label: string;
  required?: boolean;
  type?: 'text' | 'email' | 'tel' | 'date' | 'password' | 'select' | 'url' | 'orcid';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options?: { value: string; label: string }[] | string[];
  showOtherOption?: boolean;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
  validateURL?: boolean; // New prop to enable URL validation
  fieldName?: string; // For specific URL validation rules
}

const FormField = ({
  label,
  required = false,
  type = 'text',
  value,
  onChange,
  placeholder,
  options,
  showOtherOption = false,
  otherValue = '',
  onOtherChange,
  validateURL = false,
  fieldName
}: FormFieldProps) => {
  const fieldId = label.toLowerCase().replace(/\s+/g, '-');
  const [urlError, setUrlError] = useState<string>('');
  
  // ORCID validation
  const { error: orcidError, handleORCIDChange, clearError: clearORCIDError } = useORCIDValidation(value);

  // URL validation effect
  useEffect(() => {
    if (validateURL && value && fieldName) {
      const validation = validateResearchProfileURL(fieldName, value);
      setUrlError(validation.isValid ? '' : validation.error || '');
    } else {
      setUrlError('');
    }
  }, [value, validateURL, fieldName]);

  const handleInputChange = (inputValue: string) => {
    if (type === 'orcid') {
      const formattedValue = handleORCIDChange(inputValue);
      onChange(formattedValue);
    } else {
      onChange(inputValue);
    }
    
    // Clear URL error when user starts typing
    if (urlError) {
      setUrlError('');
    }
  };

  const handleFocus = () => {
    if (type === 'orcid') {
      clearORCIDError();
    }
  };

  // Determine the current error to display
  const currentError = type === 'orcid' ? orcidError : urlError;
  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      {type === 'select' && options ? (
        <div className="space-y-2">
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => {
                const optionValue = typeof option === 'string' ? option : option.value;
                const optionLabel = typeof option === 'string' ? option : option.label;
                return (
                  <SelectItem key={optionValue} value={optionValue}>
                    {optionLabel}
                  </SelectItem>
                );
              })}
              {showOtherOption && (
                <SelectItem value="other">Other</SelectItem>
              )}
            </SelectContent>
          </Select>
          
          {showOtherOption && value === 'other' && (
            <Input
              type="text"
              placeholder={`Specify ${label.toLowerCase()}`}
              value={otherValue}
              onChange={(e) => onOtherChange?.(e.target.value)}
            />
          )}
        </div>
      ) : (        <div className="space-y-1">
          <Input
            id={fieldId}
            type={type === 'url' ? 'url' : type === 'orcid' ? 'text' : type}
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleFocus}
            placeholder={placeholder || (type === 'orcid' ? '0000-0000-0000-0000' : undefined)}
            required={required}
            maxLength={type === 'orcid' ? 19 : undefined} // 16 digits + 3 dashes
            className={currentError ? 'border-red-500 focus-visible:ring-red-500' : ''}
          />
          {currentError && (
            <p className="text-sm text-red-500">{currentError}</p>
          )}
          {type === 'orcid' && (
            <p className="text-xs text-gray-500">
              Enter 16 digits (dashes will be added automatically)
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FormField;
