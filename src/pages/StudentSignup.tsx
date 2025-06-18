import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import AuthHeader from '@/components/auth/AuthHeader';
import FormField from '@/components/auth/FormField';
import { countries, cameroonAfricaUniversities, fieldsOfStudy, studyLevels, researchStages, countryCodes } from '@/data/authData';

const StudentSignup = () => {
  const navigate = useNavigate();
  const { signUp } = useSecureAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '+237',
    phoneNumber: '',
    country: '',
    otherCountry: '',
    university: '',
    otherUniversity: '',
    fieldOfStudy: '',
    otherFieldOfStudy: '',
    levelOfStudy: '',
    sex: '',
    dateOfBirth: '',
    researchTopic: '',
    researchStage: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      toast.error('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      console.log('Starting signup process for student...');
      
      // Ensure proper data formatting
      const userData = {
        fullName: formData.fullName.trim(),
        role: 'student',
        phoneNumber: `${formData.countryCode}${formData.phoneNumber}`.trim(),
        country: formData.country === 'other' ? formData.otherCountry.trim() : formData.country,
        universityInstitution: formData.university === 'other' ? formData.otherUniversity.trim() : formData.university,
        fieldOfStudy: formData.fieldOfStudy === 'other' ? formData.otherFieldOfStudy.trim() : formData.fieldOfStudy,
        levelOfStudy: formData.levelOfStudy,
        sex: formData.sex,
        dateOfBirth: formData.dateOfBirth,
        researchTopic: formData.researchTopic.trim(),
        researchStage: formData.researchStage
      };

      console.log('User data to be sent:', userData);

      const result = await signUp(formData.email, formData.password, userData);

      if (result.success) {
        toast.success('Account created successfully! Please check your email for verification.');
        navigate('/dashboard');
      } else {
        console.error('Signup failed:', result.error);
        toast.error(result.error || 'An error occurred during signup');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <AuthHeader
          title="Join ResearchWhao as a Student"
          subtitle="Get the Right Academic Support at Every Step of Your Research Journey. Connect with top scholars, get expert assistance, and elevate your thesis or dissertation."
        />
        
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Personal Details</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <FormField
                label="Full Name"
                required
                value={formData.fullName}
                onChange={(value) => handleInputChange('fullName', value)}
              />

              <FormField
                label="Email Address"
                type="email"
                required
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="Country Code"
                  type="select"
                  required
                  value={formData.countryCode}
                  onChange={(value) => handleInputChange('countryCode', value)}
                  options={countryCodes.map(cc => ({ value: cc.code, label: `${cc.code} (${cc.country})` }))}
                />
                <div className="md:col-span-2">
                  <FormField
                    label="Phone Number"
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(value) => handleInputChange('phoneNumber', value)}
                  />
                </div>
              </div>

              <FormField
                label="Country"
                type="select"
                required
                value={formData.country}
                onChange={(value) => handleInputChange('country', value)}
                options={countries}
                showOtherOption
                otherValue={formData.otherCountry}
                onOtherChange={(value) => handleInputChange('otherCountry', value)}
              />

              <FormField
                label="University/Institution"
                type="select"
                required
                value={formData.university}
                onChange={(value) => handleInputChange('university', value)}
                options={cameroonAfricaUniversities}
                showOtherOption
                otherValue={formData.otherUniversity}
                onOtherChange={(value) => handleInputChange('otherUniversity', value)}
              />

              <FormField
                label="Field of Study"
                type="select"
                required
                value={formData.fieldOfStudy}
                onChange={(value) => handleInputChange('fieldOfStudy', value)}
                options={fieldsOfStudy}
                showOtherOption
                otherValue={formData.otherFieldOfStudy}
                onOtherChange={(value) => handleInputChange('otherFieldOfStudy', value)}
              />

              <FormField
                label="Level of Study"
                type="select"
                required
                value={formData.levelOfStudy}
                onChange={(value) => handleInputChange('levelOfStudy', value)}
                options={studyLevels}
              />

              <FormField
                label="Sex"
                type="select"
                required
                value={formData.sex}
                onChange={(value) => handleInputChange('sex', value)}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' }
                ]}
              />

              <FormField
                label="Date of Birth"
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(value) => handleInputChange('dateOfBirth', value)}
              />

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Academic Interest</h3>
                
                <FormField
                  label="Research Topic"
                  required
                  value={formData.researchTopic}
                  onChange={(value) => handleInputChange('researchTopic', value)}
                  placeholder="Enter your research topic"
                />

                <FormField
                  label="Stage of Research"
                  type="select"
                  required
                  value={formData.researchStage}
                  onChange={(value) => handleInputChange('researchStage', value)}
                  options={researchStages}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Create Your Account</h3>
                
                <FormField
                  label="Password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(value) => handleInputChange('password', value)}
                />

                <FormField
                  label="Confirm Password"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(value) => handleInputChange('confirmPassword', value)}
                />
              </div>

              <div className="border-t pt-6">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                    <span className="text-red-500"> *</span>
                  </label>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Creating Account...' : 'Create My Student Account'}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-blue-600 hover:underline">Sign in</a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentSignup;
