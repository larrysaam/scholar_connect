
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { BaseFormData, UserRole } from '@/types/signup';

export const useSignupValidation = () => {
  const validateForm = (baseFormData: BaseFormData): boolean => {
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

  return { validateForm };
};

export const useSignupSubmission = () => {
  const handleSignup = async (
    baseFormData: BaseFormData,
    userRole: UserRole,
    getSpecializedData: () => any
  ) => {
    try {
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
        return { success: false, error: error.message };
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

        return { success: true, user: data.user };
      }

      return { success: false, error: 'Unknown error occurred' };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An error occurred during signup' };
    }
  };

  return { handleSignup };
};
