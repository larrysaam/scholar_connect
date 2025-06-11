
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StepProps } from './types';

const InstitutionInfoStep = ({ formData, onInputChange, onSelectChange, isLoading, onNext, onPrev }: StepProps) => {
  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="accountType">Account Type</Label>
          <Select value={formData.accountType} onValueChange={(value) => onSelectChange('accountType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
              <SelectItem value="aid">Research Aid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input type="text" id="country" name="country" value={formData.country} onChange={onInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="institution">Institution</Label>
          <Input type="text" id="institution" name="institution" value={formData.institution} onChange={onInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="faculty">Faculty</Label>
          <Input type="text" id="faculty" name="faculty" value={formData.faculty} onChange={onInputChange} required />
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={onPrev} disabled={isLoading}>
          Previous
        </Button>
        <Button onClick={onNext} disabled={isLoading}>
          {isLoading ? "Loading..." : "Next"}
        </Button>
      </div>
    </>
  );
};

export default InstitutionInfoStep;
