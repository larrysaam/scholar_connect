
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface AidFieldsProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

const AidFields = ({ formData, onInputChange }: AidFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <SelectItem value="Diploma">Diploma</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="academicRank">Academic Rank (if applicable)</Label>
          <Select value={formData.academicRank} onValueChange={(value) => onInputChange('academicRank', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select academic rank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">None</SelectItem>
              <SelectItem value="Professor">Professor</SelectItem>
              <SelectItem value="Associate Professor">Associate Professor</SelectItem>
              <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
              <SelectItem value="Senior Lecturer">Senior Lecturer</SelectItem>
              <SelectItem value="Lecturer">Lecturer</SelectItem>
              <SelectItem value="Research Fellow">Research Fellow</SelectItem>
              <SelectItem value="Postdoc">Postdoc</SelectItem>
              <SelectItem value="PhD Student">PhD Student</SelectItem>
              <SelectItem value="Graduate Student">Graduate Student</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="fieldsOfExpertise">Areas of Expertise *</Label>
        <Textarea
          id="fieldsOfExpertise"
          value={formData.fieldsOfExpertise}
          onChange={(e) => onInputChange('fieldsOfExpertise', e.target.value)}
          placeholder="List your areas of expertise (e.g., Data Analysis, Academic Writing, Statistical Analysis, etc.)"
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
          <Label htmlFor="orcidId">ORCID ID (if applicable)</Label>
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

export default AidFields;
