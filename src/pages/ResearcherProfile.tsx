
import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileHeader from "@/components/researcher/ProfileHeader";
import ProfileTabs from "@/components/researcher/ProfileTabs";
import BookingModal from "@/components/researcher/BookingModal";

const ResearcherProfile = () => {
  const { id } = useParams();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Mock data - in a real app, this would come from an API
  const researcher = {
    id: id || "1",
    name: "Dr. Marie Ngono Abega",
    title: "Senior Research Fellow in Geographic Information Systems",
    institution: "University of Yaoundé I",
    department: "Department of Geography",
    field: "Geographic Information Systems",
    specialties: ["Remote Sensing", "Spatial Analysis", "Environmental Modeling", "Cartography"],
    hourlyRate: 15000,
    rating: 4.9,
    reviews: [
      {
        id: "1",
        name: "Dr. Paul Mbarga",
        rating: 5,
        date: "2024-01-15",
        comment: "Excellent expertise in GIS analysis. Very professional and delivered quality work on time."
      },
      {
        id: "2",
        name: "Prof. Sarah Tankou",
        rating: 5,
        date: "2024-01-10",
        comment: "Outstanding knowledge in remote sensing. Helped me greatly with my research project."
      }
    ],
    bio: "Dr. Marie Ngono Abega is a distinguished researcher with over 10 years of experience in Geographic Information Systems and Remote Sensing. She has published extensively in international journals and has worked on numerous projects involving spatial analysis and environmental modeling.",
    education: [
      {
        degree: "PhD in Geography",
        institution: "University of Yaoundé I",
        year: "2018"
      },
      {
        degree: "MSc in Geographic Information Systems",
        institution: "University of Buea",
        year: "2014"
      }
    ],
    experience: [
      {
        position: "Senior Research Fellow",
        institution: "University of Yaoundé I",
        period: "2020-Present"
      },
      {
        position: "Research Associate",
        institution: "Institute of Geological Sciences",
        period: "2018-2020"
      }
    ],
    publications: [
      {
        title: "Spatial Analysis of Urban Growth in Cameroon Cities",
        journal: "African Journal of Geography",
        year: "2023",
        citations: 45
      },
      {
        title: "Remote Sensing Applications in Environmental Monitoring",
        journal: "International Journal of Remote Sensing",
        year: "2022",
        citations: 62
      }
    ],
    awards: [
      {
        title: "Best Young Researcher Award",
        year: "2021"
      },
      {
        title: "Excellence in Research Grant",
        year: "2020"
      }
    ],
    fellowships: [
      {
        title: "African Union Research Fellowship",
        period: "2019-2020"
      },
      {
        title: "UNESCO Young Scientists Programme",
        period: "2018-2019"
      }
    ],
    imageUrl: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
    availableTimes: [
      {
        date: new Date("2024-01-20"),
        slots: ["09:00", "10:00", "14:00", "15:00"]
      },
      {
        date: new Date("2024-01-21"),
        slots: ["09:00", "11:00", "13:00", "16:00"]
      }
    ],
    onlineStatus: "online" as const,
    verifications: {
      academic: true,
      publication: true,
      institutional: true
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <ProfileHeader 
            researcher={researcher}
            onBookingClick={() => setIsBookingOpen(true)}
          />
          
          <div className="mt-8">
            <ProfileTabs researcher={researcher} />
          </div>
        </div>
      </main>

      <BookingModal 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        researcher={researcher}
      />
      
      <Footer />
    </div>
  );
};

export default ResearcherProfile;
