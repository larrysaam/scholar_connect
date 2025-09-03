import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { PlatformWork, PrePlatformWork, NewWork } from "@/types/previousWorks";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

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
    projectType: ""
  });
  const [platformWorks, setPlatformWorks] = useState<PlatformWork[]>([]);
  const [prePlatformWorks, setPrePlatformWorks] = useState<PrePlatformWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
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
            deliverables: [], // Placeholder
            projectValue: application.jobs.budget ? `$${application.jobs.budget}` : "N/A"
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
    setNewWork({ title: "", description: "", category: "", institution: "", duration: "", outcomes: "", projectType: "" });
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
    loading,
    error
  };
};