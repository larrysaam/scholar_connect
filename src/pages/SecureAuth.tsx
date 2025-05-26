
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import SecureForm from "@/components/security/SecureForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Shield, AlertTriangle } from "lucide-react";

const SecureAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, user, loading, isRateLimited } = useSecureAuth();
  const [isSignUp, setIsSignUp] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleSignIn = async (data: Record<string, string>, csrfToken: string) => {
    console.log('CSRF Token received:', csrfToken);
    
    const result = await signIn(data.email, data.password);
    
    if (result.success) {
      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      });
      navigate("/dashboard");
    }
    
    return result;
  };

  const handleSignUp = async (data: Record<string, string>, csrfToken: string) => {
    console.log('CSRF Token received:', csrfToken);
    
    if (data.password !== data.confirmPassword) {
      return {
        success: false,
        error: "Passwords do not match"
      };
    }
    
    const result = await signUp(data.email, data.password, {
      fullName: data.fullName,
      role: 'student'
    });
    
    if (result.success) {
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
      setIsSignUp(false);
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

  const signUpFields = [
    {
      name: 'fullName',
      label: 'Full Name',
      type: 'text' as const,
      required: true,
      validation: (value: string) => {
        if (value.length < 2) {
          return { isValid: false, error: 'Name must be at least 2 characters' };
        }
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          return { isValid: false, error: 'Name must contain only letters and spaces' };
        }
        return { isValid: true };
      }
    },
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
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password' as const,
      required: true
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <img 
              src="/lovable-uploads/a2f6a2f6-b795-4e93-914c-2b58648099ff.png" 
              alt="ScholarConnect" 
              className="w-8 h-8"
            />
            <span className="text-2xl font-bold text-blue-600">ScholarConnect</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-2 text-gray-600">
            {isSignUp ? "Join our secure platform" : "Sign in to access your account"}
          </p>
        </div>

        {/* Security features indicator */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-800">
            <Shield className="h-5 w-5" />
            <span className="font-medium">Enhanced Security Features</span>
          </div>
          <ul className="mt-2 text-sm text-blue-700 space-y-1">
            <li>• End-to-end encryption</li>
            <li>• Advanced input validation</li>
            <li>• Rate limiting protection</li>
            <li>• CSRF protection</li>
          </ul>
        </div>

        {/* Rate limiting warning */}
        {isRateLimited && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Too many attempts detected. Please wait before trying again.
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-white p-8 shadow rounded-lg">
          {isSignUp ? (
            <SecureForm
              onSubmit={handleSignUp}
              fields={signUpFields}
              submitLabel="Create Account"
            />
          ) : (
            <SecureForm
              onSubmit={handleSignIn}
              fields={signInFields}
              submitLabel="Sign In"
            />
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              {isSignUp 
                ? "Already have an account? Sign in" 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>

          {!isSignUp && (
            <div className="mt-4 text-center">
              <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-gray-900">
                Forgot your password?
              </Link>
            </div>
          )}
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
