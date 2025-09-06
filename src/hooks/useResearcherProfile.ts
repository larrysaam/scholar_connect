import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface ResearcherEducation {
  degree: string;
  institution: string;
  year: string;
}

export interface ResearcherExperience {
  position: string;
  institution: string;
  period: string;
}

export interface ResearcherPublication {
  title: string;
  journal: string;
  year: string;
  citations: number;
}

export interface ResearcherAward {
  title: string;
  year: string;
}

export interface ResearcherFellowship {
  title: string;
  period: string;
}

export interface ResearcherGrant {
  title: string;
  amount: string;
  period: string;
}

export interface ResearcherSupervision {
  type: string;
  count: number;
}

export interface ResearcherReview {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
  service_type?: string;
  collaboration_type?: string;
}

export interface ResearcherProfileData {
  // Basic user info (from users table, but essential for profile)
  id: string;
  name: string;
  email: string;
  role: string;
  
  // From research_aid_profiles table
  bio?: string;
  skills?: string[]; // maps to expertise
  hourly_rate: number;
  availability?: any; // maps to availability jsonb
  rating: number;
  total_consultations_completed: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  verifications?: any; // maps to verifications jsonb
  title?: string;
  job_title?: string;
  location?: string;
  education_summary?: string; // This is text in schema, but component uses educational_background
  educational_background: ResearcherEducation[]; // maps to educational_background jsonb
  work_experience: ResearcherExperience[]; // maps to work_experience jsonb
  awards: ResearcherAward[]; // maps to awards jsonb
  publications: ResearcherPublication[]; // maps to publications jsonb
  scholarships: ResearcherFellowship[]; // maps to scholarships jsonb
  affiliations?: string[]; // maps to affiliations text[]

  // Reviews (from research_aid_reviews table)
  reviews: ResearcherReview[];

  // Computed fields for compatibility (these will be removed or re-evaluated)
  imageUrl: string; // From users table
}

export const useResearcherProfile = (researcherId: string) => {
  const { toast } = useToast();
  const [researcher, setResearcher] = useState<ResearcherProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResearcherProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch basic user info
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, email, role, avatar_url')
        .eq('id', researcherId)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        setError('Researcher not found');
        return;
      }

      // Defensive check: userData may be an error object if the query failed
      if (!userData || typeof userData !== 'object' || !('id' in userData)) {
        setError('Researcher not found');
        setLoading(false);
        return;
      }

      // Fetch extended profile info from research_aid_profiles
      const { data: profileData, error: profileError } = await supabase
        .from('research_aid_profiles')
        .select(
          `id, bio, expertise, hourly_rate, availability, rating, total_consultations_completed, is_verified, created_at, updated_at, verifications, title, job_title, location, education_summary, skills, educational_background, work_experience, awards, publications, scholarships, affiliations`
        )
        .eq('id', researcherId)
        .single();

      console.log('Profile data fetch result:', { profileData, profileError });

      // If no profile exists, create a default one
      let profile = profileData;
      if (profileError && profileError.code === 'PGRST116') {
        console.log('Attempting to create new profile for user:', researcherId);
        const { data: authUserData } = await supabase.auth.getUser();
        const userId = authUserData?.user?.id;
        if (userId && userId === researcherId) {
          const { data: newProfile, error: createError } = await supabase
            .from('research_aid_profiles')
            .insert({
              id: researcherId,
              title: 'Research Expert',
              job_title: 'Dr.',
              bio: 'Experienced researcher ready to help with your academic projects.',
              expertise: [],
              hourly_rate: 0,
              availability: {},
              rating: 0,
              total_consultations_completed: 0,
              is_verified: false,
              verifications: {},
              location: '',
              education_summary: '',
              skills: [],
              educational_background: [],
              work_experience: [],
              awards: [],
              publications: [],
              scholarships: [],
              affiliations: [],
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
          } else {
            console.log('New profile created successfully:', newProfile);
            profile = newProfile;
          }
        } else {
          console.log('Not authenticated or not owner, skipping profile creation.');
          profile = null;
        }
      }

      // Fetch reviews (assuming reviews are still desired)
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('researcher_reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          service_type,
          collaboration_type,
          reviewer:users!reviewer_id(name)
        `)
        .eq('researcher_id', researcherId)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
      }

      // Parse JSONB fields to correct types
      const parseJsonArray = <T>(val: any): T[] => {
        if (!val) return [];
        if (Array.isArray(val)) return val as T[];
        try {
          return JSON.parse(val as string) as T[];
        } catch {
          return [];
        }
      };

      // Transform data to match component interface
      const transformedResearcher: ResearcherProfileData = {
        // Basic user info
        id: userData.id,
        name: userData.name || 'Unknown Researcher',
        email: userData.email,
        role: userData.role,
        
        // From research_aid_profiles
        bio: profile?.bio || '',
        skills: profile?.skills || [], // Mapped from expertise
        hourly_rate: profile?.hourly_rate || 0,
        availability: profile?.availability || {},
        rating: profile?.rating || 0,
        total_consultations_completed: profile?.total_consultations_completed || 0,
        is_verified: profile?.is_verified || false,
        created_at: profile?.created_at || new Date().toISOString(),
        updated_at: profile?.updated_at || new Date().toISOString(),
        verifications: profile?.verifications || {},
        title: profile?.title || '',
        job_title: profile?.job_title || '',
        location: profile?.location || '',
        education_summary: profile?.education_summary || '',
        educational_background: parseJsonArray<ResearcherEducation>(profile?.educational_background),
        work_experience: parseJsonArray<ResearcherExperience>(profile?.work_experience),
        awards: parseJsonArray<ResearcherAward>(profile?.awards),
        publications: parseJsonArray<ResearcherPublication>(profile?.publications),
        scholarships: parseJsonArray<ResearcherFellowship>(profile?.scholarships),
        affiliations: profile?.affiliations || [],

        // Reviews
        reviews: (reviewsData || []).map(review => ({
          id: review.id,
          reviewer_name: review.reviewer?.name || 'Anonymous',
          rating: review.rating,
          comment: review.comment || '',
          created_at: review.created_at,
          service_type: review.service_type,
          collaboration_type: review.collaboration_type
        })),
        
        // Computed fields for compatibility
        imageUrl: userData.avatar_url || '/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png',
      };

      setResearcher(transformedResearcher);
    } catch (error) {
      console.error('Error fetching researcher profile:', error);
      setError('An unexpected error occurred');
      toast({
        title: "Error",
        description: "Failed to load researcher profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<any>) => {
    if (!researcher) return false;

    const dbUpdates: Partial<typeof updates> = { ...updates };

    // Remove fields not in research_aid_profiles schema or handled separately
    delete dbUpdates.name;
    delete dbUpdates.email;
    delete dbUpdates.role;
    delete dbUpdates.reviews;
    delete dbUpdates.imageUrl;
    // Remove languages from dbUpdates if it's not in the database schema
    if (dbUpdates.languages !== undefined) {
      delete dbUpdates.languages;
    }

    // Explicitly stringify JSONB fields if they are arrays/objects
    if (dbUpdates.educational_background !== undefined) dbUpdates.educational_background = JSON.stringify(dbUpdates.educational_background);
    if (dbUpdates.work_experience !== undefined) dbUpdates.work_experience = JSON.stringify(dbUpdates.work_experience);
    if (dbUpdates.publications !== undefined) dbUpdates.publications = JSON.stringify(dbUpdates.publications);
    if (dbUpdates.awards !== undefined) dbUpdates.awards = JSON.stringify(dbUpdates.awards);
    if (dbUpdates.scholarships !== undefined) dbUpdates.scholarships = JSON.stringify(dbUpdates.scholarships);
    // Do NOT stringify text[] fields like affiliations or skills
    // if (dbUpdates.affiliations !== undefined) dbUpdates.affiliations = JSON.stringify(dbUpdates.affiliations);
    // if (dbUpdates.skills !== undefined) dbUpdates.skills = JSON.stringify(dbUpdates.skills);
    if (dbUpdates.availability !== undefined) dbUpdates.availability = JSON.stringify(dbUpdates.availability);
    if (dbUpdates.verifications !== undefined) dbUpdates.verifications = JSON.stringify(dbUpdates.verifications);

    try {
      const { error } = await supabase
        .from('research_aid_profiles')
        .update({
          ...dbUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', researcherId);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      // Refresh the profile data
      await fetchResearcherProfile();
      
      toast({
        title: "Success",
        description: "Profile updated successfully!"
      });
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  const addReview = async (rating: number, comment: string, serviceType?: string) => {
    try {
      const { error } = await supabase
        .from('researcher_reviews')
        .insert({
          researcher_id: researcherId,
          reviewer_id: (await supabase.auth.getUser()).data.user?.id,
          rating,
          comment,
          service_type: serviceType
        });

      if (error) {
        console.error('Error adding review:', error);
        toast({
          title: "Error",
          description: "Failed to add review. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      // Refresh the profile data to get updated reviews and rating
      await fetchResearcherProfile();
      
      toast({
        title: "Success",
        description: "Review added successfully!"
      });
      return true;
    } catch (error) {
      console.error('Error adding review:', error);
      return false;
    }
  };

  useEffect(() => {
    if (researcherId) {
      fetchResearcherProfile();
    }
  }, [researcherId]);

  return {
    researcher,
    loading,
    error,
    updateProfile,
    addReview,
    refetch: fetchResearcherProfile
  };
};