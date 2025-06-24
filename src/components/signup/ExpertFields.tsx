
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ExpertFieldsProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

const ExpertFields = ({ formData, onInputChange }: ExpertFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="academicRank">Academic Rank *</Label>
          <Select value={formData.academicRank} onValueChange={(value) => onInputChange('academicRank', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select academic rank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Professor">Professor</SelectItem>
              <SelectItem value="Associate Professor">Associate Professor</SelectItem>
              <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
              <SelectItem value="Senior Lecturer">Senior Lecturer</SelectItem>
              <SelectItem value="Lecturer">Lecturer</SelectItem>
              <SelectItem value="Research Fellow">Research Fellow</SelectItem>
              <SelectItem value="Postdoc">Postdoc</SelectItem>
              <SelectItem value="PhD Student">PhD Student</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="highestEducation">Highest Education *</Label>
          <Select value={formData.highestEducation} onValueChange={(value) => onInputChange('highestEducation', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select highest education" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PhD">PhD</SelectItem>
              <SelectItem value="Master's">Master's</SelectItem>
              <SelectItem value="Bachelor's">Bachelor's</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="fieldsOfExpertise">Fields of Expertise *</Label>
        <Textarea
          id="fieldsOfExpertise"
          value={formData.fieldsOfExpertise}
          onChange={(e) => onInputChange('fieldsOfExpertise', e.target.value)}
          placeholder="List your areas of expertise (e.g., Machine Learning, Data Science, etc.)"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div>
          <Label htmlFor="orcidId">ORCID ID</Label>
          <Input
            id="orcidId"
            value={formData.orcidId}
            onChange={(e) => onInputChange('orcidId', e.target.value)}
            placeholder="0000-0000-0000-0000"
          />
        </div>
      </div>
    </div>
  );
};

export default ExpertFields;
