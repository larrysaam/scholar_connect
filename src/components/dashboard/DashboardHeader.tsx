import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";


const DashboardHeader = ({ userRole }) => {
  const { profile } = useAuth();
  const [researcherSubtitle, setResearcherSubtitle] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubtitle = async () => {
      
        const { data, error } = await supabase
          .from("researcher_profiles")
          .select("subtitle")
          .eq("user_id", profile.id)
          .single();

        if (!error && data?.subtitle) {
          setResearcherSubtitle(data.subtitle);
        } else {
          setResearcherSubtitle(null);
        }
      
    };
    fetchSubtitle();
  }, [userRole, profile?.id]);

  const getGreeting = () => {
    if (!profile?.name) return `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard`;
    
    const nameParts = profile.name.split(' ');
    const lastName = nameParts[nameParts.length - 1];
    
    if (userRole === "researcher") {
      console.log("title :", researcherSubtitle)
      if (researcherSubtitle === "Prof.") {
        return `Welcome, Prof. ${lastName}!`;
      }
      if (researcherSubtitle === "Dr.") {
        return `Welcome, Dr. ${lastName}!`;
      }
    }
    
    return `Welcome, ${lastName}!`;
  };

  return (
    <div className="mb-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{getGreeting()}</h1>
      <p className="text-gray-600 text-sm sm:text-base">Manage your consultations and account</p>
    </div>
  );
};

export default DashboardHeader;
