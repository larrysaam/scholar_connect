
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import FormSteps from '@/components/register/FormSteps';
import { FormData } from '@/components/register/types';

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'student',
    country: '',
    institution: '',
    faculty: '',
    researchAreas: [],
    topicTitle: '',
    researchStage: '',
    studyLevel: '',
    sex: '',
    phoneNumber: '',
    dateOfBirth: '',
    languages: [],
    termsAccepted: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useSecureAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (name: string, values: string[]) => {
    setFormData(prev => ({ ...prev, [name]: values }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.fullName !== '' && formData.email !== '' && formData.password !== '' && formData.confirmPassword !== '' && formData.password === formData.confirmPassword;
      case 2:
        return formData.country !== '' && formData.institution !== '' && formData.faculty !== '';
      case 3:
        return formData.researchAreas.length > 0 && formData.topicTitle !== '' && formData.researchStage !== '' && formData.studyLevel !== '' && formData.sex !== '' && formData.phoneNumber !== '' && formData.dateOfBirth !== '';
      case 4:
        return formData.termsAccepted === true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsLoading(true);
    try {
      const userData = {
        fullName: formData.fullName,
        role: formData.accountType,
        country: formData.country,
        institution: formData.institution,
        faculty: formData.faculty,
        researchAreas: formData.researchAreas,
        topicTitle: formData.topicTitle,
        researchStage: formData.researchStage,
        studyLevel: formData.studyLevel as "undergraduate" | "masters" | "phd" | "postdoc",
        sex: formData.sex as "male" | "female",
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        languages: formData.languages,
      };

      const { success, error } = await signUp(formData.email, formData.password, userData);

      if (success) {
        toast({
          title: "Registration Successful!",
          description: "Please check your email to verify your account.",
        });
        navigate('/auth');
      } else {
        toast({
          title: "Registration Failed",
          description: error || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4 space-y-4">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Enter your details below.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit}>
            <FormSteps
              currentStep={currentStep}
              formData={formData}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onMultiSelectChange={handleMultiSelectChange}
              isLoading={isLoading}
              onNext={nextStep}
              onPrev={prevStep}
              onSubmit={handleSubmit}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
