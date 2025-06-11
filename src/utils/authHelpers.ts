
import { supabase } from "@/integrations/supabase/client";
import { sanitizeInput, validateEmail } from "@/utils/security";

export interface SecureSignUpData {
  email: string;
  password: string;
  fullName: string;
  role: 'student' | 'expert' | 'aid' | 'admin';
  phoneNumber?: string;
  country?: string;
  institution?: string;
}

export const secureSignUp = async (data: SecureSignUpData) => {
  // Sanitize all inputs
  const sanitizedData = {
    email: sanitizeInput(data.email.toLowerCase().trim()),
    password: data.password, // Don't sanitize password as it might remove valid special chars
    fullName: sanitizeInput(data.fullName),
    role: data.role,
    phoneNumber: data.phoneNumber ? sanitizeInput(data.phoneNumber) : undefined,
    country: data.country ? sanitizeInput(data.country) : undefined,
    institution: data.institution ? sanitizeInput(data.institution) : undefined,
  };

  // Validate email
  if (!validateEmail(sanitizedData.email)) {
    return {
      success: false,
      error: "Please enter a valid email address."
    };
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: sanitizedData.email,
      password: sanitizedData.password,
      options: {
        data: {
          fullName: sanitizedData.fullName,
          role: sanitizedData.role
        },
        emailRedirectTo: `${window.location.origin}/auth`
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return {
        success: false,
        error: authError.message
      };
    }

    return {
      success: true,
      data: authData
    };
  } catch (error: any) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: "An unexpected error occurred during registration."
    };
  }
};

export const secureSignIn = async (email: string, password: string) => {
  const sanitizedEmail = sanitizeInput(email.toLowerCase().trim());

  if (!validateEmail(sanitizedEmail)) {
    return {
      success: false,
      error: "Please enter a valid email address."
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: sanitizedEmail,
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

    return {
      success: true,
      data: data
    };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: "An unexpected error occurred during sign in."
    };
  }
};
