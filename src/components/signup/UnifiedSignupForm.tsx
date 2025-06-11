
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';

// Import existing field components
import BasicInfoFields from './BasicInfoFields';
import ContactFields from './ContactFields';
import TermsCheckbox from './TermsCheckbox';

// Import specialized sections
import PersonalInfoSection from './research-aid/PersonalInfoSection';
import ExpertiseSection from './research-aid/ExpertiseSection';

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
  const [aidData, setAidData] = useState<Partial<ResearchAidSignupData>>({});

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

  const validateForm = (): boolean => {
    if (!baseFormData.firstName || !baseFormData.lastName || !baseFormData.email) {
      toast.error('Please fill in all required fields');
      return false;
    }

    if (baseFormData.password !== baseFormData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (!baseFormData.agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const userRole: UserRole = activeTab === 'aid' ? 'aid' : activeTab as UserRole;
      
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: baseFormData.email,
        password: baseFormData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            fullName: `${baseFormData.firstName} ${baseFormData.lastName}`,
            role: userRole,
            phone: baseFormData.phone,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        // Update user profile with additional data
        const profileData = {
          phone_number: baseFormData.phone,
          role: userRole,
          ...getSpecializedData(),
        };

        const { error: profileError } = await supabase
          .from('users')
          .update(profileData)
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
        }

        toast.success('Account created successfully! Please check your email for verification.');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
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
        };
      case 'aid':
        return {
          institution: aidData.organization,
          experience: aidData.experience,
          expertise: aidData.expertise,
          other_expertise: aidData.otherExpertise,
          languages: aidData.languages,
          linkedin_url: aidData.linkedInUrl,
          country: aidData.country,
        };
      default:
        return {};
    }
  };

  const getCurrentFormData = () => {
    const baseData = {
      ...baseFormData,
      fullName: `${baseFormData.firstName} ${baseFormData.lastName}`,
      sex: '',
      dateOfBirth: '',
      phoneNumber: baseFormData.phone,
      country: '',
      languages: [] as string[],
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

              {/* Specialized content based on user type */}
              <TabsContent value="student" className="space-y-4">
                <div className="text-sm text-gray-600">
                  Additional student information will be collected after account creation.
                </div>
              </TabsContent>

              <TabsContent value="expert" className="space-y-4">
                <div className="text-sm text-gray-600">
                  Additional expert information will be collected after account creation.
                </div>
              </TabsContent>

              <TabsContent value="aid" className="space-y-4">
                <PersonalInfoSection 
                  formData={getCurrentFormData()}
                  onInputChange={handleSpecializedInputChange}
                />
                <ExpertiseSection
                  formData={getCurrentFormData()}
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
