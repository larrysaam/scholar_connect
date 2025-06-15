
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLogoHeader from "@/components/auth/AuthLogoHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

const SignIn = () => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await signIn(formData.email, formData.password);

    if (result.success) {
      toast({ title: "Logged in successfully!" });
      navigate("/dashboard");
    } else {
      toast({ variant: "destructive", title: "Login Failed", description: result.error });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <AuthLogoHeader />
        <div className="bg-white rounded-lg shadow px-8 py-8">
          <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label>Email</Label>
              <Input 
                type="email" 
                value={formData.email}
                onChange={e => handleChange("email", e.target.value)} 
                required 
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input 
                type="password" 
                value={formData.password}
                onChange={e => handleChange("password", e.target.value)} 
                required 
              />
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? <LoadingSpinner size="sm" /> : "Sign In"}
            </Button>
          </form>
          <div className="mt-6">
            <div className="text-center text-sm text-gray-700 mb-2">Join ResearchWhao:</div>
            <div className="flex flex-col space-y-2">
              <Link to="/student-signup" className="text-blue-600 hover:underline">Join as Student</Link>
              <Link to="/expert-signup" className="text-blue-600 hover:underline">Join as Research Expert</Link>
              <Link to="/aide-signup" className="text-blue-600 hover:underline">Join as Research Aide</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
