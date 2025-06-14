
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Shield, AlertTriangle } from "lucide-react";

const SecureAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, user, loading } = useAuth();
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn(loginData.email, loginData.password);
    
    if (result.success) {
      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: result.error || "An unexpected error occurred."
      });
    }

    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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

        <div className="bg-white p-8 shadow rounded-lg">
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com"
                value={loginData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password"
                value={loginData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

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
