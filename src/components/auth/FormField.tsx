
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormFieldProps {
  label: string;
  required?: boolean;
  type?: 'text' | 'email' | 'tel' | 'date' | 'password' | 'select';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options?: { value: string; label: string }[] | string[];
  showOtherOption?: boolean;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
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
  onOtherChange
}: FormFieldProps) => {
  const fieldId = label.toLowerCase().replace(/\s+/g, '-');

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
        <Input
          id={fieldId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
};

export default FormField;
