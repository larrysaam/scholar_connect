import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { NotificationService } from '@/services/notificationService';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique file names

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
  file_path?: { url: string; name: string }[]; // Add file_path to Job interface
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
  job: Job; // Add job details to JobApplication
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
  file_path?: string; // Add file_path here
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
          urgency: jobData.urgency || 'medium',
          file_path: jobData.file_path
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
          ),
          job:jobs!inner(*) // Select all fields from the jobs table
        `)
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching job applications:', error);
        return [];
      }

      console.log("fetchJobApplications - Raw data from Supabase:", data);
      return data || [];
    } catch (error) {
      console.error('Error fetching job applications:', error);
      return [];
    }
  }, [user]);

  // Handle file upload for a job application
  const handleUploadDeliverableForJobApplication = async (jobId: string, file: File) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to upload files.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      // Store files under a path that includes job ID
      const filePath = `lovable-uploads/${user.id}/jobs/${jobId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('lovable-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('lovable-uploads')
        .getPublicUrl(filePath);

      const newDeliverable = {
        name: file.name,
        url: publicUrlData.publicUrl,
      };

      // Fetch current job's file_path to append new deliverable
      const { data: currentJob, error: fetchJobError } = await supabase
        .from('jobs')
        .select('file_path')
        .eq('id', jobId)
        .single();

      if (fetchJobError) {
        throw fetchJobError;
      }

      let updatedDeliverables: { url: string; name: string }[] = [];
      const existingFilePath = currentJob?.file_path;

      if (existingFilePath) {
        if (Array.isArray(existingFilePath)) {
          updatedDeliverables = existingFilePath;
        } else if (typeof existingFilePath === 'string') {
          try {
            const parsed = JSON.parse(existingFilePath);
            if (Array.isArray(parsed)) {
              updatedDeliverables = parsed;
            } else {
              console.warn("Unexpected type for existingFilePath after JSON.parse:", parsed);
            }
          } catch (e) {
            console.error("Error parsing existing file_path (fallback):", e);
          }
        }
      }
      updatedDeliverables.push(newDeliverable);

      // Update the jobs table with the new file_path
      const { error: updateError } = await supabase
        .from('jobs')
        .update({ file_path: updatedDeliverables })
        .eq('id', jobId);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Success",
        description: "Deliverable uploaded successfully!",
      });

      // Re-fetch jobs to update the UI with new deliverables
      fetchJobs();

    } catch (err: any) {
      console.error("Error uploading deliverable for job application:", err);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDeliverableForJobApplication = async (jobId: string, fileUrl: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to delete files.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Extract the file path from the URL for Supabase storage deletion
      // Assuming the URL format is something like:
      // https://[project_ref].supabase.co/storage/v1/object/public/lovable-uploads/[user_id]/jobs/[jobId]/[fileName]
      const urlParts = fileUrl.split('/');
      const fileNameWithJobId = urlParts.slice(urlParts.indexOf('jobs') + 1).join('/');
      const filePathInStorage = `lovable-uploads/${user.id}/jobs/${fileNameWithJobId}`;

      const { error: deleteError } = await supabase.storage
        .from('lovable-uploads')
        .remove([filePathInStorage]);

      if (deleteError) {
        throw deleteError;
      }

      // Fetch current job's file_path
      const { data: currentJob, error: fetchJobError } = await supabase
        .from('jobs')
        .select('file_path')
        .eq('id', jobId)
        .single();

      if (fetchJobError) {
        throw fetchJobError;
      }

      let updatedDeliverables: { url: string; name: string }[] = [];
      const existingFilePath = currentJob?.file_path;

      if (existingFilePath) {
        if (Array.isArray(existingFilePath)) {
          updatedDeliverables = existingFilePath.filter(deliverable => deliverable.url !== fileUrl);
        } else if (typeof existingFilePath === 'string') {
          try {
            const parsed = JSON.parse(existingFilePath);
            if (Array.isArray(parsed)) {
              updatedDeliverables = parsed.filter(deliverable => deliverable.url !== fileUrl);
            } else {
              console.warn("Unexpected type for existingFilePath after JSON.parse:", parsed);
            }
          } catch (e) {
            console.error("Error parsing existing file_path (fallback):", e);
          }
        }
      }

      // Update the jobs table with the new file_path
      const { error: updateError } = await supabase
        .from('jobs')
        .update({ file_path: updatedDeliverables })
        .eq('id', jobId);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Success",
        description: "Deliverable deleted successfully!",
      });

      // Re-fetch jobs to update the UI with new deliverables
      fetchJobs();

    } catch (err: any) {
      console.error("Error deleting deliverable for job application:", err);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Confirm a job application and create a booking
  const confirmJobApplication = async (
    applicationId: string,
    applicantId: string,
    jobId: string,
    jobTitle: string
  
  ): Promise<{success: boolean, meetLink?: string, bookingId?: string}> => {
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


       // Step 2: Send a message to the aid
      const { error: messageError } = await supabase.from('messages').insert([
        {
          id: jobId,
          sender_id: user.id,
          recipient_id: applicantId,
          content: 'job confirmed',
        },
      ]);

      if (messageError) {
        console.error('Error sending message:', messageError);
        toast({ title: "Warning", description: "Job confirmed, but failed to send message.", variant: "default" });
      } else {
        toast({
          title: "Success",
          description: "Job confirmed and message sent to the aid."
        });
      }

      // // Step 3: Create a new consultation service from the job
      // const { data: service, error: serviceError } = await supabase
      //   .from('consultation_services')
      //   .insert({
      //     user_id: applicantId, // The provider is the applicant
      //     title: jobTitle,
      //     description: jobDescription,
      //     category: jobCategory as any, // Make sure this category is valid
      //     duration_minutes: jobDuration ? parseInt(jobDuration, 10) : 60,
      //     is_active: true,
      //   })
      //   .select('id')
      //   .single();

      // if (serviceError || !service) {
      //   console.error('Error creating consultation service:', serviceError);
      //   toast({ title: "Error", description: "Failed to create a service for the booking.", variant: "destructive" });
      //   return {success: false};
      // }

      // // Step 4: Create pricing for the new service
      // const { error: pricingError } = await supabase
      //   .from('service_pricing')
      //   .insert({
      //     service_id: service.id,
      //     academic_level: 'PhD', // Default or derive from job if possible
      //     price: jobBudget,
      //     currency: jobCurrency,
      //   });

      // if (pricingError) {
      //   console.error('Error creating service pricing:', pricingError);
      //   toast({ title: "Error", description: "Failed to set pricing for the service.", variant: "destructive" });
      //   return {success: false};
      // }

      // Step 5: Create a new booking
      const { data: booking, error: bookingError } = await supabase
        .from('service_bookings')
        .insert({
          provider_id: applicantId,
          client_id: user.id,
          service_id: service.id, // Use the newly created service_id
          academic_level: 'PhD', // This might need to be dynamic
          scheduled_date: new Date().toISOString().split('T')[0], // Placeholder
          scheduled_time: '12:00', // Placeholder
          duration_minutes: jobDuration ? parseInt(jobDuration, 10) : 60, // Placeholder
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

      // // Step 6: Generate Google Meet Link
      // try {
      //   const { data, error: functionError } = await supabase.functions.invoke('generate-meet-link', {
      //     body: { booking_id: booking.id },
      //   });

      //   if (functionError) {
      //     console.error('Error generating Google Meet link:', functionError);
      //     toast({ title: "Warning", description: "Booking created, but failed to generate a meeting link.", variant: "default" });
      //   } else {
      //     console.log('Generated Meet Link:', data.meetLink);
      //     // Optionally, update the booking with the meet link
      //     await supabase.from('service_bookings').update({ meeting_link: data.meetLink }).eq('id', booking.id);
      //     return {success: true, meetLink: data.meetLink, bookingId: booking.id};
      //   }
      // } catch (e) {
      //   console.error('Error invoking generate-meet-link function:', e);
      // }

      // Step 7: Notify the researcher
      await NotificationService.createNotification({
        userId: applicantId,
        title: 'You have been hired!',
        message: `You have been confirmed for the job: "${jobTitle}". A new service and booking have been created.`,
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

  // Apply for a job
  const applyForJob = async (jobId: string, coverLetter: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Check if the user has already applied for this job
      const { data: existingApplication, error: existingAppError } = await supabase
        .from('job_applications')
        .select('id')
        .eq('job_id', jobId)
        .eq('applicant_id', user.id)
        .single();

      if (existingAppError && existingAppError.code !== 'PGRST116') { // PGRST116 means no rows found, which is what we want
        console.error('Error checking for existing application:', existingAppError);
        toast({
          title: "Error",
          description: "Failed to apply for job",
          variant: "destructive"
        });
        return false;
      }

      if (existingApplication) {
        toast({
          title: "Error",
          description: "You have already applied for this job.",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          applicant_id: user.id,
          cover_letter: coverLetter,
        });

      if (error) {
        console.error('Error applying for job:', error);
        toast({
          title: "Error",
          description: "Failed to apply for job",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Your application has been submitted!"
      });
      return true;
    } catch (error) {
      console.error('Error applying for job:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
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

  // Confirm a job request and send a message
  const confirmJobRequest = async (jobId: string, aidId: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to confirm a job.",
        variant: "destructive",
      });
      return false;
    }

    try {
      setUpdating(true);
      // Step 1: Update job application status to 'accepted'
      const { error: updateApplicationError } = await supabase
        .from('job_applications')
        .update({ status: 'accepted' })
        .eq('job_id', jobId)
        .eq('applicant_id', aidId);

      if (updateApplicationError) {
        console.error('Error updating job application status:', updateApplicationError);
        toast({ title: "Error", description: "Failed to accept application.", variant: "destructive" });
        return false;
      }

      // Step 2: Send a message to the aid
      const { error: messageError } = await supabase.from('messages').insert([
        {
          id: jobId,
          sender_id: user.id,
          recipient_id: aidId,
          content: 'job confirmed',
        },
      ]);

      if (messageError) {
        console.error('Error sending message:', messageError);
        toast({ title: "Warning", description: "Job confirmed, but failed to send message.", variant: "default" });
      } else {
        toast({
          title: "Success",
          description: "Job confirmed and message sent to the aid."
        });
      }

      // Step 3: Optionally, update the job status to 'closed'
      await updateJobStatus(jobId, 'closed');


      return true;
    } catch (error) {
      console.error('Error confirming job request:', error);
      toast({ title: "Error", description: "An unexpected error occurred during confirmation.", variant: "destructive" });
      return false;
    } finally {
      setUpdating(false);
    }
  };

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
    confirmJobApplication,
    confirmJobRequest,
    applyForJob,
    handleUploadDeliverableForJobApplication,
    handleDeleteDeliverableForJobApplication
  };
};