import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AboutTab from "./tabs/AboutTab";
import EducationTab from "./tabs/EducationTab";
import ExperienceTab from "./tabs/ExperienceTab";
import AwardsTab from "./tabs/AwardsTab";
import PublicationsTab from "./tabs/PublicationsTab";
import ReviewsTab from "./tabs/ReviewsTab";
import VerificationTab from "./tabs/VerificationTab";
import ConsultationServicesDisplay from "./ConsultationServicesDisplay";

import { useResearcherProfile } from "@/hooks/useResearcherProfile";
import { Loader2 } from "lucide-react";

interface ProfileTabsProps {
  researcherId: string;
}

const ProfileTabs = ({ researcherId }: ProfileTabsProps) => {
  const { researcher, loading, error } = useResearcherProfile(researcherId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading profile data...</span>
      </div>
    );
  }

  if (error || !researcher) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load profile data. Please try again.</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="mb-8 bg-gray-100 grid grid-cols-4 md:grid-cols-8 w-full">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="verification">Verification</TabsTrigger>
        <TabsTrigger value="education">Education</TabsTrigger>
        <TabsTrigger value="experience">Experience</TabsTrigger>
        <TabsTrigger value="achievements">Achievements</TabsTrigger>
        <TabsTrigger value="publications">Publications</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
      </TabsList>
      
      <TabsContent value="about" className="mt-0">
        <AboutTab bio={researcher.bio} specialties={researcher.skills} />
      </TabsContent>

      <TabsContent value="verification" className="mt-0">
        <VerificationTab researcherId={researcher.id} />
      </TabsContent>
      
      <TabsContent value="education" className="mt-0">
        <EducationTab education={researcher.educational_background} />
      </TabsContent>
      
      <TabsContent value="experience" className="mt-0">
        <ExperienceTab experience={researcher.work_experience} />
      </TabsContent>
      
      <TabsContent value="achievements" className="mt-0">
        <AwardsTab 
          awards={researcher.awards}
          fellowships={researcher.scholarships}
          grants={[]} // Not available in current data structure
          memberships={researcher.affiliations || []}
          supervision={[]} // Not available in current data structure
        />
      </TabsContent>
      
      <TabsContent value="publications" className="mt-0">
        <PublicationsTab publications={researcher.publications} />
      </TabsContent>
      
      <TabsContent value="reviews" className="mt-0">
        <ReviewsTab rating={researcher.rating} reviews={researcher.reviews} />
      </TabsContent>

      <TabsContent value="services" className="mt-0">
        <ConsultationServicesDisplay researcherId={researcher.id} researcherName={researcher.name || "Researcher"} />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
