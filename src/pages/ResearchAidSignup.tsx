import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import AuthHeader from '@/components/auth/AuthHeader';
import FormField from '@/components/auth/FormField';
import { countries, cameroonAfricaUniversities, studyLevels, countryCodes, languages } from '@/data/authData';
import { useSecurityValidation } from '@/hooks/useSecurityValidation';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield } from 'lucide-react';

const ResearchAidSignup = () => {
  const navigate = useNavigate();
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
    fieldsOfExpertise: '',
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

  const { validateFormData, validationErrors, clearValidationErrors } = useSecurityValidation();
  const { logSecurityEvent } = useEnhancedAuth();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearValidationErrors();
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

    // Validate all form data
    if (!validateFormData(formData)) {
      return;
    }

    setLoading(true);

    try {
      logSecurityEvent(`Research Aid signup attempt for ${formData.email}`);
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/research-aids-dashboard`,
          data: {
            fullName: formData.fullName,
            role: 'aid',
            phoneNumber: `${formData.countryCode}${formData.phoneNumber}`,
            country: formData.country === 'other' ? formData.otherCountry : formData.country,
            universityInstitution: formData.university === 'other' ? formData.otherUniversity : formData.university,
            fieldsOfExpertise: formData.fieldsOfExpertise,
            highestEducation: formData.highestEducation,
            sex: formData.sex,
            dateOfBirth: formData.dateOfBirth,
            linkedinAccount: formData.linkedinAccount,
            researchgateAccount: formData.researchgateAccount,
            academiaEduAccount: formData.academiaEduAccount,
            orcidId: formData.orcidId,
            preferredLanguage: formData.preferredLanguage
          }
        }
      });

      if (error) {
        logSecurityEvent(`Research Aid signup failed for ${formData.email}: ${error.message}`);
        toast.error(error.message);
      } else {
        // Insert user profile into public.users table
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: formData.email,
            name: formData.fullName,
            role: 'aid',
            phone_number: `${formData.countryCode}${formData.phoneNumber}`,
            country: formData.country === 'other' ? formData.otherCountry : formData.country,
            institution: formData.university === 'other' ? formData.otherUniversity : formData.university,
            study_level: formData.highestEducation,
            expertise: formData.fieldsOfExpertise.split(',').map(item => item.trim()), // Convert comma-separated string to array
            sex: formData.sex,
            date_of_birth: formData.dateOfBirth,
            linkedin_url: formData.linkedinAccount,
            // Add other fields as necessary from formData to match public.users table
          });

        if (profileError) {
          logSecurityEvent(`Failed to save Research Aid profile to public.users for ${formData.email}: ${profileError.message}`);
          toast.error('Account created, but failed to save profile details. Please contact support.');
          // Optionally, you might want to delete the auth user here if profile creation is critical
        } else {
          // Insert research aid profile into public.research_aid_profiles table
          const { error: researchAidProfileError } = await supabase
            .from('research_aid_profiles')
            .insert({
              user_id: data.user.id,
              title: '', // Default or derive from highestEducation
              department: '',
              years_experience: 0,
              students_supervised: 0,
              hourly_rate: 0,
              response_time: 'Usually responds within 24 hours',
              is_online: false,
              online_status: 'offline',
              bio: '',
              research_interests: formData.fieldsOfExpertise.split(',').map(item => item.trim()),
              specialties: [],
              education: [], // Initialize as empty JSONB array
              experience: [],
              publications: [],
              awards: [],
              fellowships: [],
              grants: [],
              memberships: [],
              supervision: [],
              available_times: [],
              verifications: {
                academic: 'pending',
                publication: 'pending',
                institutional: 'pending'
              },
              rating: 0.0,
              total_reviews: 0,
              profile_visibility: 'public',
              show_contact_info: true,
              show_hourly_rate: true,
            });

          if (researchAidProfileError) {
            logSecurityEvent(`Failed to save Research Aid profile to public.research_aid_profiles for ${formData.email}: ${researchAidProfileError.message}`);
            toast.error('Account created, but failed to save detailed research aid profile. Please contact support.');
          } else {
            logSecurityEvent(`Research Aid signup successful and profile saved for ${formData.email}`);
            toast.success('Account created successfully! Please check your email for verification.');
            navigate('/login');
          }
        }
      }
    } catch (error) {
      logSecurityEvent(`Research Aid signup error: ${error.message}`);
      toast.error('An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <AuthHeader
          title="Join ResearchWhoa as a Research Aid"
          subtitle="Give Students the Right Academic Support at Every Step of their Research Journey. Connect with students at all academic levels, give expert assistance, and elevate their thesis or dissertation."
        />
        
        <Card>
          <CardHeader>
            {/* Security indicator */}
            <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-2 rounded mb-4">
              <Shield className="h-4 w-4" />
              <span>Secure registration with data protection</span>
            </div>
            <h3 className="text-xl font-semibold">Personal Details</h3>
          </CardHeader>
          <CardContent>
            {/* Validation errors */}
            {validationErrors.length > 0 && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error.message}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

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
                label="Field(s) of Expertise"
                required
                value={formData.fieldsOfExpertise}
                onChange={(value) => handleInputChange('fieldsOfExpertise', value)}
                placeholder="Enter your fields of expertise"
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
                <p className="text-sm text-gray-600 mb-4">This will help us verify your status</p>
                
                <FormField
                  label="LinkedIn Account"
                  value={formData.linkedinAccount}
                  onChange={(value) => handleInputChange('linkedinAccount', value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />

                <FormField
                  label="ResearchGate"
                  value={formData.researchgateAccount}
                  onChange={(value) => handleInputChange('researchgateAccount', value)}
                  placeholder="https://researchgate.net/profile/yourprofile"
                />

                <FormField
                  label="Academia.edu"
                  value={formData.academiaEduAccount}
                  onChange={(value) => handleInputChange('academiaEduAccount', value)}
                  placeholder="https://institution.academia.edu/yourprofile"
                />

                <FormField
                  label="ORCID ID"
                  value={formData.orcidId}
                  onChange={(value) => handleInputChange('orcidId', value)}
                  placeholder="0000-0000-0000-0000"
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
                {loading ? 'Creating Account...' : 'Create My Research Aid Account'}
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

export default ResearchAidSignup;
