
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ExpertFieldsProps {
  formData: {
    academicRank: string;
    fieldsOfExpertise: string;
    linkedinAccount: string;
    researchgateAccount: string;
    orcidId: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const ExpertFields = ({ formData, onInputChange }: ExpertFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="academicRank">Academic Rank</Label>
        <Input
          id="academicRank"
          type="text"
          value={formData.academicRank}
          onChange={(e) => onInputChange('academicRank', e.target.value)}
          placeholder="e.g., Professor, Associate Professor, Assistant Professor"
        />
      </div>
      <div>
        <Label htmlFor="fieldsOfExpertise">Fields of Expertise</Label>
        <Textarea
          id="fieldsOfExpertise"
          value={formData.fieldsOfExpertise}
          onChange={(e) => onInputChange('fieldsOfExpertise', e.target.value)}
          placeholder="Describe your areas of expertise..."
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
        <Label htmlFor="researchgateAccount">ResearchGate Profile</Label>
        <Input
          id="researchgateAccount"
          type="url"
          value={formData.researchgateAccount}
          onChange={(e) => onInputChange('researchgateAccount', e.target.value)}
          placeholder="https://researchgate.net/profile/yourprofile"
        />
      </div>
      <div>
        <Label htmlFor="orcidId">ORCID ID</Label>
        <Input
          id="orcidId"
          type="text"
          value={formData.orcidId}
          onChange={(e) => onInputChange('orcidId', e.target.value)}
          placeholder="0000-0000-0000-0000"
        />
      </div>
    </div>
  );
};

export default ExpertFields;
