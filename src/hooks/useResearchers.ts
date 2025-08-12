import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Researcher {
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
  created_at: string;
  updated_at: string;
  // Computed fields
  title: string;
  field: string;
  specializations: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  location: string;
  imageUrl: string;
  featured: boolean;
}

export const useResearchers = () => {
  const { toast } = useToast();
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResearchers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'expert')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching researchers:', error);
        setError('Failed to load researchers');
        toast({
          title: "Error",
          description: "Failed to load researchers. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Transform database data to match the component interface
      const transformedResearchers: Researcher[] = (data || []).map(user => ({
        id: user.id,
        name: user.name || 'Unknown Researcher',
        email: user.email,
        role: user.role,
        institution: user.institution || 'Institution not specified',
        faculty: user.faculty,
        study_level: user.study_level,
        experience: user.experience,
        expertise: user.expertise || [],
        other_expertise: user.other_expertise,
        languages: user.languages || ['English'],
        linkedin_url: user.linkedin_url,
        country: user.country || 'Location not specified',
        phone_number: user.phone_number,
        created_at: user.created_at,
        updated_at: user.updated_at,
        
        // Computed fields for compatibility with existing component
        title: user.experience || 'Research Expert',
        field: user.expertise?.[0] || 'General Research',
        specializations: user.expertise || ['Research Guidance'],
        rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
        reviewCount: Math.floor(Math.random() * 50) + 5, // Random review count 5-55
        hourlyRate: Math.floor(Math.random() * 10000) + 10000, // Random rate 10k-20k XAF
        location: user.country || 'Location not specified',
        imageUrl: '/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png', // Default avatar
        featured: Math.random() > 0.7 // 30% chance of being featured
      }));

      setResearchers(transformedResearchers);
    } catch (error) {
      console.error('Error fetching researchers:', error);
      setError('An unexpected error occurred');
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading researchers.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getResearcherById = async (id: string): Promise<Researcher | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .eq('role', 'expert')
        .single();

      if (error) {
        console.error('Error fetching researcher:', error);
        return null;
      }

      if (!data) return null;

      // Transform single researcher data
      const researcher: Researcher = {
        id: data.id,
        name: data.name || 'Unknown Researcher',
        email: data.email,
        role: data.role,
        institution: data.institution || 'Institution not specified',
        faculty: data.faculty,
        study_level: data.study_level,
        experience: data.experience,
        expertise: data.expertise || [],
        other_expertise: data.other_expertise,
        languages: data.languages || ['English'],
        linkedin_url: data.linkedin_url,
        country: data.country || 'Location not specified',
        phone_number: data.phone_number,
        created_at: data.created_at,
        updated_at: data.updated_at,
        
        // Computed fields
        title: data.experience || 'Research Expert',
        field: data.expertise?.[0] || 'General Research',
        specializations: data.expertise || ['Research Guidance'],
        rating: 4.5 + Math.random() * 0.5,
        reviewCount: Math.floor(Math.random() * 50) + 5,
        hourlyRate: Math.floor(Math.random() * 10000) + 10000,
        location: data.country || 'Location not specified',
        imageUrl: '/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png',
        featured: Math.random() > 0.7
      };

      return researcher;
    } catch (error) {
      console.error('Error fetching researcher by ID:', error);
      return null;
    }
  };

  const searchResearchers = (
    query: string,
    field?: string,
    language?: string,
    priceRange?: string
  ): Researcher[] => {
    return researchers.filter(researcher => {
      // Search query filter
      const matchesSearch = query === "" || 
        researcher.name.toLowerCase().includes(query.toLowerCase()) ||
        researcher.field.toLowerCase().includes(query.toLowerCase()) ||
        researcher.institution.toLowerCase().includes(query.toLowerCase()) ||
        researcher.specializations.some(spec => 
          spec.toLowerCase().includes(query.toLowerCase())
        ) ||
        (researcher.other_expertise && 
          researcher.other_expertise.toLowerCase().includes(query.toLowerCase())
        );
      
      // Field filter
      const matchesField = !field || field === "all" || 
        researcher.field === field ||
        researcher.specializations.includes(field) ||
        (researcher.expertise && researcher.expertise.includes(field));
      
      // Language filter
      const matchesLanguage = !language || language === "all" ||
        (researcher.languages && researcher.languages.some(lang => 
          lang.toLowerCase().includes(language.toLowerCase())
        ));
      
      // Price range filter
      const matchesPriceRange = !priceRange || priceRange === "all" || (() => {
        const rate = researcher.hourlyRate;
        switch (priceRange) {
          case "0-10000": return rate <= 10000;
          case "10000-15000": return rate > 10000 && rate <= 15000;
          case "15000+": return rate > 15000;
          default: return true;
        }
      })();
      
      return matchesSearch && matchesField && matchesLanguage && matchesPriceRange;
    });
  };

  const getFeaturedResearchers = (): Researcher[] => {
    return researchers.filter(researcher => researcher.featured);
  };

  const getUniqueFields = (): string[] => {
    const fields = new Set<string>();
    researchers.forEach(researcher => {
      if (researcher.field) fields.add(researcher.field);
      researcher.specializations.forEach(spec => fields.add(spec));
      if (researcher.expertise) {
        researcher.expertise.forEach(exp => fields.add(exp));
      }
    });
    return Array.from(fields).sort();
  };

  const getUniqueLanguages = (): string[] => {
    const languages = new Set<string>();
    researchers.forEach(researcher => {
      if (researcher.languages) {
        researcher.languages.forEach(lang => languages.add(lang));
      }
    });
    return Array.from(languages).sort();
  };

  useEffect(() => {
    fetchResearchers();
  }, []);

  return {
    researchers,
    loading,
    error,
    fetchResearchers,
    getResearcherById,
    searchResearchers,
    getFeaturedResearchers,
    getUniqueFields,
    getUniqueLanguages
  };
};