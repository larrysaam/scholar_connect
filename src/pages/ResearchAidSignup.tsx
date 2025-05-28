
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PersonalInfoSection from "@/components/signup/research-aid/PersonalInfoSection";
import ExpertiseSection from "@/components/signup/research-aid/ExpertiseSection";
import CredentialsSection from "@/components/signup/research-aid/CredentialsSection";
import AgreementSection from "@/components/signup/research-aid/AgreementSection";
import ThankYouMessage from "@/components/signup/research-aid/ThankYouMessage";

const ResearchAidSignup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    sex: "",
    dateOfBirth: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    country: "",
    languages: [] as string[],
    expertise: [] as string[],
    otherExpertise: "",
    experience: "",
    linkedInUrl: "",
    agreedToTerms: false
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);

  const availableLanguages = [
    "English", "French", "Spanish", "Arabic", "Portuguese", "German", "Swahili", "Other"
  ];

  const expertiseAreas = [
    "Statistician",
    "GIS Specialist", 
    "Academic Editor",
    "Publisher or Journal Consultant",
    "Data Analyst",
    "Field Data Collector",
    "Thesis Formatter / Reference Stylist",
    "Research Assistants",
    "Transcribers",
    "Survey Tool Experts",
    "Design & Visualization",
    "Translators"
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const toggleExpertise = (expertise: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(expertise)
        ? prev.expertise.filter(e => e !== expertise)
        : [...prev.expertise, expertise]
    }));
  };

  const removeLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  const removeExpertise = (expertise: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(e => e !== expertise)
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
      console.log('Attempting to sign up research aid with role: aid');
      
      // First, try to sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        options: {
          data: {
            fullName: formData.fullName,
            role: 'aid'
          }
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: authError.message
        });
        return;
      }

      console.log('Auth successful, user created:', authData.user?.id);

      if (authData.user) {
        // Wait for the trigger to create the user profile
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('Updating user profile...');
        
        // Update the user profile with additional data
        const { error: updateError } = await supabase
          .from('users')
          .update({
            name: formData.fullName,
            sex: formData.sex,
            date_of_birth: formData.dateOfBirth || null,
            phone_number: formData.phoneNumber,
            country: formData.country,
            languages: formData.languages,
            expertise: formData.expertise,
            other_expertise: formData.otherExpertise,
            experience: formData.experience,
            linkedin_url: formData.linkedInUrl
          })
          .eq('id', authData.user.id);

        if (updateError) {
          console.warn('Error updating profile (non-critical):', updateError);
        } else {
          console.log('Profile updated successfully');
        }

        toast({
          title: "Registration Successful!",
          description: "Please check your email to verify your account."
        });
        
        setShowThankYou(true);
      }
    } catch (error) {
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

  if (showThankYou) {
    return <ThankYouMessage />;
  }

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
                      alt="ScholarConnect" 
                      className="w-8 h-8"
                    />
                    <span className="text-2xl font-bold text-blue-600">ScholarConnect</span>
                  </Link>
                  <CardTitle className="text-2xl text-center font-bold">
                    Join Our Network of Expert Research Aids
                  </CardTitle>
                  <p className="text-gray-600 text-center">
                    Support scholars across Africa with your skills in editing, data analysis, publication, and more.
                  </p>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <PersonalInfoSection
                    formData={formData}
                    availableLanguages={availableLanguages}
                    onInputChange={handleInputChange}
                    onToggleLanguage={toggleLanguage}
                    onRemoveLanguage={removeLanguage}
                  />

                  <ExpertiseSection
                    formData={formData}
                    expertiseAreas={expertiseAreas}
                    onInputChange={handleInputChange}
                    onToggleExpertise={toggleExpertise}
                    onRemoveExpertise={removeExpertise}
                  />

                  <CredentialsSection
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSetCvFile={setCvFile}
                    onSetCertFile={setCertFile}
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

export default ResearchAidSignup;
