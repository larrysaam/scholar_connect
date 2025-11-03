
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AccountCreationSectionProps {
  formData: {
    password: string;
    confirmPassword: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const AccountCreationSection = ({ formData, onInputChange }: AccountCreationSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">Create Your Account</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="password">Password *</Label>
          <Input 
            id="password" 
            type="password"
            value={formData.password}
            onChange={(e) => onInputChange("password", e.target.value)}
            required 
          />
          <p className="text-xs text-gray-500 mt-1">With strength meter</p>
        </div>
        
        <div>
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <Input 
            id="confirmPassword" 
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => onInputChange("confirmPassword", e.target.value)}
            required 
          />
          <p className="text-xs text-gray-500 mt-1">Must match</p>
        </div>
      </div>
    </div>
  );
};

export default AccountCreationSection;
