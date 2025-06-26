
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface TermsCheckboxProps {
  agreedToTerms: boolean;
  onInputChange: (field: string, value: boolean) => void;
}

const TermsCheckbox = ({ agreedToTerms, onInputChange }: TermsCheckboxProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="terms"
        checked={agreedToTerms}
        onCheckedChange={(checked) => onInputChange('agreedToTerms', checked as boolean)}
      />
      <Label htmlFor="terms" className="text-sm">
        I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
      </Label>
    </div>
  );
};

export default TermsCheckbox;
