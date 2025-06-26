
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PasswordFieldsProps {
  formData: {
    password: string;
    confirmPassword: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const PasswordFields = ({ formData, onInputChange }: PasswordFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="password">Password *</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => onInputChange('password', e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm Password *</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => onInputChange('confirmPassword', e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default PasswordFields;
