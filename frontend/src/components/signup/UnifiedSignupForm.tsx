
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { useNavigate } from 'react-router-dom';
import BasicInfoFields from './BasicInfoFields';
import ContactFields from './ContactFields';
import OrganizationFields from './OrganizationFields';
import PasswordFields from './PasswordFields';
import TermsCheckbox from './TermsCheckbox';
import ExpertiseSection from './research-aid/ExpertiseSection';
import PersonalInfoSection from './research-aid/PersonalInfoSection';
import CredentialsSection from './research-aid/CredentialsSection';
import { createResearchAidProfile } from '@/services/researchAidService';
import type { UserRole } from '@/types/signup';

interface UnifiedSignupFormProps {
  defaultUserType: UserRole;
}

const UnifiedSignupForm = ({ defaultUserType }: UnifiedSignupFormProps) => {
  const navigate = useNavigate();
  const { signUp } = useSecureAuth();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<UserRole>(defaultUserType);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: '',
    institution: '',
    fieldOfStudy: '',
    levelOfStudy: '',
    researchTopic: '',
    dateOfBirth: '',
    sex: '',
    agreedToTerms: false,
    // Research Aid specific fields
    fullName: '', // For PersonalInfoSection
    languages: [] as string[], // For PersonalInfoSection
    experience: '', // For CredentialsSection
    linkedInUrl: '', // For CredentialsSection
    expertise: [] as string[], // For ExpertiseSection
    otherExpertise: '', // For ExpertiseSection
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [certFile, setCertFile] = useState<File | null>(null);

  const availableLanguages = ['English', 'French', 'Spanish', 'German', 'Chinese', 'Arabic', 'Other'];
  const expertiseAreas = [
    'Academic Writing', 'Data Analysis', 'Literature Review', 'Research Design',
    'Statistical Consulting', 'Qualitative Research', 'Quantitative Research',
    'Editing & Proofreading', 'Grant Writing', 'Survey Design', 'Transcription',
    'Translation', 'Coding/Programming', 'Experimental Design', 'Fieldwork'
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(lang => lang !== language)
        : [...prev.languages, language],
    }));
  };

  const handleRemoveLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== language),
    }));
  };

  const handleToggleExpertise = (expertise: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(expertise)
        ? prev.expertise.filter(exp => exp !== expertise)
        : [...prev.expertise, expertise],
    }));
  };

  const handleRemoveExpertise = (expertise: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(exp => exp !== expertise),
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (!formData.agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const userData = {
        fullName: `${formData.firstName} ${formData.lastName}`,
        role: userType,
        phoneNumber: formData.phone,
        country: formData.country,
        universityInstitution: formData.institution,
        fieldOfStudy: formData.fieldOfStudy,
        levelOfStudy: formData.levelOfStudy,
        researchTopic: formData.researchTopic,
        dateOfBirth: formData.dateOfBirth,
        sex: formData.sex,
      };

      const result = await signUp(formData.email, formData.password, userData);
      
      if (result.success) {
        toast.success('Account created successfully! Please sign in to continue.');

        if (userType === 'aid') {
          try {
            await createResearchAidProfile({
              userId: result.userId, // Assuming result.userId is available after successful signup
              fullName: formData.fullName,
              sex: formData.sex,
              dateOfBirth: formData.dateOfBirth,
              phoneNumber: formData.phone,
              country: formData.country,
              languages: formData.languages,
              experience: formData.experience,
              linkedInUrl: formData.linkedInUrl,
              expertise: formData.expertise,
              otherExpertise: formData.otherExpertise,
            }, cvFile, certFile);
            toast.success('Research Aid profile created successfully!');
          } catch (profileError) {
            toast.error(`Failed to create Research Aid profile: ${profileError.message}`);
            // Optionally, handle rollback of user creation or flag for manual review
          }
        }
        navigate('/login');
      } else {
        toast.error(result.error || 'Failed to create account');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Your Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs value={userType} onValueChange={(value) => setUserType(value as UserRole)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="expert">Expert</TabsTrigger>
                <TabsTrigger value="aid">Research Aid</TabsTrigger>
              </TabsList>

              <TabsContent value="student" className="space-y-4">
                <BasicInfoFields formData={formData} onInputChange={handleInputChange} />
                <ContactFields formData={formData} onInputChange={handleInputChange} />
                <OrganizationFields formData={formData} onInputChange={handleInputChange} />
                <PasswordFields formData={formData} onInputChange={handleInputChange} />
                <TermsCheckbox 
                  agreedToTerms={formData.agreedToTerms}
                  onInputChange={handleInputChange}
                />
              </TabsContent>

              <TabsContent value="expert" className="space-y-4">
                <TabPlaceholder userType="expert" message="Expert registration form coming soon. Please use the contact form to register as an expert." />
              </TabsContent>

              <TabsContent value="aid" className="space-y-4">
                <PersonalInfoSection
                  formData={formData}
                  availableLanguages={availableLanguages}
                  onInputChange={handleInputChange}
                  onToggleLanguage={handleToggleLanguage}
                  onRemoveLanguage={handleRemoveLanguage}
                />
                <CredentialsSection
                  formData={formData}
                  onInputChange={handleInputChange}
                  onSetCvFile={setCvFile}
                  onSetCertFile={setCertFile}
                />
                <ExpertiseSection
                  formData={formData}
                  expertiseAreas={expertiseAreas}
                  onInputChange={handleInputChange}
                  onToggleExpertise={handleToggleExpertise}
                  onRemoveExpertise={handleRemoveExpertise}
                />
                <TermsCheckbox
                  agreedToTerms={formData.agreedToTerms}
                  onInputChange={handleInputChange}
                />
              </TabsContent>
            </Tabs>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedSignupForm;
