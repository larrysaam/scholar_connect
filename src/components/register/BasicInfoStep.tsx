
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StepProps } from './types';

const BasicInfoStep = ({ formData, onInputChange, isLoading, onNext }: StepProps) => {
  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={onInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" name="email" value={formData.email} onChange={onInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" name="password" value={formData.password} onChange={onInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={onInputChange} required />
        </div>
      </div>
      <Button onClick={onNext} disabled={isLoading} className="mt-4">
        {isLoading ? "Loading..." : "Next"}
      </Button>
    </>
  );
};

export default BasicInfoStep;
