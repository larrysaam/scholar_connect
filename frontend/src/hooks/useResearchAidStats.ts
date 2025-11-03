import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ResearchAidStats {
  totalAids: number;
  totalFields: number;
  totalConsultations: number;
  completionRate: number;
  loading: boolean;
  error: string | null;
}

export function useResearchAidStats(): ResearchAidStats {
  const [stats, setStats] = useState<ResearchAidStats>({
    totalAids: 0,
    totalFields: 0,
    totalConsultations: 0,
    completionRate: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1. Get total research aids
        const { count: totalAids, error: aidsError } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'aid');

        if (aidsError) throw aidsError;

        // 2. Get all unique expertise fields
        const { data: aids, error: fieldsError } = await supabase
          .from('users')
          .select('expertise')
          .eq('role', 'aid');

        if (fieldsError) throw fieldsError;

        // Extract unique fields from expertise arrays
        const allFields = new Set<string>();
        aids.forEach(aid => {
          if (Array.isArray(aid.expertise)) {
            aid.expertise.forEach(field => allFields.add(field));
          }
        });

        // 3. Count total completed consultations and total tasks for completion rate
        const { data: bookings, error: bookingsError } = await supabase
          .from('service_bookings')
          .select('id, status')
          .in('status', ['completed', 'cancelled', 'in_progress']);

        if (bookingsError) throw bookingsError;

        const completedConsultations = bookings.filter(b => b.status === 'completed').length;
        const totalTasks = bookings.length;

        // 4. Calculate completion rate (completed tasks / total tasks)
        const completionRate = totalTasks > 0 
          ? Math.round((completedConsultations / totalTasks) * 100) 
          : 0;

        setStats({
          totalAids: totalAids || 0,
          totalFields: allFields.size,
          totalConsultations: completedConsultations,
          completionRate,
          loading: false,
          error: null
        });
      } catch (error: any) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
}
