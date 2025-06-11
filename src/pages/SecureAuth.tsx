
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import SecureForm from "@/components/security/SecureForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Shield, AlertTriangle } from "lucide-react";

const SecureAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { enhancedSignIn, user, loading, isRateLimited, getRemainingTime } = useEnhancedAuth();
  const [email, setEmail] = useState("");

  // Check if user is already logged in and redirect based on role
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      if (user && !loading) {
        // Get user profile to determine role
        const { supabase } = await import("@/integrations/supabase/client");
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        // Redirect based on role
        if (profile?.role === 'expert') {
          navigate("/researcher-dashboard");
        } else if (profile?.role === 'aid') {
          navigate("/research-aids-dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    };

    checkAuthAndRedirect();
  }, [user, loading, navigate]);

  const handleSignIn = async (data: Record<string, string>, csrfToken: string) => {
    console.log('CSRF Token received:', csrfToken);
    setEmail(data.email);
    
    const result = await enhancedSignIn(data.email, data.password);
    
    if (result.success) {
      toast({
        title: "Welcome back!",
        description: "Successfully logged in with enhanced security.",
      });
      // Redirect will be handled by useEffect above
    } else {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: result.error,
      });
    }
    
    return result;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const signInFields = [
    {
      name: 'email',
      label: 'Email Address',
      type: 'email' as const,
      required: true
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password' as const,
      required: true
    }
  ];

  const isCurrentlyRateLimited = email && isRateLimited('login', email);
  const remainingTime = email ? getRemainingTime('login', email) : 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <img 
              src="/lovable-uploads/a2f6a2f6-b795-4e93-914c-2b58648099ff.png" 
              alt="ResearchWhao" 
              className="w-8 h-8"
            />
            <span className="text-2xl font-bold text-blue-600">ResearchWhao</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-gray-600">
            Sign in to access your account
          </p>
        </div>

        {/* Enhanced security features indicator */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-800">
            <Shield className="h-5 w-5" />
            <span className="font-medium">Enhanced Security Features</span>
          </div>
          <ul className="mt-2 text-sm text-blue-700 space-y-1">
            <li>• Advanced threat detection</li>
            <li>• Real-time security monitoring</li>
            <li>• Intelligent rate limiting</li>
            <li>• Session integrity validation</li>
            <li>• Comprehensive audit logging</li>
          </ul>
        </div>

        {/* Enhanced rate limiting warning */}
        {isCurrentlyRateLimited && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Too many login attempts detected. Please wait {Math.ceil(remainingTime / 60000)} minutes before trying again.
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-white p-8 shadow rounded-lg">
          <SecureForm
            onSubmit={handleSignIn}
            fields={signInFields}
            submitLabel={isCurrentlyRateLimited ? "Rate Limited" : "Sign In Securely"}
          />

          <div className="mt-6 space-y-4">
            <div className="text-center text-sm text-gray-600">
              Don't have an account? Choose your role:
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <Link 
                to="/register"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-center text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Sign up as Student
              </Link>
              <Link 
                to="/research-aide-signup"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-center text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Sign up as Researcher
              </Link>
              <Link 
                to="/research-aid-signup"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-center text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Sign up as Research Aid
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SecureAuth;
