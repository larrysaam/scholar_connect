import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AboutTab from "./tabs/AboutTab";
import EducationTab from "./tabs/EducationTab";
import ExperienceTab from "./tabs/ExperienceTab";
import AwardsTab from "./tabs/AwardsTab";
import PublicationsTab from "./tabs/PublicationsTab";
import ReviewsTab from "./tabs/ReviewsTab";
import VerificationTab from "./tabs/VerificationTab";
import ConsultationServicesDisplay from "./ConsultationServicesDisplay";

interface ProfileTabsProps {
  researcher: {
    id: string;
    bio: string;
    specialties: string[];
    education: {
      degree: string;
      institution: string;
      year: string;
    }[];
    experience: {
      position: string;
      institution: string;
      period: string;
    }[];
    awards: {
      title: string;
      year: string;
    }[];
    fellowships: {
      title: string;
      period: string;
    }[];
    grants: {
      title: string;
      amount: string;
      period: string;
    }[];
    memberships: string[];
    supervision: {
      type: string;
      count: number;
    }[];
    publications: {
      title: string;
      journal: string;
      year: string;
    }[];
    rating: number;
    reviews: {
      name: string;
      rating: number;
      comment: string;
    }[];
    verifications?: {
      academic: "verified" | "pending" | "unverified";
      publication: "verified" | "pending" | "unverified";
      institutional: "verified" | "pending" | "unverified";
    };
  };
}

const ProfileTabs = ({ researcher }: ProfileTabsProps) => {
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
        <AboutTab bio={researcher.bio} specialties={researcher.specialties} />
      </TabsContent>

      <TabsContent value="verification" className="mt-0">
        <VerificationTab researcherId={researcher.id} />
      </TabsContent>
      
      <TabsContent value="education" className="mt-0">
        <EducationTab education={researcher.education} />
      </TabsContent>
      
      <TabsContent value="experience" className="mt-0">
        <ExperienceTab experience={researcher.experience} />
      </TabsContent>
      
      <TabsContent value="achievements" className="mt-0">
        <AwardsTab 
          awards={researcher.awards}
          fellowships={researcher.fellowships}
          grants={researcher.grants}
          memberships={researcher.memberships}
          supervision={researcher.supervision}
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
