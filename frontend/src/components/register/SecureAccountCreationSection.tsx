
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Shield, Check, X } from "lucide-react";
import { validatePassword } from "@/utils/security";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SecureAccountCreationSectionProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

const SecureAccountCreationSection = ({ formData, onInputChange }: SecureAccountCreationSectionProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const passwordValidation = validatePassword(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword;

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Account Creation</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input 
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => onInputChange("password", e.target.value)}
                required
                className={!passwordValidation.isValid && formData.password ? "border-red-500" : ""}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {formData.password && (
              <div className="space-y-2 mt-2">
                <div className="text-sm text-gray-600">Password requirements:</div>
                <div className="space-y-1">
                  {[
                    { test: formData.password.length >= 8, text: "At least 8 characters" },
                    { test: /[A-Z]/.test(formData.password), text: "One uppercase letter" },
                    { test: /[a-z]/.test(formData.password), text: "One lowercase letter" },
                    { test: /\d/.test(formData.password), text: "One number" },
                    { test: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password), text: "One special character" }
                  ].map((req, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      {req.test ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <X className="h-3 w-3 text-red-500" />
                      )}
                      <span className={req.test ? "text-green-600" : "text-red-500"}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <div className="relative">
              <Input 
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => onInputChange("confirmPassword", e.target.value)}
                required
                className={formData.confirmPassword && !passwordsMatch ? "border-red-500" : ""}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {formData.confirmPassword && !passwordsMatch && (
              <Alert variant="destructive">
                <AlertDescription>
                  Passwords do not match
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecureAccountCreationSection;
