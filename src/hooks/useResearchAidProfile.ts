import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface ResearchAidEducation {
  degree: string;
  institution: string;
  year: string;
}

export interface ResearchAidExperience {
  position: string;
  institution: string;
  period: string;
}

export interface ResearchAidPublication {
  title: string;
  journal: string;
  year: string;
  citations: number;
}

export interface ResearchAidAward {
  title: string;
  year: string;
}

export interface ResearchAidScholarship {
  title: string;
  period: string;
}

// Reviews removed as requested

export interface ResearchAidProfileData {
  // Basic user info (from users table)
  id: string;
  name: string;
  email: string;
  role: string;
  imageUrl: string; // From users.avatar_url
  
  // From research_aid_profiles table
  profileId?: string; // The actual profile record ID
  bio?: string;
  title?: string;
  job_title?: string;
  location?: string; // Maps to users.country
  skills?: string[]; // Maps to expertise text[]
  hourly_rate: number;
  availability?: any; // JSONB field
  rating: number;
  total_consultations_completed: number;
  is_verified: boolean;  created_at: string;
  updated_at: string;
  verifications?: any; // JSONB field
  
  // JSONB fields parsed as arrays
  educational_background: ResearchAidEducation[];
  work_experience: ResearchAidExperience[];
  awards: ResearchAidAward[];
  publications: ResearchAidPublication[];
  scholarships: ResearchAidScholarship[];
    // Text array fields
  affiliations?: string[];
  languages: string[]; // From users.languages
  
  // Computed/additional fields
  studentsSupervised: number;
  totalEarnings?: number;
}

export const useResearchAidProfile = (userId: string) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<ResearchAidProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);

  // Helper function to safely parse JSONB fields
  const parseJsonField = <T>(val: any): T[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val as T[];
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };
  // Helper function to safely parse text array fields
  const parseTextArrayField = (val: any): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      // Handle PostgreSQL array format like {item1,item2}
      if (val.startsWith('{') && val.endsWith('}')) {
        return val.slice(1, -1).split(',').filter(Boolean);
      }
      return [val];
    }
    return [];
  };

  // Calculate total jobs completed from both job applications and service bookings
  const calculateJobsCompleted = async (providerId: string): Promise<number> => {
    try {
      // Count accepted job applications where this user is the applicant
      const { count: acceptedApplications, error: applicationsError } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true })
        .eq('applicant_id', providerId)
        .eq('status', 'accepted');

      if (applicationsError) {
        console.error('Error fetching job applications:', applicationsError);
      }

      // Count completed service bookings where this user is the provider
      const { count: completedBookings, error: bookingsError } = await supabase
        .from('service_bookings')
        .select('*', { count: 'exact', head: true })
        .eq('provider_id', providerId)
        .eq('status', 'completed');

      if (bookingsError) {
        console.error('Error fetching service bookings:', bookingsError);
      }

      return (acceptedApplications || 0) + (completedBookings || 0);
    } catch (error) {
      console.error('Error calculating jobs completed:', error);
      return 0;
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch basic user info
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, email, role, avatar_url, languages, country')
        .eq('id', userId)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        setError('User not found');
        return;
      }

      if (!userData) {
        setError('User not found');
        setLoading(false);
        return;
      }      // Fetch research aid profile
      const { data: profileData, error: profileError } = await supabase
        .from('research_aid_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('Research aid profile fetch result:', { profileData, profileError });

      let researchAidProfile = profileData;
      let currentProfileId = profileData?.id;

      // If no profile exists, create a default one
      if (profileError && profileError.code === 'PGRST116') {
        console.log('Creating new research aid profile for user:', userId);
        const { data: authUserData } = await supabase.auth.getUser();
        const currentUserId = authUserData?.user?.id;
        
        if (currentUserId && currentUserId === userId) {          const defaultProfile = {
            id: userId, // Primary key that references users(id)
            bio: 'Experienced research professional ready to help with your academic needs.',
            title: 'Research Expert',
            job_title: 'Senior Research Consultant',
            location: userData.country || '',
            expertise: ['Research Methodology', 'Data Analysis', 'Academic Writing'],
            skills: ['Research Methodology', 'Data Analysis', 'Academic Writing'],
            hourly_rate: 50,
            availability: { 
              monday: ['09:00-17:00'], 
              tuesday: ['09:00-17:00'], 
              wednesday: ['09:00-17:00'], 
              thursday: ['09:00-17:00'], 
              friday: ['09:00-17:00'] 
            },
            rating: 4.8,
            total_consultations_completed: 0,
            is_verified: false,
            educational_background: [
              {
                degree: 'Ph.D. in Research Methodology',
                institution: 'University of Excellence',
                year: '2020'
              }
            ],
            work_experience: [
              {
                position: 'Research Consultant',
                institution: 'Academic Solutions Inc.',
                period: '2020-Present'
              }
            ],
            awards: [
              {
                title: 'Excellence in Research Award',
                year: '2021'
              }
            ],
            publications: [
              {
                title: 'Advanced Research Methodologies',
                journal: 'Journal of Academic Research',
                year: '2022',
                citations: 45
              }
            ],
            scholarships: [
              {
                title: 'Research Excellence Fellowship',
                period: '2019-2020'
              }
            ],
            affiliations: ['International Research Association', 'Academic Professionals Network'],
            verifications: { 
              education: true, 
              identity: true, 
              expertise: false 
            }
          };const { data: newProfile, error: createError } = await supabase
            .from('research_aid_profiles')
            .insert(defaultProfile)
            .select('*')
            .single();

          if (createError) {
            console.error('Error creating research aid profile:', createError);
            setError('Failed to create profile');
            return;
          } else {
            researchAidProfile = newProfile;
            currentProfileId = newProfile.id;
          }
        } else {
          setError('Unauthorized to create profile');
          return;
        }
      } else if (profileError) {
        console.error('Error fetching research aid profile:', profileError);
        setError('Failed to load profile');
        return;
      }      setProfileId(currentProfileId);

      // Calculate actual jobs completed from both tables
      const jobsCompleted = await calculateJobsCompleted(userId);

      // Fetch number of students supervised (bookings count)
      const { count: studentsSupervised, error: bookingsError } = await supabase
        .from('service_bookings')
        .select('id', { count: 'exact', head: true })
        .eq('provider_id', userId);
      
      if (bookingsError) {
        console.error('Error fetching studentsSupervised:', bookingsError);
      }      // Calculate total earnings from completed bookings
      const { data: completedBookings, error: earningsError } = await supabase
        .from('service_bookings')
        .select('total_price')
        .eq('provider_id', userId)
        .eq('status', 'completed');      let totalEarnings = 0;
      if (!earningsError && completedBookings) {
        totalEarnings = completedBookings.reduce((sum, booking) => sum + (booking.total_price || 0), 0);
      }

      // Transform data to match component interface
      const transformedProfile: ResearchAidProfileData = {
        // Basic user info
        id: userData.id,
        name: userData.name || 'Unknown Research Aid',
        email: userData.email,
        role: userData.role,
        imageUrl: userData.avatar_url || '/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png',        // Profile info
        profileId: currentProfileId,
        bio: researchAidProfile?.bio || '',
        title: researchAidProfile?.title || '',
        job_title: researchAidProfile?.job_title || '',
        location: researchAidProfile?.location || userData.country || '',
        skills: parseTextArrayField(researchAidProfile?.skills) || parseTextArrayField(researchAidProfile?.expertise) || [],
        hourly_rate: researchAidProfile?.hourly_rate || 0,        availability: researchAidProfile?.availability || {},
        rating: researchAidProfile?.rating || 0,
        total_consultations_completed: jobsCompleted, // Use calculated jobs completed from both tables
        is_verified: researchAidProfile?.is_verified || false,
        created_at: researchAidProfile?.created_at || new Date().toISOString(),
        updated_at: researchAidProfile?.updated_at || new Date().toISOString(),
        verifications: researchAidProfile?.verifications || {},

          // JSONB fields
        educational_background: parseJsonField<ResearchAidEducation>(researchAidProfile?.educational_background),
        work_experience: parseJsonField<ResearchAidExperience>(researchAidProfile?.work_experience),
        awards: parseJsonField<ResearchAidAward>(researchAidProfile?.awards),
        publications: parseJsonField<ResearchAidPublication>(researchAidProfile?.publications),
        scholarships: parseJsonField<ResearchAidScholarship>(researchAidProfile?.scholarships),
        
        // Text array fields
        affiliations: parseTextArrayField(researchAidProfile?.affiliations),
        languages: parseTextArrayField(userData.languages),
        
        // Computed fields
        studentsSupervised: studentsSupervised || 0,
        totalEarnings: totalEarnings
      };

      setProfile(transformedProfile);
    } catch (error) {
      console.error('Error fetching research aid profile:', error);
      setError('An unexpected error occurred');
      toast({
        title: "Error",
        description: "Failed to load research aid profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<ResearchAidProfileData>) => {
    if (!profile || !profileId) return false;

    const dbUpdates: Record<string, any> = { ...updates };    // Remove fields not in research_aid_profiles schema or handled separately
    delete dbUpdates.id;
    delete dbUpdates.profileId;
    delete dbUpdates.name;
    delete dbUpdates.email;
    delete dbUpdates.role;
    delete dbUpdates.imageUrl;
    delete dbUpdates.languages; // This is stored in users.languages
    delete dbUpdates.studentsSupervised;
    delete dbUpdates.totalEarnings;

    // Map UI fields to database fields
    if (updates.skills !== undefined) {
      // Update both skills and expertise fields
      dbUpdates.skills = updates.skills;
      dbUpdates.expertise = updates.skills;
    }// Stringify JSONB fields (field names match research_aid_profiles table)
    if (dbUpdates.educational_background !== undefined) {
      dbUpdates.educational_background = JSON.stringify(dbUpdates.educational_background);
    }
    if (dbUpdates.work_experience !== undefined) {
      dbUpdates.work_experience = JSON.stringify(dbUpdates.work_experience);
    }
    if (dbUpdates.publications !== undefined) {
      dbUpdates.publications = JSON.stringify(dbUpdates.publications);
    }
    if (dbUpdates.awards !== undefined) {
      dbUpdates.awards = JSON.stringify(dbUpdates.awards);
    }
    if (dbUpdates.scholarships !== undefined) {
      dbUpdates.scholarships = JSON.stringify(dbUpdates.scholarships);
    }
    if (dbUpdates.availability !== undefined) {
      dbUpdates.availability = JSON.stringify(dbUpdates.availability);
    }
    if (dbUpdates.verifications !== undefined) {
      dbUpdates.verifications = JSON.stringify(dbUpdates.verifications);
    }

    // Ensure numeric fields are properly typed
    if (dbUpdates.hourly_rate !== undefined && dbUpdates.hourly_rate !== null) {
      dbUpdates.hourly_rate = Number(dbUpdates.hourly_rate);
    }
    if (dbUpdates.rating !== undefined && dbUpdates.rating !== null) {
      dbUpdates.rating = Number(dbUpdates.rating);
    }

    try {      const { error } = await supabase
        .from('research_aid_profiles')
        .update({
          ...dbUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', profileId);

      if (error) {
        console.error('Error updating research aid profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive"
        });
        return false;
      }      // Handle updates to user table fields
      const userUpdates: Record<string, any> = {};
      if (updates.languages !== undefined) {
        userUpdates.languages = updates.languages;
      }

      if (Object.keys(userUpdates).length > 0) {
        const { error: userError } = await supabase
          .from('users')
          .update(userUpdates)
          .eq('id', userId);

        if (userError) {
          console.error('Error updating user data:', userError);
        }
      }

      // Refresh the profile data
      await fetchProfile();
      
      toast({
        title: "Success",
        description: "Profile updated successfully!"
      });
      return true;
    } catch (error) {
      console.error('Error updating research aid profile:', error);
      return false;
    }
  };
  // Reviews functionality removed as requested

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);
  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile
  };
};
