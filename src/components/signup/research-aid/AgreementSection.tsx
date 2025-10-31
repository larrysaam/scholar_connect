
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
      <h3 className="text-lg font-semibold border-b pb-2">Verification and Agreement</h3>
      
      <div className="flex items-start space-x-2">
        <Checkbox 
          id="terms" 
          checked={agreedToTerms}
          onCheckedChange={(checked) => onInputChange("agreedToTerms", checked)}
          required 
        />
        <Label htmlFor="terms" className="text-sm">
          I agree to the Terms & privacy and understand that ResearchTandem does not guarantee work but provides a visibility platform. *
        </Label>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <Checkbox id="captcha" required />
          <Label htmlFor="captcha" className="text-sm">
            I'm not a robot (CAPTCHA) *
          </Label>
        </div>
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
          "Create My Research Aid Profile"
        )}
      </Button>
      
      <p className="text-sm text-gray-600 text-center">
        Upon clicking, you'll receive email confirmation and be taken to a dashboard to complete your profile or begin receiving job requests.
      </p>
    </div>
  );
};

export default AgreementSection;
