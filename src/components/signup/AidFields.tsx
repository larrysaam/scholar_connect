
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AidFieldsProps {
  formData: {
    highestEducation: string;
    fieldsOfExpertise: string;
    linkedinAccount: string;
    academiaEduAccount: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const AidFields = ({ formData, onInputChange }: AidFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="highestEducation">Highest Education</Label>
        <Input
          id="highestEducation"
          type="text"
          value={formData.highestEducation}
          onChange={(e) => onInputChange('highestEducation', e.target.value)}
          placeholder="e.g., PhD, Master's, Bachelor's"
        />
      </div>
      <div>
        <Label htmlFor="fieldsOfExpertise">Areas of Expertise</Label>
        <Textarea
          id="fieldsOfExpertise"
          value={formData.fieldsOfExpertise}
          onChange={(e) => onInputChange('fieldsOfExpertise', e.target.value)}
          placeholder="Describe your skills and expertise..."
        />
      </div>
      <div>
        <Label htmlFor="linkedinAccount">LinkedIn Profile</Label>
        <Input
          id="linkedinAccount"
          type="url"
          value={formData.linkedinAccount}
          onChange={(e) => onInputChange('linkedinAccount', e.target.value)}
          placeholder="https://linkedin.com/in/yourprofile"
        />
      </div>
      <div>
        <Label htmlFor="academiaEduAccount">Academia.edu Profile</Label>
        <Input
          id="academiaEduAccount"
          type="url"
          value={formData.academiaEduAccount}
          onChange={(e) => onInputChange('academiaEduAccount', e.target.value)}
          placeholder="https://university.academia.edu/yourprofile"
        />
      </div>
    </div>
  );
};

export default AidFields;
