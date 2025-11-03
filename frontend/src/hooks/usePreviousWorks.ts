import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { PlatformWork, PrePlatformWork, NewWork } from "@/types/previousWorks";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { v4 as uuidv4 } from 'uuid'; // New import

export const usePreviousWorks = () => {
  const { user } = useAuth();
  const [isAddWorkOpen, setIsAddWorkOpen] = useState(false);
  const [newWork, setNewWork] = useState<NewWork>({
    title: "",
    description: "",
    category: "",
    institution: "",
    duration: "",
    outcomes: "",
    file: null,
    projectType: ""
  });
  const [platformWorks, setPlatformWorks] = useState<PlatformWork[]>([]);
  const [prePlatformWorks, setPrePlatformWorks] = useState<PrePlatformWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPreviousWorks = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("job_applications")
        .select(`
          *,
          jobs!left (
            *,
            client:users (
              name,
              avatar_url
            )
          )
        `)
        .in("status", ["completed", "accepted"])
        .eq("applicant_id", user.id);

      if (error) {
        console.error("Error fetching job applications:", error);
        throw error;
      }

      const mappedPlatformWorks: PlatformWork[] = data
        .filter((app: any) => app.jobs) // Filter out applications where jobs is null
        .map((application: any) => ({
          id: application.id,
          title: application.jobs.title || "N/A",
          client: application.jobs.client?.name || "N/A",
          clientAvatar: application.jobs.client?.avatar_url || "/placeholder-avatar.jpg",
          completedDate: application.updated_at || "N/A",
          duration: application.jobs.duration || "N/A",
          rating: 0, // Placeholder - you might need to fetch this from a reviews table
          review: "No review yet.", // Placeholder
          tags: application.jobs.skills_required || [],
          deliverables: (() => {
            let deliverables: { url: string; name: string }[] = [];
            const filePathData = application.jobs.file_path;
            if (filePathData) {
              if (Array.isArray(filePathData)) {
                // Ensure each item in the array is an object with url and name
                deliverables = filePathData.map((item: any) => {
                  if (typeof item === 'string') {
                    // If it's a string, assume it's a URL and create an object
                    const fileName = item.substring(item.lastIndexOf('/') + 1);
                    return { url: item, name: decodeURIComponent(fileName) };
                  } else if (typeof item === 'object' && item !== null && 'url' in item && 'name' in item) {
                    // If it's already an object with url and name, use it directly
                    return item;
                  } else {
                    // Fallback for unexpected array item types
                    return { url: '', name: 'Invalid Deliverable' };
                  }
                });
              } else if (typeof filePathData === 'string') {
                // If it's a single string, assume it's a URL
                const fileName = filePathData.substring(filePathData.lastIndexOf('/') + 1);
                deliverables = [{ url: filePathData, name: decodeURIComponent(fileName) }];
              } else {
                // Fallback for unexpected types
                deliverables = [];
              }
            }
            return deliverables;
          })(),
          projectValue: application.jobs.budget ? `${application.jobs.budget}` : "N/A"
      }));
      
      setPlatformWorks(mappedPlatformWorks);
      setPrePlatformWorks([]);

    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching previous works",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreviousWorks();
  }, [user, toast]);

  const handleAddWork = () => {
    if (!newWork.title.trim() || !newWork.description.trim() || !newWork.projectType) {
      toast({
        title: "Error",
        description: "Please fill in required fields including project type",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically send the newWork data to your backend/Supabase
    // For now, we'll just show a toast and clear the form
    toast({
      title: "Work Added",
      description: `Your ${newWork.projectType === "platform" ? "platform project" : "previous experience"} has been added to your portfolio`
    });
    setNewWork({ title: "", description: "", category: "", institution: "", duration: "", outcomes: "", file: null, projectType: "" });
    setIsAddWorkOpen(false);
  };

  const handleViewDetails = (workId: number, type: string) => {
    toast({
      title: "View Details",
      description: `Viewing details for work ID: ${workId}`
    });
  };

  const handleDownloadPortfolio = (workId: number, title: string) => {
    toast({
      title: "Download Started",
      description: `Downloading portfolio for: ${title}`
    });
  };

  const handleViewCertificate = (workId: number, title: string) => {
    toast({
      title: "Certificate Viewer",
      description: `Opening certificate for: ${title}`
    });
  };

  const handleUploadDeliverable = async (workId: string, file: File) => {
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
      const filePath = `lovable-uploads/${user.id}/${workId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('lovable-uploads') // Assuming you have a storage bucket named 'deliverables'
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

      // Fetch current job application to append new deliverable
      const { data: currentApplication, error: fetchError } = await supabase
        .from('job_applications')
        .select('job_id, jobs(file_path)') // Select job_id from job_applications and file_path from jobs
        .eq('id', workId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      console.log("handleUploadDeliverable - currentApplication:", currentApplication); // Added log

      let updatedDeliverables: { url: string; name: string }[] = [];
      const existingFilePath = currentApplication?.jobs?.file_path;

      if (existingFilePath) {
        if (Array.isArray(existingFilePath)) {
          // Ensure each item in the existing array is an object with url and name
          updatedDeliverables = existingFilePath.map((item: any) => {
            if (typeof item === 'string') {
              const name = item.substring(item.lastIndexOf('/') + 1);
              return { url: item, name: decodeURIComponent(name) };
            } else if (typeof item === 'object' && item !== null && 'url' in item && 'name' in item) {
              return item;
            } else {
              return { url: '', name: 'Invalid Existing Deliverable' };
            }
          });
        } else if (typeof existingFilePath === 'string') {
          // If it's a single string, assume it's a URL and create an object
          const name = existingFilePath.substring(existingFilePath.lastIndexOf('/') + 1);
          updatedDeliverables = [{ url: existingFilePath, name: decodeURIComponent(name) }];
        } else {
          // Fallback for unexpected types, could be a JSON string that needs parsing
          try {
            const parsed = JSON.parse(existingFilePath);
            if (Array.isArray(parsed)) {
              updatedDeliverables = parsed.map((item: any) => {
                if (typeof item === 'string') {
                  const name = item.substring(item.lastIndexOf('/') + 1);
                  return { url: item, name: decodeURIComponent(name) };
                } else if (typeof item === 'object' && item !== null && 'url' in item && 'name' in item) {
                  return item;
                } else {
                  return { url: '', name: 'Invalid Parsed Deliverable' };
                }
              });
            } else {
              console.warn("Unexpected type for existingFilePath after JSON.parse:", parsed);
            }
          } catch (e) {
            console.error("Error parsing existing file_path (fallback):", e);
          }
        }
      }
      updatedDeliverables.push(newDeliverable);

      console.log("handleUploadDeliverable - updatedDeliverables before update:", updatedDeliverables); // Added log

      // Update the jobs table with the new file_path (as a JSONB object/array)
      const { error: updateError } = await supabase
        .from('jobs') // Update the jobs table, not job_applications
        .update({ file_path: updatedDeliverables })
        .eq('id', currentApplication.job_id); // Use job_id from job_applications

      console.log("handleUploadDeliverable - updateError:", updateError); // Added log

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Success",
        description: "Deliverable uploaded successfully!",
      });

      // Re-fetch previous works to update the UI
      fetchPreviousWorks();

    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error uploading deliverable",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDeliverable = async (workId: string, deliverableUrl: string) => {
    console.log("handleDeleteDeliverable called with workId:", workId, "and deliverableUrl:", deliverableUrl);
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
      // Reconstruct the file path for Supabase storage deletion
      const urlParts = deliverableUrl.split('/');
      console.log("URL Parts:", urlParts);
      const fileName = urlParts.pop(); // Get the file name
      const userId = urlParts.pop(); // Get the user ID
      const workIdFromPath = urlParts.pop(); // Get the work ID from the path
      const filePath = `lovable-uploads/${userId}/${workIdFromPath}/${fileName}`;
      console.log("Reconstructed filePath for storage deletion:", filePath);

      // Delete from Supabase storage
      const { error: deleteStorageError } = await supabase.storage
        .from('lovable-uploads')
        .remove([filePath]);

      if (deleteStorageError) {
        console.error("Supabase storage deletion error:", deleteStorageError);
        throw deleteStorageError;
      }
      console.log("Supabase storage deletion successful.");

      // Fetch current job application to update deliverable list
      const { data: currentApplication, error: fetchError } = await supabase
        .from('job_applications')
        .select('job_id, jobs(file_path)')
        .eq('id', workId)
        .single();

      if (fetchError) {
        console.error("Error fetching current application:", fetchError);
        throw fetchError;
      }
      console.log("Current application fetched:", currentApplication);

      let existingFilePath = currentApplication?.jobs?.file_path;
      let updatedDeliverables: { url: string; name: string }[] = [];

      if (existingFilePath) {
        if (Array.isArray(existingFilePath)) {
          updatedDeliverables = existingFilePath.filter((item: any) => item.url !== deliverableUrl);
        } else if (typeof existingFilePath === 'string' && existingFilePath !== deliverableUrl) {
          // If it was a single string and not the one to delete, keep it
          const name = existingFilePath.substring(existingFilePath.lastIndexOf('/') + 1);
          updatedDeliverables = [{ url: existingFilePath, name: decodeURIComponent(name) }];
        }
      }
      console.log("Updated deliverables array (before DB update):", updatedDeliverables);

      // Update the jobs table with the new, filtered file_path
      const { error: updateError } = await supabase
        .from('jobs')
        .update({ file_path: updatedDeliverables })
        .eq('id', currentApplication.job_id);

      if (updateError) {
        console.error("Supabase database update error:", updateError);
        throw updateError;
      }
      console.log("Supabase database updated successfully.");

      toast({
        title: "Success",
        description: "Deliverable deleted successfully!",
      });

      // Re-fetch previous works to update the UI
      fetchPreviousWorks();

    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error deleting deliverable",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    platformWorks,
    prePlatformWorks,
    isAddWorkOpen,
    setIsAddWorkOpen,
    newWork,
    setNewWork,
    handleAddWork,
    handleViewDetails,
    handleDownloadPortfolio,
    handleViewCertificate,
    handleUploadDeliverable,
    handleDeleteDeliverable, // New
    loading,
    error,
    fetchPreviousWorks
  };
};