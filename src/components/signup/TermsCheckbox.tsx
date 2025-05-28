
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface TermsCheckboxProps {
  agreedToTerms: boolean;
  onInputChange: (field: string, value: string | boolean) => void;
}

const TermsCheckbox = ({ agreedToTerms, onInputChange }: TermsCheckboxProps) => {
  return (
    <div className="flex items-start space-x-2">
      <Checkbox 
        id="terms" 
        checked={agreedToTerms}
        onCheckedChange={(checked) => onInputChange("agreedToTerms", checked)}
        required 
      />
      <Label htmlFor="terms" className="text-sm">
        I agree to the Terms of Service and Privacy Policy *
      </Label>
    </div>
  );
};

export default TermsCheckbox;
