
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { validateResearchProfileURL } from '@/utils/urlValidation';

interface FormFieldProps {
  label: string;
  required?: boolean;
  type?: 'text' | 'email' | 'tel' | 'date' | 'password' | 'select' | 'url';
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
    onChange(inputValue);
    
    // Clear URL error when user starts typing
    if (urlError) {
      setUrlError('');
    }
  };
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
      ) : (
        <div className="space-y-1">
          <Input
            id={fieldId}
            type={type === 'url' ? 'url' : type}
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className={urlError ? 'border-red-500 focus-visible:ring-red-500' : ''}
          />
          {urlError && (
            <p className="text-sm text-red-500">{urlError}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FormField;
