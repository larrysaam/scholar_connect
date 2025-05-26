
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface AgreementSectionProps {
  agreedToTerms: boolean;
  onInputChange: (field: string, value: boolean) => void;
}

const AgreementSection = ({ agreedToTerms, onInputChange }: AgreementSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-2">
        <Checkbox 
          id="terms" 
          checked={agreedToTerms}
          onCheckedChange={(checked) => onInputChange("agreedToTerms", checked)}
          required 
        />
        <Label htmlFor="terms" className="text-sm">
          I agree to ScholarConnect's Terms of Use and Privacy Policy *
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
      
      <Button type="submit" className="w-full" size="lg">
        Create My Student Account
      </Button>
      
      <p className="text-sm text-gray-600 text-center">
        Once signed up, you'll be taken to a personalized dashboard where you can browse expert support, 
        track progress, and request consultations or mentorship.
      </p>
    </div>
  );
};

export default AgreementSection;
