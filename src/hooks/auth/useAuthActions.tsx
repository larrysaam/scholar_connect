
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RateLimiter, validateEmail, validatePassword } from '@/utils/security';
import { useToast } from '@/components/ui/use-toast';

// Rate limiters for different operations
const signInLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
const signUpLimiter = new RateLimiter(3, 60 * 60 * 1000); // 3 attempts per hour

export const useAuthActions = () => {
  const { toast } = useToast();

  const signIn = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const clientIP = 'user-ip'; // In a real app, you'd get the actual IP
    
    // Check rate limiting
    if (!signInLimiter.isAllowed(clientIP)) {
      const remainingTime = Math.ceil(signInLimiter.getRemainingTime(clientIP) / 1000 / 60);
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
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
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
    signIn,
    signUp,
    signOut
  };
};
