
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/signup';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event !== 'SIGNED_OUT') {
          // Fetch user profile
          setTimeout(async () => {
            try {
              const { data: profileData, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (error) {
                console.error('Error fetching profile:', error);
              } else if (mounted) {
                setProfile(profileData);
              }
            } catch (error) {
              console.error('Profile fetch error:', error);
            } finally {
              if (mounted) {
                setLoading(false);
              }
            }
          }, 0);
        } else {
          setProfile(null);
          if (mounted) {
            setLoading(false);
          }
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(async () => {
          try {
            const { data: profileData } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (mounted) {
              setProfile(profileData);
            }
          } catch (error) {
            console.error('Error fetching profile:', error);
          } finally {
            if (mounted) {
              setLoading(false);
            }
          }
        }, 0);
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
        console.warn('Failed login attempt:', { email: email.toLowerCase(), error: error.message });
        return {
          success: false,
          error: error.message === 'Invalid login credentials' 
            ? 'Invalid email or password. Please check your credentials and try again.'
            : error.message
        };
      }

      if (data.user) {
        console.log('Successful login:', { userId: data.user.id, email: data.user.email });
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
      console.log('Starting signup with data:', userData);
      
      // Clean and format the user data
      const cleanedData = {
        fullName: userData.fullName,
        role: userData.role || 'student',
        phoneNumber: userData.phoneNumber,
        country: userData.country,
        universityInstitution: userData.universityInstitution,
        fieldOfStudy: userData.fieldOfStudy,
        levelOfStudy: userData.levelOfStudy,
        sex: userData.sex,
        dateOfBirth: userData.dateOfBirth,
        researchTopic: userData.researchTopic,
        researchStage: userData.researchStage,
        academicRank: userData.academicRank || null,
        highestEducation: userData.highestEducation || null,
        linkedinAccount: userData.linkedinAccount || null,
        researchgateAccount: userData.researchgateAccount || null,
        academiaEduAccount: userData.academiaEduAccount || null,
        orcidId: userData.orcidId || null,
        preferredLanguage: userData.preferredLanguage || null,
        fieldsOfExpertise: userData.fieldsOfExpertise || null
      };

      console.log('Cleaned data for signup:', cleanedData);

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: cleanedData
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
        console.log('Successful signup:', { userId: data.user.id, email: data.user.email });
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
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      loading,
      signIn,
      signUp,
      signOut,
    }}>
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
