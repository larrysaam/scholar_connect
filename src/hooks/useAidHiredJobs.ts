import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Job } from '@/types/jobs'; // Assuming Job type is defined here

export const useAidHiredJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHiredJobs = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Step 1: Fetch all accepted job applications for the current user (aid)
      const { data: applications, error: applicationsError } = await supabase
        .from('job_applications')
        .select('job_id')
        .eq('applicant_id', user.id)
        .eq('status', 'accepted');

      if (applicationsError) {
        throw applicationsError;
      }

      if (!applications || applications.length === 0) {
        setJobs([]);
        setLoading(false);
        return;
      }

      const jobIds = applications.map((app) => app.job_id);

      // Step 2: Fetch the full job details for the retrieved job IDs
      const { data: hiredJobs, error: jobsError } = await supabase
        .from('jobs')
        .select('*, client:users(id, name)') // Fetch client details
        .in('id', jobIds);

      if (jobsError) {
        throw jobsError;
      }

      setJobs(hiredJobs || []);

    } catch (err: any) {
      console.error("Error fetching hired jobs:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchHiredJobs();
  }, [fetchHiredJobs]);

  return { jobs, loading, error, refetch: fetchHiredJobs };
};
