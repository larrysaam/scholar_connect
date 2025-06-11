import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PersonalDetailsSection from "@/components/register/PersonalDetailsSection";
import AcademicInterestsSection from "@/components/register/AcademicInterestsSection";
import AccountCreationSection from "@/components/register/AccountCreationSection";
import AgreementSection from "@/components/register/AgreementSection";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

    setIsLoading(true);

    try {
      console.log('Attempting to sign up student with role: student');
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        options: {
          data: {
            fullName: formData.fullName,
            role: 'student'
          },
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        
        let errorMessage = authError.message;
        if (authError.message.includes('User already registered')) {
          errorMessage = "This email address is already registered. Please use a different email or try signing in.";
        }
        
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: errorMessage
        });
        return;
      }

      console.log('Auth successful, user created:', authData.user?.id);

      if (authData.user) {
        // Wait a moment for the trigger to create the user profile
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('Updating user profile...');
        
        try {
          const { error: updateError } = await supabase
            .from('users')
            .update({
              name: formData.fullName,
              phone_number: formData.phoneNumber,
              country: formData.country,
              institution: formData.institution,
              faculty: formData.faculty,
              study_level: formData.studyLevel,
              sex: formData.sex,
              date_of_birth: formData.dateOfBirth || null,
              research_areas: formData.researchAreas,
              topic_title: formData.topicTitle,
              research_stage: formData.researchStage
            })
            .eq('id', authData.user.id);

          if (updateError) {
            console.warn('Error updating profile (non-critical):', updateError);
          } else {
            console.log('Profile updated successfully');
          }
        } catch (profileError) {
          console.warn('Profile update failed (non-critical):', profileError);
        }

        toast({
          title: "Registration Successful!",
          description: "Please check your email to verify your account, then sign in to access your dashboard."
        });
        
        navigate("/auth");
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
                <form onSubmit={handleSubmit} className="space-y-8">
                  <PersonalDetailsSection
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

                  <AccountCreationSection
                    formData={formData}
                    onInputChange={handleInputChange}
                  />

                  <AgreementSection
                    agreedToTerms={formData.agreedToTerms}
                    onInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                  />
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

export default Register;
