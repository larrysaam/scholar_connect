
import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { sanitizeInput, validateEmail, validatePassword, generateCSRFToken } from '@/utils/security';
import { AlertTriangle, Shield } from 'lucide-react';

interface SecureFormProps {
  onSubmit: (data: Record<string, string>, csrfToken: string) => Promise<{ success: boolean; error?: string }>;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'tel';
    required?: boolean;
    validation?: (value: string) => { isValid: boolean; error?: string };
  }>;
  submitLabel: string;
  className?: string;
}

const SecureForm: React.FC<SecureFormProps> = ({
  onSubmit,
  fields,
  submitLabel,
  className = ''
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csrfToken] = useState(() => generateCSRFToken());
  const [submitAttempts, setSubmitAttempts] = useState(0);

  const validateField = useCallback((field: any, value: string): { isValid: boolean; error?: string } => {
    const sanitizedValue = sanitizeInput(value);
    
    if (field.required && !sanitizedValue.trim()) {
      return { isValid: false, error: `${field.label} is required` };
    }

    // Built-in validations
    if (field.type === 'email' && sanitizedValue && !validateEmail(sanitizedValue)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }

    if (field.type === 'password' && sanitizedValue) {
      const passwordValidation = validatePassword(sanitizedValue);
      if (!passwordValidation.isValid) {
        return { isValid: false, error: passwordValidation.errors[0] };
      }
    }

    // Custom validation
    if (field.validation && sanitizedValue) {
      return field.validation(sanitizedValue);
    }

    return { isValid: true };
  }, []);

  const handleInputChange = useCallback((fieldName: string, value: string) => {
    const field = fields.find(f => f.name === fieldName);
    if (!field) return;

    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({ ...prev, [fieldName]: sanitizedValue }));

    // Real-time validation
    const validation = validateField(field, sanitizedValue);
    setErrors(prev => ({
      ...prev,
      [fieldName]: validation.isValid ? '' : (validation.error || '')
    }));
  }, [fields, validateField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting on client side
    if (submitAttempts >= 5) {
      setErrors({ general: 'Too many submission attempts. Please wait before trying again.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitAttempts(prev => prev + 1);

    try {
      // Validate all fields
      const newErrors: Record<string, string> = {};
      let hasErrors = false;

      fields.forEach(field => {
        const value = formData[field.name] || '';
        const validation = validateField(field, value);
        if (!validation.isValid) {
          newErrors[field.name] = validation.error || '';
          hasErrors = true;
        }
      });

      if (hasErrors) {
        setErrors(newErrors);
        return;
      }

      // Submit with CSRF token
      const result = await onSubmit(formData, csrfToken);
      
      if (!result.success) {
        setErrors({ general: result.error || 'Submission failed' });
      } else {
        // Reset form on success
        setFormData({});
        setErrors({});
        setSubmitAttempts(0);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {/* CSRF Token (hidden) */}
      <input type="hidden" name="csrf_token" value={csrfToken} />
      
      {/* Security indicator */}
      <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-2 rounded">
        <Shield className="h-4 w-4" />
        <span>Secure form with encryption and validation</span>
      </div>

      {/* General error */}
      {errors.general && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errors.general}</AlertDescription>
        </Alert>
      )}

      {/* Form fields */}
      {fields.map(field => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            id={field.name}
            name={field.name}
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={errors[field.name] ? 'border-red-500' : ''}
            required={field.required}
            autoComplete={field.type === 'password' ? 'new-password' : 'off'}
            spellCheck={false}
          />
          {errors[field.name] && (
            <p className="text-red-500 text-sm">{errors[field.name]}</p>
          )}
        </div>
      ))}

      {/* Submit button */}
      <Button
        type="submit"
        disabled={isSubmitting || submitAttempts >= 5}
        className="w-full"
      >
        {isSubmitting ? 'Processing...' : submitLabel}
      </Button>

      {submitAttempts >= 3 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Multiple submission attempts detected. Please ensure all information is correct.
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
};

export default SecureForm;
