
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AboutTab from "./tabs/AboutTab";
import EducationTab from "./tabs/EducationTab";
import PublicationsTab from "./tabs/PublicationsTab";
import ReviewsTab from "./tabs/ReviewsTab";

interface ProfileTabsProps {
  researcher: {
    bio: string;
    specialties: string[];
    education: {
      degree: string;
      institution: string;
      year: string;
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
  };
}

const ProfileTabs = ({ researcher }: ProfileTabsProps) => {
  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="mb-8 bg-gray-100">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="experience">Experience & Education</TabsTrigger>
        <TabsTrigger value="publications">Publications</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      
      <TabsContent value="about" className="mt-0">
        <AboutTab bio={researcher.bio} specialties={researcher.specialties} />
      </TabsContent>
      
      <TabsContent value="experience" className="mt-0">
        <EducationTab education={researcher.education} />
      </TabsContent>
      
      <TabsContent value="publications" className="mt-0">
        <PublicationsTab publications={researcher.publications} />
      </TabsContent>
      
      <TabsContent value="reviews" className="mt-0">
        <ReviewsTab rating={researcher.rating} reviews={researcher.reviews} />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
