
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import LoadingSpinner from "@/components/LoadingSpinner";

interface AgreementSectionProps {
  agreedToTerms: boolean;
  onInputChange: (field: string, value: string | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const AgreementSection = ({ agreedToTerms, onInputChange, onSubmit, isLoading }: AgreementSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">Agreement</h3>
      
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
      
      <Button 
        type="submit" 
        className="w-full" 
        size="lg" 
        disabled={isLoading || !agreedToTerms}
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Creating Account...
          </>
        ) : (
          "Create My Student Account"
        )}
      </Button>
      
      <p className="text-sm text-gray-600 text-center">
        Upon clicking, you'll receive email confirmation and be taken to your dashboard.
      </p>
    </div>
  );
};

export default AgreementSection;
