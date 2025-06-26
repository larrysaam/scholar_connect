
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import BasicInfoFields from './BasicInfoFields';
import ContactFields from './ContactFields';
import OrganizationFields from './OrganizationFields';
import PasswordFields from './PasswordFields';
import TermsCheckbox from './TermsCheckbox';
import ExpertFields from './ExpertFields';
import AidFields from './AidFields';
import type { UserRole } from '@/types/signup';

interface UnifiedSignupFormProps {
  defaultUserType: UserRole;
  showUserTypeSelector?: boolean;
}

const UnifiedSignupForm = ({ defaultUserType, showUserTypeSelector = true }: UnifiedSignupFormProps) => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
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
    organization: '',
    position: '',
    fieldOfStudy: '',
    levelOfStudy: '',
    researchTopic: '',
    dateOfBirth: '',
    sex: '',
    academicRank: '',
    highestEducation: '',
    fieldsOfExpertise: '',
    linkedinAccount: '',
    researchgateAccount: '',
    academiaEduAccount: '',
    orcidId: '',
    preferredLanguage: 'en',
    agreedToTerms: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
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
        universityInstitution: formData.institution || formData.organization,
        fieldOfStudy: formData.fieldOfStudy,
        levelOfStudy: formData.levelOfStudy,
        researchTopic: formData.researchTopic,
        dateOfBirth: formData.dateOfBirth,
        sex: formData.sex,
        academicRank: formData.academicRank,
        highestEducation: formData.highestEducation,
        fieldsOfExpertise: formData.fieldsOfExpertise,
        linkedinAccount: formData.linkedinAccount,
        researchgateAccount: formData.researchgateAccount,
        academiaEduAccount: formData.academiaEduAccount,
        orcidId: formData.orcidId,
        preferredLanguage: formData.preferredLanguage,
      };

      const result = await signUp(formData.email, formData.password, userData);
      
      if (result.success) {
        // Welcome message is now handled in the auth hook
        navigate('/login');
      } else {
        toast.error(result.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'expert': return 'Expert';
      case 'aid': return 'Research Aid';
      default: return 'Student';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {showUserTypeSelector ? 'Create Your Account' : `Create Your ${getRoleDisplayName(userType)} Account`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {showUserTypeSelector ? (
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
                  <BasicInfoFields formData={formData} onInputChange={handleInputChange} />
                  <ContactFields formData={formData} onInputChange={handleInputChange} />
                  <OrganizationFields formData={formData} onInputChange={handleInputChange} />
                  <ExpertFields formData={formData} onInputChange={handleInputChange} />
                  <PasswordFields formData={formData} onInputChange={handleInputChange} />
                  <TermsCheckbox 
                    agreedToTerms={formData.agreedToTerms}
                    onInputChange={handleInputChange}
                  />
                </TabsContent>

                <TabsContent value="aid" className="space-y-4">
                  <BasicInfoFields formData={formData} onInputChange={handleInputChange} />
                  <ContactFields formData={formData} onInputChange={handleInputChange} />
                  <OrganizationFields formData={formData} onInputChange={handleInputChange} />
                  <AidFields formData={formData} onInputChange={handleInputChange} />
                  <PasswordFields formData={formData} onInputChange={handleInputChange} />
                  <TermsCheckbox 
                    agreedToTerms={formData.agreedToTerms}
                    onInputChange={handleInputChange}
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="space-y-4">
                <BasicInfoFields formData={formData} onInputChange={handleInputChange} />
                <ContactFields formData={formData} onInputChange={handleInputChange} />
                <OrganizationFields formData={formData} onInputChange={handleInputChange} />
                
                {userType === 'expert' && (
                  <ExpertFields formData={formData} onInputChange={handleInputChange} />
                )}
                
                {userType === 'aid' && (
                  <AidFields formData={formData} onInputChange={handleInputChange} />
                )}
                
                <PasswordFields formData={formData} onInputChange={handleInputChange} />
                <TermsCheckbox 
                  agreedToTerms={formData.agreedToTerms}
                  onInputChange={handleInputChange}
                />
              </div>
            )}

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
