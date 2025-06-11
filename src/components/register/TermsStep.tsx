
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { StepProps } from './types';

interface TermsStepProps extends StepProps {
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const TermsStep = ({ formData, isLoading, onPrev, onSubmit, onInputChange }: TermsStepProps) => {
  const handleTermsChange = (checked: boolean) => {
    const event = {
      target: {
        name: 'termsAccepted',
        type: 'checkbox',
        checked: checked
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onInputChange(event);
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={formData.termsAccepted}
          onCheckedChange={(checked) => handleTermsChange(!!checked)}
        />
        <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
          I agree to the <a href="#" className="underline">terms and conditions</a>
        </Label>
      </div>
      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={onPrev} disabled={isLoading}>
          Previous
        </Button>
        <Button onClick={onSubmit} disabled={isLoading || !formData.termsAccepted}>
          {isLoading ? "Loading..." : "Register"}
        </Button>
      </div>
    </>
  );
};

export default TermsStep;
