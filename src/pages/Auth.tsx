
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/LoadingSpinner";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Get user profile to determine role and redirect appropriately
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role === 'expert') {
          navigate("/researcher-dashboard");
        } else if (profile?.role === 'aid') {
          navigate("/research-aids-dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email.toLowerCase().trim(),
        password: loginData.password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.message,
        });
        return;
      }

      if (data.user) {
        // Get user profile to determine role
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single();

        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });

        // Redirect based on role
        if (profile?.role === 'expert') {
          navigate("/researcher-dashboard");
        } else if (profile?.role === 'aid') {
          navigate("/research-aids-dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
  };

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
            Welcome back
          </h2>
          <p className="mt-2 text-gray-600">
            Sign in to access your account
          </p>
        </div>

        <div className="bg-white p-8 shadow rounded-lg">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input 
                id="login-email" 
                type="email" 
                placeholder="name@example.com"
                value={loginData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input 
                id="login-password" 
                type="password"
                value={loginData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="text-center text-sm text-gray-600">
              Don't have an account? Choose your role:
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate("/register")}
              >
                Sign up as Student
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate("/research-aide-signup")}
              >
                Sign up as Researcher
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate("/research-aid-signup")}
              >
                Sign up as Research Aid
              </Button>
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

export default Auth;
