import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RateLimiter, validateEmail, validatePassword } from '@/utils/security';
import { useToast } from '@/components/ui/use-toast';

// Rate limiters for different operations
const signInLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
const signUpLimiter = new RateLimiter(10, 60 * 60 * 1000); // 3 attempts per hour

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
        
        // Create comprehensive user profile in public.users table
        try {
          console.log('Creating user profile for:', data.user.id);
          console.log('User data received:', userData);
          
          const userProfile = {
            id: data.user.id,
            email: data.user.email,
            name: userData.fullName || userData.name || data.user.email?.split('@')[0],
            role: userData.role || 'student',
            phone_number: userData.phoneNumber || null,
            country: userData.country || null,
            date_of_birth: userData.dateOfBirth || null,
            sex: userData.sex || null,
            institution: userData.universityInstitution || userData.university || userData.institution || null,
            faculty: userData.faculty || null,
            study_level: userData.highestEducation || userData.studyLevel || null,
            topic_title: userData.researchTopic || userData.topicTitle || null,
            research_stage: userData.researchStage || null,
            research_areas: userData.researchAreas || (userData.fieldOfStudy ? [userData.fieldOfStudy] : null),
            experience: userData.academicRank || userData.experience || null,
            expertise: userData.fieldOfExpertise ? [userData.fieldOfExpertise] : (userData.expertise || null),
            other_expertise: userData.otherFieldOfExpertise || userData.otherExpertise || null,
            languages: userData.preferredLanguage ? [userData.preferredLanguage] : (userData.languages || null),
            linkedin_url: userData.linkedinAccount || userData.linkedInUrl || null,
            preferred_payout_method: userData.preferredPayoutMethod || null,
            wallet_balance: 0
          };

          // Remove undefined values
          Object.keys(userProfile).forEach(key => {
            if (userProfile[key as keyof typeof userProfile] === undefined) {
              delete userProfile[key as keyof typeof userProfile];
            }
          });

          console.log('Final user profile to insert:', userProfile);

          const { data: insertedData, error: profileError } = await supabase
            .from('users')
            .insert(userProfile)
            .select();

          if (profileError) {
            console.error('Error creating user profile:', profileError);
            console.error('Profile error details:', {
              message: profileError.message,
              details: profileError.details,
              hint: profileError.hint,
              code: profileError.code
            });
            
            // Show detailed error to user for debugging
            toast({
              title: "Profile Creation Error",
              description: `Failed to create profile: ${profileError.message}. Please contact support.`,
              variant: "destructive"
            });
            
            // Return error since profile creation is critical
            return {
              success: false,
              error: `Profile creation failed: ${profileError.message}`
            };
          } else {
            console.log('User profile created successfully:', insertedData);
            
            // Create researcher profile if role is expert or aid
            if (userData.role === 'expert' || userData.role === 'aid') {
              try {
                // Choose the correct table based on role
                const tableName = userData.role === 'expert' ? 'researcher_profiles' : 'research_aid_profiles';
                const idField = userData.role === 'expert' ? 'user_id' : 'id';

                 var profileData = {};

                if(userData.role === 'expert' ) {
                   profileData = {
                    [idField]: data.user.id,
                    subtitle: userData.subtitle || null,
                    title: userData.academicRank || 'Research Expert',
                  
                  };
                }else if(userData.role === 'aid') {
                   profileData = {
                    [idField]: data.user.id,
                    title: userData.subtitle || '',
                  
                  };
                }

               

                const { data: profileResult, error: profileError } = await supabase
                  .from(tableName)
                  .insert(profileData)
                  .select();

                if (profileError) {
                  console.error(`Error creating ${userData.role} profile:`, profileError);
                  // Don't fail the signup if profile creation fails
                  console.warn('Continuing with signup despite profile creation error');
                } else {
                  console.log(`${userData.role} profile created successfully:`, profileResult);
                }
              } catch (profileError) {
                console.error(`Exception creating ${userData.role} profile:`, profileError);
                // Don't fail the signup if profile creation fails
                console.warn('Continuing with signup despite profile creation error');
              }
            }

            // Create default consultation service for experts
            if (userData.role === 'expert' && userData.consultationPrice) {
              try {
                const consultationService = {
                  user_id: data.user.id,
                  category: 'General Consultation',
                  title: 'General Consultation',
                  description: 'General research consultation and academic guidance',
                  duration_minutes: 60,
                  is_active: true
                };

                const { data: serviceData, error: serviceError } = await supabase
                  .from('consultation_services')
                  .insert(consultationService)
                  .select();

                if (serviceError) {
                  console.error('Error creating consultation service:', serviceError);
                  // Don't fail the signup if service creation fails
                  console.warn('Continuing with signup despite consultation service creation error');
                } else {
                  console.log('Consultation service created successfully:', serviceData);
                  
                  // Create pricing for all academic levels
                  try {
                    const serviceId = serviceData[0].id;
                    const pricingEntries = [
                      {
                        service_id: serviceId,
                        academic_level: 'Undergraduate',
                        price: parseFloat(userData.consultationPrice),
                        currency: 'XAF'
                      },
                      {
                        service_id: serviceId,
                        academic_level: 'Masters',
                        price: parseFloat(userData.consultationPrice),
                        currency: 'XAF'
                      },
                      {
                        service_id: serviceId,
                        academic_level: 'PhD',
                        price: parseFloat(userData.consultationPrice),
                        currency: 'XAF'
                      },
                      {
                        service_id: serviceId,
                        academic_level: 'Postdoc',
                        price: parseFloat(userData.consultationPrice),
                        currency: 'XAF'
                      }
                    ];

                    const { data: pricingData, error: pricingError } = await supabase
                      .from('service_pricing')
                      .insert(pricingEntries)
                      .select();

                    if (pricingError) {
                      console.error('Error creating service pricing:', pricingError);
                      // Don't fail the signup if pricing creation fails
                      console.warn('Continuing with signup despite pricing creation error');
                    } else {
                      console.log('Service pricing created successfully:', pricingData);
                    }
                  } catch (pricingError) {
                    console.error('Exception creating service pricing:', pricingError);
                    // Don't fail the signup if pricing creation fails
                    console.warn('Continuing with signup despite pricing creation error');
                  }
                }
              } catch (serviceError) {
                console.error('Exception creating consultation service:', serviceError);
                // Don't fail the signup if service creation fails
                console.warn('Continuing with signup despite consultation service creation error');
              }
            }
            
            toast({
              title: "Success",
              description: "Account and profile created successfully!",
              variant: "default"
            });
          }
        } catch (profileError) {
          console.error('Exception creating user profile:', profileError);
          return {
            success: false,
            error: `Profile creation failed: ${profileError}`
          };
        }
        
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
  }, [toast]);

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
