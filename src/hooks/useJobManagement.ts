import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { NotificationService } from '@/services/notificationService';

export interface UserProfile {
  id: string;
  name: string;
  // Add other user fields you might need, e.g., avatar_url
}

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
  status: 'active' | 'paused' | 'completed' | 'cancelled' | 'closed';
  applications_count: number;
  deadline?: string;
  created_at: string;
  updated_at: string;
  client?: UserProfile; // Add client profile
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
  applicant: {
    id: string;
    name: string;
    email: string;
    expertise: string[];
    experience: string;
  };
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
  const fetchJobs = useCallback(async (): Promise<Job[]> => {
    if (!user) return [];

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*, client:users(id, name), applications:job_applications(*, applicant:users(id, name))') // Fetch client details and job applications with applicant details
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        toast({
          title: "Error",
          description: "Failed to load jobs",
          variant: "destructive"
        });
        return [];
      }

      setJobs(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, toast, setJobs]);

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
  const fetchJobApplications = useCallback(async (jobId: string): Promise<JobApplication[]> => {
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
  }, [user]);

  // Confirm a job application and create a booking
  const confirmJobApplication = async (
    applicationId: string,
    applicantId: string,
    jobId: string,
    jobTitle: string,
    jobDescription: string,
    jobBudget: number,
    jobCurrency: string,
    jobCategory: string,
    jobDuration?: string,
    jobDeadline?: string
  ): Promise<{success: boolean, meetLink?: string}> => {
    if (!user) return {success: false};

    try {
      // Step 1: Update job application status to 'accepted'
      const { error: updateApplicationError } = await supabase
        .from('job_applications')
        .update({ status: 'accepted' })
        .eq('id', applicationId);

      if (updateApplicationError) {
        console.error('Error updating job application status:', updateApplicationError);
        toast({ title: "Error", description: "Failed to accept application.", variant: "destructive" });
        return {success: false};
      }

      // Step 2: Update job status to 'closed'
      const { error: updateJobError } = await supabase
        .from('jobs')
        .update({ status: 'closed' })
        .eq('id', jobId);

      if (updateJobError) {
        console.error('Error closing job:', updateJobError);
        // Optionally, revert the application status change here
        toast({ title: "Error", description: "Failed to close job posting.", variant: "destructive" });
        return {success: false};
      }

      // Step 3: Create a new booking
      const { data: booking, error: bookingError } = await supabase
        .from('service_bookings')
        .insert({
          provider_id: applicantId,
          client_id: user.id,
          service_id: jobId, // Using job_id as a stand-in for service_id
          academic_level: 'PhD', // This might need to be dynamic
          scheduled_date: new Date().toISOString().split('T')[0], // Placeholder
          scheduled_time: '12:00', // Placeholder
          duration_minutes: 60, // Placeholder
          base_price: jobBudget,
          total_price: jobBudget,
          currency: jobCurrency,
          status: 'confirmed',
          payment_status: 'paid' // Assuming payment is handled separately or not required
        })
        .select('id')
        .single();

      if (bookingError) {
        console.error('Error creating booking:', bookingError);
        toast({ title: "Error", description: "Failed to create a booking.", variant: "destructive" });
        return {success: false};
      }

      // Step 4: Generate Google Meet Link
      try {
        const { data, error: functionError } = await supabase.functions.invoke('generate-meet-link', {
          body: { booking_id: booking.id },
        });

        if (functionError) {
          console.error('Error generating Google Meet link:', functionError);
          toast({ title: "Warning", description: "Booking created, but failed to generate a meeting link.", variant: "default" });
        } else {
          console.log('Generated Meet Link:', data.meetLink);
          return {success: true, meetLink: data.meetLink};
        }
      } catch (e) {
        console.error('Error invoking generate-meet-link function:', e);
      }

      // Step 5: Notify the researcher
      await NotificationService.createNotification({
        userId: applicantId,
        title: 'You have been hired!',
        message: `You have been confirmed for the job: "${jobTitle}".`,
        type: 'success',
        category: 'job_application',
        actionUrl: `/dashboard?tab=bookings`,
        actionLabel: 'View Booking'
      });

      return {success: true};
    } catch (error) {
      console.error('Error confirming job application:', error);
      toast({ title: "Error", description: "An unexpected error occurred during confirmation.", variant: "destructive" });
      return {success: false};
    }
  };

  // Fetch all jobs for research aids, including client names
  const fetchAllJobsForResearchAids = async (): Promise<Job[]> => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*, client:users(id, name)') // Fetch client details
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all jobs:', error);
        toast({
          title: "Error",
          description: "Failed to load all jobs",
          variant: "destructive"
        });
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching all jobs:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching all jobs",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Initialize data fetch
  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user, fetchJobs]);

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
    fetchJobApplications,
    fetchAllJobsForResearchAids,
    confirmJobApplication
  };
};