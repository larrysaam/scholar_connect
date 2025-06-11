
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useSecureAuth } from '@/hooks/useSecureAuth';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  institution: string;
  faculty: string;
  expertise: string[];
  otherExpertise: string;
  experience: string;
  linkedinUrl: string;
  sex: string;
  phoneNumber: string;
  dateOfBirth: string;
  languages: string[];
  termsAccepted: boolean;
}

const ResearchAidSignup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    institution: '',
    faculty: '',
    expertise: [],
    otherExpertise: '',
    experience: '',
    linkedinUrl: '',
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

    setFormData(prev => {
      if (type === 'checkbox') {
        return { ...prev, [name]: checked };
      } else {
        return { ...prev, [name]: value };
      }
    });
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
        return formData.expertise.length > 0 && formData.experience !== '';
      case 4:
        return formData.termsAccepted;
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
        role: 'aid',
        country: formData.country,
        institution: formData.institution,
        faculty: formData.faculty,
        expertise: formData.expertise,
        otherExpertise: formData.otherExpertise,
        experience: formData.experience,
        linkedinUrl: formData.linkedinUrl,
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
    <div className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="country">Country</Label>
        <Input type="text" id="country" name="country" value={formData.country} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="institution">Institution</Label>
        <Input type="text" id="institution" name="institution" value={formData.institution} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="faculty">Faculty</Label>
        <Input type="text" id="faculty" name="faculty" value={formData.faculty} onChange={handleInputChange} />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="expertise">Areas of Expertise</Label>
        <Select value={formData.expertise[0] || ""} onValueChange={(value) => handleMultiSelectChange('expertise', [value])}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select expertise" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AI">Artificial Intelligence</SelectItem>
            <SelectItem value="ML">Machine Learning</SelectItem>
            <SelectItem value="DL">Deep Learning</SelectItem>
            <SelectItem value="NLP">Natural Language Processing</SelectItem>
            <SelectItem value="CV">Computer Vision</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="otherExpertise">Other Expertise</Label>
        <Textarea id="otherExpertise" name="otherExpertise" value={formData.otherExpertise} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="experience">Years of Experience</Label>
        <Input type="text" id="experience" name="experience" value={formData.experience} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
        <Input type="url" id="linkedinUrl" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleInputChange} />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="sex">Sex</Label>
        <Select value={formData.sex} onValueChange={(value) => handleSelectChange('sex', value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select sex" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="languages">Languages Spoken</Label>
        <Select value={formData.languages[0] || ""} onValueChange={(value) => handleMultiSelectChange('languages', [value])}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select languages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="french">French</SelectItem>
            <SelectItem value="spanish">Spanish</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="termsAccepted">
          <Checkbox id="termsAccepted" checked={formData.termsAccepted} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, termsAccepted: !!checked }))} />
          I agree to the terms and conditions
        </Label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md space-y-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Research Aid Signup</CardTitle>
          <CardDescription className="text-muted-foreground text-center">
            {`Step ${currentStep} of 4`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            <div className="flex justify-between">
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
              {currentStep < 4 ? (
                <Button type="button" onClick={nextStep} disabled={isLoading}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchAidSignup;
