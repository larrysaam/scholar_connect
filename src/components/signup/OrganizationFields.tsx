
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface OrganizationFieldsProps {
  formData: {
    institution: string;
    organization: string;
    fieldOfStudy: string;
    levelOfStudy: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const OrganizationFields = ({ formData, onInputChange }: OrganizationFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="institution">Institution/University</Label>
        <Input
          id="institution"
          type="text"
          value={formData.institution}
          onChange={(e) => onInputChange('institution', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="organization">Organization</Label>
        <Input
          id="organization"
          type="text"
          value={formData.organization}
          onChange={(e) => onInputChange('organization', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="fieldOfStudy">Field of Study</Label>
        <Input
          id="fieldOfStudy"
          type="text"
          value={formData.fieldOfStudy}
          onChange={(e) => onInputChange('fieldOfStudy', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="levelOfStudy">Level of Study</Label>
        <Input
          id="levelOfStudy"
          type="text"
          value={formData.levelOfStudy}
          onChange={(e) => onInputChange('levelOfStudy', e.target.value)}
        />
      </div>
    </div>
  );
};

export default OrganizationFields;
