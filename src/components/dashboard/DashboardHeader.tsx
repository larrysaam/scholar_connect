
import { useAuth } from "@/hooks/useAuth";

interface DashboardHeaderProps {
  userType: "student" | "researcher" | "aid";
}

const DashboardHeader = ({ userType }: DashboardHeaderProps) => {
  const { profile } = useAuth();

  const getGreeting = () => {
    if (!profile?.name) return `${userType.charAt(0).toUpperCase() + userType.slice(1)} Dashboard`;
    
    const firstName = profile.name.split(' ')[0];
    
    if (userType === "researcher") {
      // Check for academic rank first (Professor takes precedence)
      if (profile.academic_rank && 
          (profile.academic_rank.includes('Professor') || 
           profile.academic_rank.includes('Prof'))) {
        return `Welcome back, Prof. ${firstName}!`;
      }
      
      // Check for PhD/Postdoc in level_of_study or highest_education
      const hasPhD = profile.level_of_study?.toLowerCase().includes('phd') ||
                     profile.level_of_study?.toLowerCase().includes('postdoc') ||
                     profile.highest_education?.toLowerCase().includes('phd') ||
                     profile.highest_education?.toLowerCase().includes('postdoc');
      
      if (hasPhD) {
        return `Welcome back, Dr. ${firstName}!`;
      }
    }
    
    return `Welcome back, ${firstName}!`;
  };

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">{getGreeting()}</h1>
      <p className="text-gray-600">Manage your consultations and account</p>
    </div>
  );
};

export default DashboardHeader;
