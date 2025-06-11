
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BasicInfoFields from "@/components/signup/BasicInfoFields";
import ContactFields from "@/components/signup/ContactFields";
import OrganizationFields from "@/components/signup/OrganizationFields";
import BioField from "@/components/signup/BioField";
import ExperienceField from "@/components/signup/ExperienceField";
import TermsCheckbox from "@/components/signup/TermsCheckbox";
import SignupFooter from "@/components/signup/SignupFooter";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { validatePassword } from "@/utils/security";

const ResearchAideSignup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, isRateLimited } = useSecureAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    organization: "",
    position: "",
    bio: "",
    experience: "",
    agreedToTerms: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password strength
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      toast({
        variant: "destructive",
        title: "Password Requirements",
        description: passwordValidation.errors[0]
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "Passwords do not match. Please check and try again."
      });
      return;
    }

    if (!formData.agreedToTerms) {
      toast({
        variant: "destructive",
        title: "Terms Required",
        description: "Please agree to the terms and conditions to continue."
      });
      return;
    }

    if (isRateLimited) {
      toast({
        variant: "destructive",
        title: "Too Many Attempts",
        description: "Please wait before trying again."
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting to sign up researcher with role: expert');
      
      const result = await signUp(formData.email, formData.password, {
        fullName: `${formData.firstName} ${formData.lastName}`,
        role: 'expert'
      });

      if (result.success) {
        toast({
          title: "Registration Successful!",
          description: "Please check your email to verify your account, then sign in to access your dashboard."
        });
        
        navigate("/auth");
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: result.error || "An unexpected error occurred. Please try again."
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex flex-col items-center mb-6">
                  <Link to="/" className="inline-flex items-center space-x-2 mb-4">
                    <img 
                      src="/lovable-uploads/a2f6a2f6-b795-4e93-914c-2b58648099ff.png" 
                      alt="ResearchWhao" 
                      className="w-8 h-8"
                    />
                    <span className="text-2xl font-bold text-blue-600">ResearchWhao</span>
                  </Link>
                  <CardTitle className="text-2xl text-center font-bold">
                    Join ResearchWhao as a Researcher
                  </CardTitle>
                  <p className="text-gray-600 text-center">
                    Connect with students and share your expertise to advance research across Africa.
                  </p>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
                    <BasicInfoFields
                      formData={formData}
                      onInputChange={handleInputChange}
                    />
                    <ContactFields
                      formData={formData}
                      onInputChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Professional Information</h3>
                    <OrganizationFields
                      formData={formData}
                      onInputChange={handleInputChange}
                    />
                    <BioField
                      formData={formData}
                      onInputChange={handleInputChange}
                    />
                    <ExperienceField
                      formData={formData}
                      onInputChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Account Security</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">Password *</label>
                        <input 
                          type="password"
                          id="password"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password *</label>
                        <input 
                          type="password"
                          id="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <TermsCheckbox
                      agreedToTerms={formData.agreedToTerms}
                      onInputChange={handleInputChange}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg" 
                      disabled={isLoading || !formData.agreedToTerms}
                    >
                      {isLoading ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Creating Account...
                        </>
                      ) : (
                        "Create My Researcher Account"
                      )}
                    </Button>
                    
                    <SignupFooter />
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResearchAideSignup;
