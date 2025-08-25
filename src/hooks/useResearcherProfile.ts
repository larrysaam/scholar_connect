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
  // Basic user info
  id: string;
  name: string;
  email: string;
  role: string;
  institution: string;
  faculty?: string;
  study_level?: string;
  experience?: string;
  expertise?: string[];
  other_expertise?: string;
  languages?: string[];
  linkedin_url?: string;
  country?: string;
  phone_number?: string;
  
  // Extended profile info
  title?: string;
  subtitle?: string;
  department?: string;
  years_experience: number;
  students_supervised: number;
  hourly_rate: number;
  response_time: string;
  is_online: boolean;
  online_status: 'online' | 'offline' | 'busy' | 'away';
  bio?: string;
  research_interests?: string[];
  specialties?: string[];
  education: ResearcherEducation[];
  experience_history: ResearcherExperience[];
  publications: ResearcherPublication[];
  awards: ResearcherAward[];
  fellowships: ResearcherFellowship[];
  grants: ResearcherGrant[];
  memberships?: string[];
  supervision: ResearcherSupervision[];
  available_times: any[];
  verifications: {
    academic: 'pending' | 'verified' | 'rejected';
    identity?: {
      documents: {
        status: 'pending' | 'verified' | 'rejected';
        fileUrl: string;
        fileName: string;
        uploadedAt: string;
        documentType: string;
      }[];
    };
    education?: {
      documents: {
        status: 'pending' | 'verified' | 'rejected';
        fileUrl: string;
        fileName: string;
        uploadedAt: string;
        documentType: string;
      }[];
    };
    employment?: {
      documents: {
        status: 'pending' | 'verified' | 'rejected';
        fileUrl: string;
        fileName: string;
        uploadedAt: string;
        documentType: string;
      }[];
    };
    publication: 'pending' | 'verified' | 'rejected';
    publications?: { // Note: This is 'publications' for the documents, while 'publication' is for the overall status
      documents: {
        status: 'pending' | 'verified' | 'rejected';
        fileUrl: string;
        fileName: string;
        uploadedAt: string;
        documentType: string;
      }[];
    };
    institutional: 'pending' | 'verified' | 'rejected';
  };
  rating: number;
  total_reviews: number;
  profile_visibility: 'public' | 'private' | 'limited';
  show_contact_info: boolean;
  show_hourly_rate: boolean;
  
  // Reviews
  reviews: ResearcherReview[];
  
  // Computed fields for compatibility
  affiliation: string;
  location: string;
  totalReviews: number;
  studentsSupervised: number;
  yearsExperience: number;
  imageUrl: string;
  isOnline: boolean;
  responseTime: string;
  field: string;
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
        .select('*')
        .eq('id', researcherId)
        .eq('role', 'expert')
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        setError('Researcher not found');
        return;
      }

      if (!userData) {
        setError('Researcher not found');
        return;
      }

      // Fetch extended profile info
      const { data: profileData, error: profileError } = await supabase
        .from('researcher_profiles')
        .select('*, subtitle')
        .eq('user_id', researcherId)
        .single();

      // If no profile exists, create a default one
      let profile = profileData;
      if (profileError && profileError.code === 'PGRST116') {
        // Only try to create a profile if the user is authenticated and is the owner
        const { data: authUserData } = await supabase.auth.getUser();
        const userId = authUserData?.user?.id;
        if (userId && userId === researcherId) {
          const { data: newProfile, error: createError } = await supabase
            .from('researcher_profiles')
            .insert({
              user_id: researcherId,
              title: userData.experience || 'Research Expert',
              subtitle: 'Dr.', // Added this line
              bio: 'Experienced researcher ready to help with your academic projects.',
              research_interests: userData.expertise || [],
              specialties: userData.expertise || [],
              education: [],
              experience: [],
              publications: [],
              awards: [],
              fellowships: [],
              grants: [],
              memberships: [],
              supervision: [],
              available_times: []
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
          } else {
            profile = newProfile;
          }
        } else {
          // Not authenticated or not the owner, do not attempt to create
          profile = null;
        }
      }

      // Fetch reviews
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

      // Fetch supervised students count
      const { count: studentsSupervisedCount, error: supervisedStudentsError } = await supabase
        .from('service_bookings')
        .select('client_id', { count: 'exact', head: true })
        .eq('provider_id', researcherId)
        .in('status', ['completed', 'confirmed']);

      if (supervisedStudentsError) {
        console.error('Error fetching supervised students count:', supervisedStudentsError);
      }

      // Transform data to match component interface
      const transformedResearcher: ResearcherProfileData = {
        // Basic user info
        id: userData.id,
        name: userData.name || 'Unknown Researcher',
        email: userData.email,
        role: userData.role,
        institution: userData.institution || 'Institution not specified',
        faculty: userData.faculty,
        study_level: userData.study_level,
        experience: userData.experience,
        expertise: userData.expertise || [],
        other_expertise: userData.other_expertise,
        languages: userData.languages || ['English'],
        linkedin_url: userData.linkedin_url,
        country: userData.country || 'Location not specified',
        phone_number: userData.phone_number,
        
        // Extended profile info
        title: profile?.title || userData.experience || 'Research Expert',
        subtitle: profile?.subtitle || 'Dr.', // Added this line
        department: profile?.department,
        years_experience: profile?.years_experience || 0,
        students_supervised: studentsSupervisedCount || 0,
        hourly_rate: profile?.hourly_rate || 15000,
        response_time: profile?.response_time || 'Usually responds within 24 hours',
        is_online: profile?.is_online || false,
        online_status: profile?.online_status || 'offline',
        bio: profile?.bio || 'Experienced researcher ready to help with your academic projects.',
        research_interests: profile?.research_interests || userData.expertise || [],
        specialties: profile?.specialties || userData.expertise || [],
        education: profile?.education || [],
        experience_history: profile?.experience || [],
        publications: profile?.publications || [],
        awards: profile?.awards || [],
        fellowships: profile?.fellowships || [],
        grants: profile?.grants || [],
        memberships: profile?.memberships || [],
        supervision: profile?.supervision || [],
        available_times: profile?.available_times || [],
        verifications: profile?.verifications || {
          academic: 'pending',
          publication: 'pending',
          institutional: 'pending'
        },
        rating: profile?.rating || 0,
        total_reviews: profile?.total_reviews || 0,
        profile_visibility: profile?.profile_visibility || 'public',
        show_contact_info: profile?.show_contact_info ?? true,
        show_hourly_rate: profile?.show_hourly_rate ?? true,
        
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
        affiliation: userData.institution || 'Institution not specified',
        location: userData.country || 'Location not specified',
        totalReviews: profile?.total_reviews || 0,
        studentsSupervised: studentsSupervisedCount || 0,
        yearsExperience: profile?.years_experience || 0,
        imageUrl: userData.avatar_url || '/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png',
        isOnline: profile?.is_online || false,
        responseTime: profile?.response_time || 'Usually responds within 24 hours',
        field: userData.expertise?.[0] || 'General Research'
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

    const dbUpdates = { ...updates };
    if (dbUpdates.experience_history !== undefined) {
      dbUpdates.experience = dbUpdates.experience_history;
      delete dbUpdates.experience_history;
    }

    try {
      const { error } = await supabase
        .from('researcher_profiles')
        .update({
          ...dbUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', researcherId);

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