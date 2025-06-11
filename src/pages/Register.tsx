import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useSecureAuth } from '@/hooks/useSecureAuth';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountType: 'student' | 'expert' | 'aid';
  country: string;
  institution: string;
  faculty: string;
  researchAreas: string[];
  topicTitle: string;
  researchStage: string;
  studyLevel: string;
  sex: string;
  phoneNumber: string;
  dateOfBirth: string;
  languages: string[];
  termsAccepted: boolean;
}

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
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'researchAreas') {
      const selectedOptions = Array.from((e.target as HTMLSelectElement).selectedOptions, option => option.value);
      setFormData(prev => ({ ...prev, researchAreas: selectedOptions }));
    } else if (name === 'languages') {
      const selectedOptions = Array.from((e.target as HTMLSelectElement).selectedOptions, option => option.value);
      setFormData(prev => ({ ...prev, languages: selectedOptions }));
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.fullName !== '' && formData.email !== '' && formData.password !== '' && formData.confirmPassword !== '' && formData.password === formData.confirmPassword;
      case 2:
        return formData.accountType !== '' && formData.country !== '' && formData.institution !== '' && formData.faculty !== '';
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
    if (!validateStep(3)) return;

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

  const renderStep1 = () => (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required />
        </div>
      </div>
      <Button onClick={nextStep} disabled={isLoading} className="mt-4">
        {isLoading ? "Loading..." : "Next"}
      </Button>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="accountType">Account Type</Label>
          <Select name="accountType" value={formData.accountType} onValueChange={(value) => handleInputChange({ target: { name: 'accountType', value } } as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
              <SelectItem value="aid">Research Aid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input type="text" id="country" name="country" value={formData.country} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="institution">Institution</Label>
          <Input type="text" id="institution" name="institution" value={formData.institution} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="faculty">Faculty</Label>
          <Input type="text" id="faculty" name="faculty" value={formData.faculty} onChange={handleInputChange} required />
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={prevStep} disabled={isLoading}>
          Previous
        </Button>
        <Button onClick={nextStep} disabled={isLoading}>
          {isLoading ? "Loading..." : "Next"}
        </Button>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="researchAreas">Research Areas</Label>
          <Select
            multiple
            name="researchAreas"
            value={formData.researchAreas}
            onValueChange={(value) => handleInputChange({ target: { name: 'researchAreas', value } } as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select research areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
              <SelectItem value="Biotechnology">Biotechnology</SelectItem>
              <SelectItem value="Climate Change">Climate Change</SelectItem>
              {/* Add more research areas as needed */}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="topicTitle">Topic Title</Label>
          <Input type="text" id="topicTitle" name="topicTitle" value={formData.topicTitle} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="researchStage">Research Stage</Label>
          <Input type="text" id="researchStage" name="researchStage" value={formData.researchStage} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="studyLevel">Study Level</Label>
          <Select name="studyLevel" value={formData.studyLevel} onValueChange={(value) => handleInputChange({ target: { name: 'studyLevel', value } } as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select study level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="undergraduate">Undergraduate</SelectItem>
              <SelectItem value="masters">Masters</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
              <SelectItem value="postdoc">Postdoc</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sex">Sex</Label>
          <Select name="sex" value={formData.sex} onValueChange={(value) => handleInputChange({ target: { name: 'sex', value } as any })}>
            <SelectTrigger>
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="languages">Languages</Label>
          <Select
            multiple
            name="languages"
            value={formData.languages}
            onValueChange={(value) => handleInputChange({ target: { name: 'languages', value } } as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select languages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="French">French</SelectItem>
              {/* Add more languages as needed */}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={prevStep} disabled={isLoading}>
          Previous
        </Button>
        <Button onClick={nextStep} disabled={isLoading}>
          {isLoading ? "Loading..." : "Next"}
        </Button>
      </div>
    </>
  );

  const renderStep4 = () => (
    <>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          name="termsAccepted"
          checked={formData.termsAccepted}
          onCheckedChange={(checked) => handleInputChange({ target: { name: 'termsAccepted', type: 'checkbox', checked } as any })}
        />
        <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
          I agree to the <a href="#" className="underline">terms and conditions</a>
        </Label>
      </div>
      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={prevStep} disabled={isLoading}>
          Previous
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading || !formData.termsAccepted}>
          {isLoading ? "Loading..." : "Register"}
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4 space-y-4">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Enter your details below.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
