
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      console.log("Logging in with:", email);
      setIsLoading(false);
      // In a real app, would redirect to dashboard or previous page
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            ResearchConnect
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-gray-600">
            Sign in to access your account
          </p>
        </div>

        <div className="bg-white p-8 shadow rounded-lg">
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="institution">Institution SSO</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex items-center">
                  <Checkbox id="remember" />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                    Remember me for 30 days
                  </label>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
                
                <div className="text-center text-sm">
                  <span className="text-gray-600">Don't have an account? </span>
                  <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                    Sign up
                  </Link>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="institution">
              <div className="space-y-6">
                <p className="text-sm text-gray-600">
                  Select your institution to sign in with your institutional credentials.
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <select 
                    id="institution"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="" disabled selected>Select your institution</option>
                    <option value="stanford">Stanford University</option>
                    <option value="mit">Massachusetts Institute of Technology</option>
                    <option value="harvard">Harvard University</option>
                    <option value="berkeley">UC Berkeley</option>
                    <option value="other">Other (specify)</option>
                  </select>
                </div>
                
                <Button className="w-full">
                  Continue with Institution
                </Button>
                
                <div className="text-center text-sm">
                  <span className="text-gray-600">Don't have an account? </span>
                  <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                    Sign up
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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

export default Login;
