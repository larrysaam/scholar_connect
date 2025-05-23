
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileHeader from "@/components/researcher/ProfileHeader";
import ProfileTabs from "@/components/researcher/ProfileTabs";
import { researcherData } from "@/components/researcher/mockData";

const ResearcherProfile = () => {
  const { id } = useParams<{ id: string }>();
  const researcher = researcherData; // In a real app, this would be fetched based on the ID

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <ProfileHeader researcher={researcher} />
        
        <div className="container mx-auto px-4 md:px-6 py-12">
          <ProfileTabs researcher={researcher} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResearcherProfile;
