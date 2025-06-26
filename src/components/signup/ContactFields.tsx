
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ContactFieldsProps {
  formData: {
    phone: string;
    country: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const ContactFields = ({ formData, onInputChange }: ContactFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => onInputChange('phone', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          type="text"
          value={formData.country}
          onChange={(e) => onInputChange('country', e.target.value)}
        />
      </div>
    </div>
  );
};

export default ContactFields;
