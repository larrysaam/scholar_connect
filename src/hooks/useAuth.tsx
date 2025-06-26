import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'expert' | 'aid' | 'admin';
  phone_number?: string;
  country?: string;
  university_institution?: string;
  field_of_study?: string;
  level_of_study?: string;
  research_topic?: string;
  academic_rank?: string;
  highest_education?: string;
  fields_of_expertise?: string;
  linkedin_account?: string;
  researchgate_account?: string;
  academia_edu_account?: string;
  orcid_id?: string;
  preferred_language?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Session timeout handling
  useEffect(() => {
    if (!session) return;

    const checkSession = () => {
      // Use expires_at instead of created_at
      const expiresAt = session.expires_at;
      if (expiresAt && Date.now() / 1000 > expiresAt) {
        signOut();
        toast({
          title: "Session Expired",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [session, toast]);

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event !== 'SIGNED_OUT') {
          try {
            const { data: profileData, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (error && error.code !== 'PGRST116') {
              console.error('Error fetching profile:', error);
            } else if (profileData && mounted) {
              setProfile(profileData);
            }
          } catch (error) {
            console.error('Profile fetch error:', error);
          } finally {
            if (mounted) {
              setLoading(false);
            }
          }
        } else {
          setProfile(null);
          if (mounted) {
            setLoading(false);
          }
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profileData, error }) => {
            if (error && error.code !== 'PGRST116') {
              console.error('Error fetching profile:', error);
            } else if (profileData && mounted) {
              setProfile(profileData);
            }
            if (mounted) {
              setLoading(false);
            }
          });
      } else if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return {
          success: false,
          error: error.message === 'Invalid login credentials' 
            ? 'Invalid email or password. Please check your credentials and try again.'
            : error.message
        };
      }

      if (data.user) {
        // Show welcome message for sign in
        setTimeout(() => {
          const firstName = profile?.name?.split(' ')[0] || 'there';
          toast({
            title: `Welcome back, ${firstName}!`,
            description: "You've successfully signed in to your account.",
          });
        }, 1000);
        
        return { success: true };
      }

      return {
        success: false,
        error: 'Login failed. Please try again.'
      };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  };

  const signUp = async (email: string, password: string, userData: any): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
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
        console.error('Supabase signUp error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      if (data.user) {
        // Show welcome message for sign up
        const firstName = userData.fullName?.split(' ')[0] || 'there';
        const roleDisplayName = userData.role === 'expert' ? 'Research Expert' : 
                               userData.role === 'aid' ? 'Research Aid' : 'Student';
        
        toast({
          title: `Welcome, ${firstName}!`,
          description: `Your ${roleDisplayName} account has been created successfully. Please check your email for verification.`,
        });
        
        return { success: true };
      }

      return {
        success: false,
        error: 'Signup failed. Please try again.'
      };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        variant: "destructive",
        title: "Sign Out Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
