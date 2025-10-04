
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '@/hooks/auth/useAuthActions';
import AuthHeader from '@/components/auth/AuthHeader';
import FormField from '@/components/auth/FormField';
import { countries, cameroonAfricaUniversities, fieldsOfStudy, studyLevels, countryCodes, academicRanks, languages } from '@/data/authData';

const ResearcherSignup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuthActions();
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
    fieldOfExpertise: '',
    otherFieldOfExpertise: '',
    academicRank: '',
    otherAcademicRank: '',
    highestEducation: '',
    sex: '',
    dateOfBirth: '',
    linkedinAccount: '',
    researchgateAccount: '',
    academiaEduAccount: '',
    orcidId: '',
    preferredLanguage: '',
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
      // Prepare comprehensive user data for the database
      const userData = {
        fullName: formData.fullName,
        role: 'expert',
        phoneNumber: `${formData.countryCode}${formData.phoneNumber}`,
        country: formData.country === 'other' ? formData.otherCountry : formData.country,
        universityInstitution: formData.university === 'other' ? formData.otherUniversity : formData.university,
        fieldOfExpertise: formData.fieldOfExpertise === 'other' ? formData.otherFieldOfExpertise : formData.fieldOfExpertise,
        otherFieldOfExpertise: formData.otherFieldOfExpertise,
        academicRank: formData.academicRank === 'other' ? formData.otherAcademicRank : formData.academicRank,
        highestEducation: formData.highestEducation,
        sex: formData.sex,
        dateOfBirth: formData.dateOfBirth,
        linkedinAccount: formData.linkedinAccount,
        researchgateAccount: formData.researchgateAccount,
        academiaEduAccount: formData.academiaEduAccount,
        orcidId: formData.orcidId,
        preferredLanguage: formData.preferredLanguage
      };

      const result = await signUp(formData.email, formData.password, userData);

      if (result.success) {
        toast.success('Account created successfully! Please check your email for verification.');
        navigate('/researcher-dashboard');
      } else {
        toast.error(result.error || 'An error occurred during signup');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An unexpected error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <AuthHeader
          title="Join ResearchWhao as a Research Expert"
          subtitle="Give Students the Right Academic Support at Every Step of their Research Journey. Connect with students at all academic levels, give expert assistance, and elevate their thesis or dissertation."
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
                label="Email Address (Institutional Email Address Preferred)"
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
                label="University/Institution/Research Organisation"
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
                label="Field of Expertise"
                type="select"
                required
                value={formData.fieldOfExpertise}
                onChange={(value) => handleInputChange('fieldOfExpertise', value)}
                options={fieldsOfStudy}
                showOtherOption
                otherValue={formData.otherFieldOfExpertise}
                onOtherChange={(value) => handleInputChange('otherFieldOfExpertise', value)}
              />

              <FormField
                label="Academic Rank"
                type="select"
                required
                value={formData.academicRank}
                onChange={(value) => handleInputChange('academicRank', value)}
                options={academicRanks}
                showOtherOption
                otherValue={formData.otherAcademicRank}
                onOtherChange={(value) => handleInputChange('otherAcademicRank', value)}
              />

              <FormField
                label="Highest Level of Education"
                type="select"
                required
                value={formData.highestEducation}
                onChange={(value) => handleInputChange('highestEducation', value)}
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
                <h3 className="text-xl font-semibold mb-4">Research Profile</h3>
                <p className="text-sm text-gray-600 mb-4">This will help us verify your status as a Researcher</p>
                
                <FormField
                  label="LinkedIn Account"
                  type="url"
                  value={formData.linkedinAccount}
                  onChange={(value) => handleInputChange('linkedinAccount', value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  validateURL={true}
                  fieldName="linkedinAccount"
                />

                <FormField
                  label="ResearchGate"
                  type="url"
                  value={formData.researchgateAccount}
                  onChange={(value) => handleInputChange('researchgateAccount', value)}
                  placeholder="https://researchgate.net/profile/yourprofile"
                  validateURL={true}
                  fieldName="researchgateAccount"
                />

                <FormField
                  label="Academia.edu"
                  type="url"
                  value={formData.academiaEduAccount}
                  onChange={(value) => handleInputChange('academiaEduAccount', value)}
                  placeholder="https://institution.academia.edu/yourprofile"
                  validateURL={true}
                  fieldName="academiaEduAccount"
                />

                <FormField
                  label="ORCID ID"
                  type="orcid"
                  value={formData.orcidId}
                  onChange={(value) => handleInputChange('orcidId', value)}
                />

                <FormField
                  label="Preferred Language"
                  type="select"
                  required
                  value={formData.preferredLanguage}
                  onChange={(value) => handleInputChange('preferredLanguage', value)}
                  options={languages}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Create an Account</h3>
                
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
                {loading ? 'Creating Account...' : 'Create My Researcher Account'}
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

export default ResearcherSignup;
