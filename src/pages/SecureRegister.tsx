
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SecurePersonalDetailsSection from "@/components/register/SecurePersonalDetailsSection";
import AcademicInterestsSection from "@/components/register/AcademicInterestsSection";
import SecureAccountCreationSection from "@/components/register/SecureAccountCreationSection";
import AgreementSection from "@/components/register/AgreementSection";
import SecurityEnhancedForm from "@/components/security/SecurityEnhancedForm";
import { validatePassword } from "@/utils/security";

const SecureRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, isRateLimited } = useSecureAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    country: "",
    institution: "",
    faculty: "",
    studyLevel: "",
    sex: "",
    dateOfBirth: "",
    researchAreas: [] as string[],
    topicTitle: "",
    researchStage: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false
  });

  const researchAreaOptions = [
    "Education", "Health Sciences", "Engineering", "Social Sciences", "Natural Sciences",
    "Agriculture", "Economics", "Geography", "Psychology", "Computer Science",
    "Mathematics", "Physics", "Chemistry", "Biology", "Literature", "History"
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleResearchArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      researchAreas: prev.researchAreas.includes(area)
        ? prev.researchAreas.filter(a => a !== area)
        : [...prev.researchAreas, area]
    }));
  };

  const removeResearchArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      researchAreas: prev.researchAreas.filter(a => a !== area)
    }));
  };

  const handleSecureSubmit = async (data: Record<string, string>, csrfToken: string) => {
    console.log('CSRF Token received:', csrfToken);
    
    // Validate password strength
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        error: passwordValidation.errors[0]
      };
    }

    if (formData.password !== formData.confirmPassword) {
      return {
        success: false,
        error: "Passwords do not match. Please check and try again."
      };
    }

    if (!formData.agreedToTerms) {
      return {
        success: false,
        error: "Please agree to the terms and conditions to continue."
      };
    }

    if (isRateLimited) {
      return {
        success: false,
        error: "Too many attempts. Please wait before trying again."
      };
    }

    setIsLoading(true);

    try {
      const result = await signUp(formData.email, formData.password, {
        fullName: formData.fullName,
        role: 'student'
      });

      if (result.success) {
        toast({
          title: "Registration Successful!",
          description: "Please check your email to verify your account, then sign in to access your dashboard."
        });
        
        navigate("/auth");
        return { success: true };
      } else {
        return {
          success: false,
          error: result.error || "An unexpected error occurred. Please try again."
        };
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      return {
        success: false,
        error: "An unexpected error occurred. Please try again."
      };
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
                    Join ResearchWhao as a Student
                  </CardTitle>
                  <p className="text-lg text-center font-semibold text-gray-700 mb-2">
                    Get the Right Academic Support at Every Step of Your Research Journey
                  </p>
                  <p className="text-gray-600 text-center">
                    Connect with top scholars, get expert assistance, and elevate your thesis or dissertation.
                  </p>
                </div>
              </CardHeader>
              
              <CardContent>
                <SecurityEnhancedForm
                  onSubmit={handleSecureSubmit}
                  submitLabel="Create Account"
                  isLoading={isLoading}
                >
                  <SecurePersonalDetailsSection
                    formData={formData}
                    onInputChange={handleInputChange}
                  />

                  <AcademicInterestsSection
                    formData={formData}
                    researchAreaOptions={researchAreaOptions}
                    onInputChange={handleInputChange}
                    onToggleResearchArea={toggleResearchArea}
                    onRemoveResearchArea={removeResearchArea}
                  />

                  <SecureAccountCreationSection
                    formData={formData}
                    onInputChange={handleInputChange}
                  />

                  <AgreementSection
                    agreedToTerms={formData.agreedToTerms}
                    onInputChange={handleInputChange}
                    onSubmit={() => {}} // This is handled by SecurityEnhancedForm
                    isLoading={isLoading}
                  />
                </SecurityEnhancedForm>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SecureRegister;
