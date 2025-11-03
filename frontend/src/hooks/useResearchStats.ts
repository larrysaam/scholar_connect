import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ResearchStats {
  researchers: {
    total: number;
    fields: number;
    rating: number;
  };
  aids: {
    total: number;
    specialties: number;
    rating: number;
  };
}

export const useResearchStats = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ResearchStats>({
    researchers: {
      total: 0,
      fields: 0,
      rating: 0
    },
    aids: {
      total: 0,
      specialties: 0,
      rating: 0
    }
  });
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1. Fetch researchers count
        const { count: researcherCount, error: researcherCountError } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'expert');

        if (researcherCountError) throw researcherCountError;

        // 2. Fetch researchers' expertise to count unique fields
        const { data: researcherExpertise, error: researcherExpertiseError } = await supabase
          .from('users')
          .select('expertise')
          .eq('role', 'expert');

        if (researcherExpertiseError) throw researcherExpertiseError;

        // 3. Fetch research aids count  
        const { count: aidsCount, error: aidsCountError } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'aid');

        if (aidsCountError) throw aidsCountError;

        // 4. Fetch research aids' expertise to count unique specialties
        const { data: aidsExpertise, error: aidsExpertiseError } = await supabase
          .from('users')
          .select('expertise')
          .eq('role', 'aid');

        if (aidsExpertiseError) throw aidsExpertiseError;

        // 5. Get researcher ratings from researcher_profiles
        const { data: researcherProfiles, error: researcherProfilesError } = await supabase
          .from('researcher_profiles')
          .select('rating')
          .not('rating', 'is', null);

        if (researcherProfilesError) throw researcherProfilesError;

        // 6. Get research aid ratings from research_aid_profiles
        const { data: aidProfiles, error: aidProfilesError } = await supabase
          .from('research_aid_profiles')
          .select('rating')
          .not('rating', 'is', null);

        if (aidProfilesError) throw aidProfilesError;

        // Calculate unique research fields from researchers
        const researcherFields = new Set<string>();
        researcherExpertise?.forEach(researcher => {
          if (Array.isArray(researcher.expertise)) {
            researcher.expertise.forEach(field => researcherFields.add(field));
          }
        });

        // Calculate unique specialties from research aids
        const aidSpecialties = new Set<string>();
        aidsExpertise?.forEach(aid => {
          if (Array.isArray(aid.expertise)) {
            aid.expertise.forEach(specialty => aidSpecialties.add(specialty));
          }
        });

        // Calculate average ratings
        const avgResearcherRating = researcherProfiles?.length 
          ? researcherProfiles.reduce((sum, p) => sum + (p.rating || 0), 0) / researcherProfiles.length 
          : 4.8; // Default fallback

        const avgAidRating = aidProfiles?.length 
          ? aidProfiles.reduce((sum, p) => sum + (p.rating || 0), 0) / aidProfiles.length 
          : 4.7; // Default fallback

        setStats({
          researchers: {
            total: researcherCount || 0,
            fields: researcherFields.size,
            rating: Number(avgResearcherRating.toFixed(1))
          },
          aids: {
            total: aidsCount || 0,
            specialties: aidSpecialties.size,
            rating: Number(avgAidRating.toFixed(1))
          }
        });
      } catch (error) {
        console.error('Error fetching research stats:', error);
        // Set fallback values on error
        setStats({
          researchers: {
            total: 0,
            fields: 0,
            rating: 4.8
          },
          aids: {
            total: 0,
            specialties: 0,
            rating: 4.7
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
};
