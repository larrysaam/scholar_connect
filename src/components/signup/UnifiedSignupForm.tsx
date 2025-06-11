
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';

// Import existing field components
import BasicInfoFields from './BasicInfoFields';
import ContactFields from './ContactFields';
import PasswordFields from './PasswordFields';
import TermsCheckbox from './TermsCheckbox';
import TabPlaceholder from './TabPlaceholder';

// Import specialized sections
import PersonalInfoSection from './research-aid/PersonalInfoSection';
import ExpertiseSection from './research-aid/ExpertiseSection';

// Import logic hooks
import { useSignupValidation, useSignupSubmission } from './SignupFormLogic';

import type { BaseFormData, StudentSignupData, ExpertSignupData, ResearchAidSignupData, UserRole } from '@/types/signup';

interface UnifiedSignupFormProps {
  defaultUserType?: 'student' | 'expert' | 'aid';
}

const UnifiedSignupForm = ({ defaultUserType = 'student' }: UnifiedSignupFormProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'student' | 'expert' | 'aid'>(defaultUserType);
  const [isLoading, setIsLoading] = useState(false);
  
  // Base form data that all user types share
  const [baseFormData, setBaseFormData] = useState<BaseFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });

  // Specialized form data for different user types
  const [studentData, setStudentData] = useState<Partial<StudentSignupData>>({});
  const [expertData, setExpertData] = useState<Partial<ExpertSignupData>>({});
  const [aidData, setAidData] = useState<Partial<ResearchAidSignupData>>({
    sex: '',
    dateOfBirth: '',
    country: '',
    languages: [],
    expertise: [],
    otherExpertise: '',
  });

  // Available languages for the PersonalInfoSection
  const availableLanguages = [
    'English', 'French', 'Spanish', 'German', 'Portuguese', 'Arabic', 'Swahili', 'Hausa'
  ];

  const { validateForm } = useSignupValidation();
  const { handleSignup } = useSignupSubmission();

  const handleBaseInputChange = (field: string, value: string | boolean) => {
    setBaseFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecializedInputChange = (field: string, value: string | boolean | string[]) => {
    switch (activeTab) {
      case 'student':
        setStudentData(prev => ({ ...prev, [field]: value }));
        break;
      case 'expert':
        setExpertData(prev => ({ ...prev, [field]: value }));
        break;
      case 'aid':
        setAidData(prev => ({ ...prev, [field]: value }));
        break;
    }
  };

  const handleToggleLanguage = (language: string) => {
    const currentLanguages = aidData.languages || [];
    const updated = currentLanguages.includes(language)
      ? currentLanguages.filter(l => l !== language)
      : [...currentLanguages, language];
    handleSpecializedInputChange('languages', updated);
  };

  const handleRemoveLanguage = (language: string) => {
    const currentLanguages = aidData.languages || [];
    const updated = currentLanguages.filter(l => l !== language);
    handleSpecializedInputChange('languages', updated);
  };

  const getSpecializedData = () => {
    switch (activeTab) {
      case 'student':
        return {
          institution: studentData.institution,
          faculty: studentData.faculty,
          study_level: studentData.studyLevel,
          research_areas: studentData.researchAreas,
          topic_title: studentData.topicTitle,
          research_stage: studentData.researchStage,
          country: studentData.country,
          date_of_birth: studentData.dateOfBirth,
          sex: studentData.sex,
        };
      case 'expert':
        return {
          institution: expertData.organization,
          experience: expertData.experience,
          expertise: expertData.expertise,
          other_expertise: expertData.otherExpertise,
          languages: expertData.languages,
          linkedin_url: expertData.linkedInUrl,
          country: expertData.country,
          date_of_birth: expertData.dateOfBirth,
          sex: expertData.sex,
        };
      case 'aid':
        return {
          institution: aidData.organization,
          experience: aidData.experience,
          expertise: aidData.expertise,
          other_expertise: aidData.otherExpertise,
          languages: aidData.languages,
          linkedin_url: aidData.linkedInUrl,
          country: aidData.country || '',
          date_of_birth: aidData.dateOfBirth || '',
          sex: aidData.sex || '',
        };
      default:
        return {};
    }
  };

  const getCurrentFormData = () => {
    const baseData = {
      ...baseFormData,
      fullName: `${baseFormData.firstName} ${baseFormData.lastName}`,
      sex: aidData.sex || '',
      dateOfBirth: aidData.dateOfBirth || '',
      phoneNumber: baseFormData.phone,
      country: aidData.country || '',
      languages: aidData.languages || [],
    };

    switch (activeTab) {
      case 'student':
        return { ...baseData, ...studentData };
      case 'expert':
        return { 
          ...baseData, 
          ...expertData,
          expertise: expertData.expertise || [],
          otherExpertise: expertData.otherExpertise || '',
        };
      case 'aid':
        return { 
          ...baseData, 
          ...aidData,
          expertise: aidData.expertise || [],
          otherExpertise: aidData.otherExpertise || '',
        };
      default:
        return { 
          ...baseData,
          expertise: [],
          otherExpertise: '',
        };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(baseFormData)) return;

    setIsLoading(true);

    try {
      const userRole: UserRole = activeTab === 'aid' ? 'aid' : activeTab as UserRole;
      
      const result = await handleSignup(baseFormData, userRole, getSpecializedData);

      if (result.success) {
        toast.success('Account created successfully! Please check your email for verification.');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'An error occurred during signup');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'student' | 'expert' | 'aid');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Your Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="expert">Expert</TabsTrigger>
              <TabsTrigger value="aid">Research Aid</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* Common fields for all user types */}
              <BasicInfoFields 
                formData={baseFormData} 
                onInputChange={handleBaseInputChange} 
              />
              <ContactFields 
                formData={baseFormData} 
                onInputChange={handleBaseInputChange} 
              />
              <PasswordFields 
                formData={baseFormData} 
                onInputChange={handleBaseInputChange} 
              />

              {/* Specialized content based on user type */}
              <TabsContent value="student" className="space-y-4">
                <TabPlaceholder 
                  userType="student"
                  message="Additional student information will be collected after account creation."
                />
              </TabsContent>

              <TabsContent value="expert" className="space-y-4">
                <TabPlaceholder 
                  userType="expert"
                  message="Additional expert information will be collected after account creation."
                />
              </TabsContent>

              <TabsContent value="aid" className="space-y-4">
                <PersonalInfoSection 
                  formData={getCurrentFormData()}
                  availableLanguages={availableLanguages}
                  onInputChange={handleSpecializedInputChange}
                  onToggleLanguage={handleToggleLanguage}
                  onRemoveLanguage={handleRemoveLanguage}
                />
                <ExpertiseSection
                  formData={{
                    expertise: aidData.expertise || [],
                    otherExpertise: aidData.otherExpertise || ''
                  }}
                  expertiseAreas={[
                    'Data Collection',
                    'Data Analysis',
                    'Literature Review',
                    'Survey Design',
                    'Interview Transcription',
                    'Statistical Analysis',
                    'Content Writing',
                    'Research Design'
                  ]}
                  onInputChange={handleSpecializedInputChange}
                  onToggleExpertise={(expertise) => {
                    const current = aidData.expertise || [];
                    const updated = current.includes(expertise)
                      ? current.filter(e => e !== expertise)
                      : [...current, expertise];
                    handleSpecializedInputChange('expertise', updated);
                  }}
                  onRemoveExpertise={(expertise) => {
                    const current = aidData.expertise || [];
                    const updated = current.filter(e => e !== expertise);
                    handleSpecializedInputChange('expertise', updated);
                  }}
                />
              </TabsContent>

              <TermsCheckbox 
                agreedToTerms={baseFormData.agreedToTerms}
                onInputChange={handleBaseInputChange}
              />

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating Account...
                  </>
                ) : (
                  `Create ${activeTab === 'aid' ? 'Research Aid' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Account`
                )}
              </Button>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedSignupForm;
