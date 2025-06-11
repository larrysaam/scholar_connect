
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormField {
  name: string;
  label: string;
  type: 'email' | 'password' | 'text';
  required?: boolean;
}

interface SecureFormProps {
  onSubmit: (data: Record<string, string>, csrfToken: string) => Promise<{ success: boolean; error?: string }>;
  fields: FormField[];
  submitLabel: string;
}

const SecureForm: React.FC<SecureFormProps> = ({ onSubmit, fields, submitLabel }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate a simple CSRF token
  const generateCSRFToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const csrfToken = generateCSRFToken();
      const result = await onSubmit(formData, csrfToken);
      
      if (!result.success && result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isDisabled = submitLabel.includes('Rate Limited') || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}
      
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Input
            id={field.name}
            name={field.name}
            type={field.type}
            required={field.required}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            disabled={isDisabled}
            className="w-full"
          />
        </div>
      ))}
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isDisabled}
      >
        {isSubmitting ? 'Processing...' : submitLabel}
      </Button>
    </form>
  );
};

export default SecureForm;
