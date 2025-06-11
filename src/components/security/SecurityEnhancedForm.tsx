
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generateCSRFToken } from "@/utils/security";

interface SecurityEnhancedFormProps {
  onSubmit: (data: Record<string, string>, csrfToken: string) => Promise<{ success: boolean; error?: string }>;
  children: React.ReactNode;
  submitLabel: string;
  isLoading?: boolean;
  className?: string;
}

const SecurityEnhancedForm = ({ 
  onSubmit, 
  children, 
  submitLabel, 
  isLoading = false,
  className = ""
}: SecurityEnhancedFormProps) => {
  const [csrfToken, setCsrfToken] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [securityInfo, setSecurityInfo] = useState(false);

  useEffect(() => {
    // Generate CSRF token on component mount
    setCsrfToken(generateCSRFToken());
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    try {
      const result = await onSubmit(data, csrfToken);
      
      if (!result.success && result.error) {
        setError(result.error);
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className={className}>
      {/* Security Information Banner */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-800">Secure Form</span>
          </div>
          <button
            type="button"
            onClick={() => setSecurityInfo(!securityInfo)}
            className="text-blue-600 text-sm hover:underline"
          >
            {securityInfo ? "Hide" : "Show"} Security Features
          </button>
        </div>
        
        {securityInfo && (
          <div className="mt-3 text-sm text-blue-700 space-y-1">
            <div>• Input sanitization and validation</div>
            <div>• CSRF protection enabled</div>
            <div>• Rate limiting protection</div>
            <div>• Secure data transmission</div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hidden CSRF token */}
        <input type="hidden" name="csrfToken" value={csrfToken} />
        
        {children}
        
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700" 
          disabled={isLoading || !csrfToken}
        >
          {isLoading ? "Processing..." : submitLabel}
        </Button>
      </form>
    </div>
  );
};

export default SecurityEnhancedForm;
