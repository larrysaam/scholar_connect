
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface JobApplication {
  id: string;
  job_id: string;
  applicant_id: string;
  cover_letter?: string;
  proposed_budget?: number;
  estimated_duration?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  created_at: string;
  updated_at: string;
  job: {
    id: string;
    title: string;
    description: string;
  };
}

export const useMyApplications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*, job:jobs(*, client:users(id, name))')
        .eq('applicant_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        return;
      }
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const updateApplicationStatus = async (applicationId: string, status: 'accepted' | 'rejected' | 'withdrawn') => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) {
        console.error('Error updating application status:', error);
        toast({
          title: "Error",
          description: "Failed to update application status",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Success",
        description: `Application ${status}`
      });
      fetchApplications();
      return true;
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  return { applications, loading, fetchApplications, updateApplicationStatus };
};
