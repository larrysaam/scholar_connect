
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from './types';

interface UseAuthActionsProps {
  profile: UserProfile | null;
  resetAuthState: () => void;
}

export const useAuthActions = ({ profile, resetAuthState }: UseAuthActionsProps) => {
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        const firstName = data.user.user_metadata?.fullName?.split(' ')[0] || 
                         data.user.user_metadata?.name?.split(' ')[0] || 
                         'there';
        toast.success(`Welcome back, ${firstName}!`);
      }

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            fullName: userData.fullName,
            role: userData.role,
            phoneNumber: userData.phoneNumber,
            country: userData.country,
            universityInstitution: userData.universityInstitution,
            fieldOfStudy: userData.fieldOfStudy,
            levelOfStudy: userData.levelOfStudy,
            researchTopic: userData.researchTopic,
            dateOfBirth: userData.dateOfBirth,
            sex: userData.sex,
            academicRank: userData.academicRank,
            highestEducation: userData.highestEducation,
            fieldsOfExpertise: userData.fieldsOfExpertise,
            linkedinAccount: userData.linkedinAccount,
            researchgateAccount: userData.researchgateAccount,
            academiaEduAccount: userData.academiaEduAccount,
            orcidId: userData.orcidId,
            preferredLanguage: userData.preferredLanguage,
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        const firstName = userData.fullName?.split(' ')[0] || 'there';
        const roleDisplayName = userData.role === 'expert' ? 'Expert' : 
                               userData.role === 'aid' ? 'Research Aid' : 'Student';
        toast.success(`Welcome, ${firstName}! Your ${roleDisplayName} account has been created successfully.`);
      }

      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast.error('Failed to sign out');
      } else {
        toast.success('Signed out successfully');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('An error occurred during sign out');
    }
  };

  return {
    signIn,
    signUp,
    signOut,
  };
};
