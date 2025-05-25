
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

interface TermsCheckboxProps {
  formData: any;
  onInputChange: (field: string, value: boolean) => void;
}

const TermsCheckbox = ({ formData, onInputChange }: TermsCheckboxProps) => {
  return (
    <div className="flex items-start">
      <Checkbox 
        id="terms" 
        checked={formData.agreedToTerms}
        onCheckedChange={(checked) => onInputChange("agreedToTerms", checked as boolean)}
        required 
      />
      <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
        I agree to the <Link to="/terms" className="text-blue-600 hover:text-blue-500">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 hover:text-blue-500">Privacy Policy</Link>
      </label>
    </div>
  );
};

export default TermsCheckbox;
