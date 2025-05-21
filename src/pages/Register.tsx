
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Register = () => {
  const [accountType, setAccountType] = useState("student");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate registration process
    setTimeout(() => {
      console.log("Registering as:", accountType);
      setIsLoading(false);
      // In a real app, would redirect to dashboard or verification page
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
            Create an account
          </h2>
          <p className="mt-2 text-gray-600">
            Join our platform to connect with researchers
          </p>
        </div>

        <div className="bg-white p-8 shadow rounded-lg">
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="institution">Institution SSO</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email">
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>I am a:</Label>
                    <RadioGroup 
                      defaultValue="student" 
                      className="flex space-x-4 mt-2"
                      onValueChange={setAccountType}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="student" id="student" />
                        <Label htmlFor="student" className="cursor-pointer">Student</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="researcher" id="researcher" />
                        <Label htmlFor="researcher" className="cursor-pointer">Researcher</Label>
                      </div>
                    </RadioGroup>
                  </div>
                
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="name@example.com" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required />
                    <p className="text-xs text-gray-500">
                      Must be at least 8 characters with at least 1 number and 1 special character.
                    </p>
                  </div>
                  
                  {accountType === "researcher" && (
                    <div className="space-y-2">
                      <Label htmlFor="institution">Institution</Label>
                      <Input id="institution" placeholder="e.g., Stanford University" required />
                    </div>
                  )}
                </div>
                
                <div className="flex items-start">
                  <Checkbox id="terms" required />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    I agree to the <Link to="/terms" className="text-blue-600 hover:text-blue-500">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 hover:text-blue-500">Privacy Policy</Link>
                  </label>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
                
                <div className="text-center text-sm">
                  <span className="text-gray-600">Already have an account? </span>
                  <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                    Sign in
                  </Link>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="institution">
              <div className="space-y-6">
                <p className="text-sm text-gray-600">
                  Select your institution to sign up with your institutional credentials.
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
                  <span className="text-gray-600">Already have an account? </span>
                  <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                    Sign in
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

export default Register;
