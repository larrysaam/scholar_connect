import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Job {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  currency: string;
  location?: string;
  duration?: string;
  skills_required: string[];
  experience_level?: string;
  urgency: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  applications_count: number;
  deadline?: string;
  created_at: string;
  updated_at: string;
}

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
}

export interface CreateJobData {
  title: string;
  description: string;
  category: string;
  budget: number;
  currency?: string;
  location?: string;
  duration?: string;
  skills_required: string[];
  experience_level?: string;
  urgency?: string;
  deadline?: string;
}

export const useJobManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Fetch user's jobs
  const fetchJobs = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        toast({
          title: "Error",
          description: "Failed to load jobs",
          variant: "destructive"
        });
        return;
      }

      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new job
  const createJob = async (jobData: CreateJobData): Promise<boolean> => {
    if (!user) return false;

    try {
      setCreating(true);
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          ...jobData,
          user_id: user.id,
          currency: jobData.currency || 'XAF',
          urgency: jobData.urgency || 'medium'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating job:', error);
        toast({
          title: "Error",
          description: "Failed to create job",
          variant: "destructive"
        });
        return false;
      }

      setJobs(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Job posted successfully!"
      });
      return true;
    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setCreating(false);
    }
  };

  // Update a job
  const updateJob = async (jobId: string, updates: Partial<CreateJobData>): Promise<boolean> => {
    if (!user) return false;

    try {
      setUpdating(true);
      const { data, error } = await supabase
        .from('jobs')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating job:', error);
        toast({
          title: "Error",
          description: "Failed to update job",
          variant: "destructive"
        });
        return false;
      }

      setJobs(prev => prev.map(job => job.id === jobId ? data : job));
      toast({
        title: "Success",
        description: "Job updated successfully!"
      });
      return true;
    } catch (error) {
      console.error('Error updating job:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  // Update job status
  const updateJobStatus = async (jobId: string, status: Job['status']): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('jobs')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating job status:', error);
        toast({
          title: "Error",
          description: "Failed to update job status",
          variant: "destructive"
        });
        return false;
      }

      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, status, updated_at: new Date().toISOString() } : job
      ));
      
      toast({
        title: "Success",
        description: `Job ${status === 'active' ? 'activated' : status} successfully!`
      });
      return true;
    } catch (error) {
      console.error('Error updating job status:', error);
      return false;
    }
  };

  // Delete a job
  const deleteJob = async (jobId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting job:', error);
        toast({
          title: "Error",
          description: "Failed to delete job",
          variant: "destructive"
        });
        return false;
      }

      setJobs(prev => prev.filter(job => job.id !== jobId));
      toast({
        title: "Success",
        description: "Job deleted successfully!"
      });
      return true;
    } catch (error) {
      console.error('Error deleting job:', error);
      return false;
    }
  };

  // Fetch job applications for a specific job
  const fetchJobApplications = async (jobId: string): Promise<JobApplication[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          applicant:users!job_applications_applicant_id_fkey(
            id,
            name,
            email,
            expertise,
            experience
          )
        `)
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching job applications:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching job applications:', error);
      return [];
    }
  };

  // Initialize data fetch
  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  return {
    jobs,
    loading,
    creating,
    updating,
    createJob,
    updateJob,
    updateJobStatus,
    deleteJob,
    fetchJobs,
    fetchJobApplications
  };
};