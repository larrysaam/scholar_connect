import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { RateLimiter, validateEmail, validatePassword } from '@/utils/security';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'expert' | 'aid' | 'admin';
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isRateLimited: boolean;
}

// Rate limiters for different operations
const signInLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
const signUpLimiter = new RateLimiter(3, 60 * 60 * 1000); // 3 attempts per hour

export const useSecureAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const { toast } = useToast();

  // Secure session management
  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event !== 'SIGNED_OUT') {
          // Fetch user profile securely
          setTimeout(async () => {
            try {
              const { data: profileData, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (error) {
                console.error('Error fetching profile:', error);
                toast({
                  variant: "destructive",
                  title: "Profile Error",
                  description: "Failed to load user profile. Please try again.",
                });
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
  }, [toast]);

  const signIn = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const clientIP = 'user-ip'; // In a real app, you'd get the actual IP
    
    // Check rate limiting
    if (!signInLimiter.isAllowed(clientIP)) {
      const remainingTime = Math.ceil(signInLimiter.getRemainingTime(clientIP) / 1000 / 60);
      setIsRateLimited(true);
      return {
        success: false,
        error: `Too many login attempts. Please try again in ${remainingTime} minutes.`
      };
    }

    // Validate input
    if (!validateEmail(email)) {
      return {
        success: false,
        error: 'Please enter a valid email address.'
      };
    }

    if (!password || password.length < 6) {
      return {
        success: false,
        error: 'Password is required and must be at least 6 characters.'
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password,
      });

      if (error) {
        // Log security events
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
        setIsRateLimited(false);
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
  }, []);

  const signUp = useCallback(async (email: string, password: string, userData: any): Promise<{ success: boolean; error?: string }> => {
    const clientIP = 'user-ip'; // In a real app, you'd get the actual IP
    
    // Check rate limiting
    if (!signUpLimiter.isAllowed(clientIP)) {
      const remainingTime = Math.ceil(signUpLimiter.getRemainingTime(clientIP) / 1000 / 60);
      return {
        success: false,
        error: `Too many signup attempts. Please try again in ${remainingTime} minutes.`
      };
    }

    // Validate input
    if (!validateEmail(email)) {
      return {
        success: false,
        error: 'Please enter a valid email address.'
      };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        error: passwordValidation.errors[0]
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password: password,
        options: {
          data: {
            name: userData.fullName || userData.name,
            role: userData.role || 'student'
          }
        }
      });

      // Add detailed logging for debugging:
      if (error) {
        console.error('Supabase signUp error:', error);
        if (error.message) {
          // Show detailed error to user for copying
          alert("Signup error (please copy this for support):\n" + error.message);
        } else {
          alert("Signup failed with unknown error.");
        }
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
      alert("Signup error (unexpected, please copy this text for support):\n" + (error.message || error));
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      setIsRateLimited(false);
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        variant: "destructive",
        title: "Sign Out Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  }, [toast]);

  return {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isRateLimited,
  };
};
