
import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileHeader from "@/components/researcher/ProfileHeader";
import ProfileTabs from "@/components/researcher/ProfileTabs";
import BookingModal from "@/components/researcher/BookingModal";

const ResearcherProfile = () => {
  const { id } = useParams();
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Mock data - in a real app, this would come from an API
  const researcher = {
    id: id || "1",
    name: "Dr. Amina Foukou",
    title: "Senior Research Scientist",
    institution: "University of Yaoundé I",
    department: "Computer Science",
    field: "Artificial Intelligence",
    specialties: ["Machine Learning", "Natural Language Processing", "Computer Vision"],
    hourlyRate: 15000,
    rating: 4.8,
    reviews: [
      {
        id: "1",
        name: "Jean Baptiste Nga",
        rating: 5,
        date: "2024-01-15",
        comment: "Excellent guidance on my thesis. Very knowledgeable and patient."
      }
    ],
    imageUrl: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
    isOnline: true,
    responseTime: "within 2 hours",
    completedProjects: 45,
    languages: ["English", "French"],
    bio: "Passionate researcher with over 8 years of experience in AI and machine learning...",
    education: [
      {
        degree: "PhD in Computer Science",
        institution: "University of Yaoundé I",
        year: "2018"
      }
    ],
    experience: [
      {
        position: "Senior Research Scientist",
        institution: "University of Yaoundé I",
        period: "2019 - Present"
      }
    ],
    awards: [
      {
        title: "Best Research Paper Award",
        year: "2023"
      }
    ],
    publications: [
      {
        title: "Advanced Machine Learning Techniques in NLP",
        journal: "Journal of AI Research",
        year: "2023",
        url: "#"
      }
    ],
    fellowships: [
      {
        title: "UNESCO Fellowship in AI Research",
        year: "2022"
      }
    ],
    grants: [
      {
        title: "National Research Grant for AI Development",
        amount: "5,000,000 XAF",
        year: "2023"
      }
    ],
    memberships: [
      {
        organization: "Cameroon Association of Computer Scientists",
        position: "Senior Member",
        year: "2020"
      }
    ],
    supervision: [
      {
        studentName: "Marie Ngono",
        degree: "PhD",
        topic: "Deep Learning for Medical Diagnosis",
        status: "Ongoing"
      }
    ],
    verifications: {
      academic: "verified" as const,
      publication: "verified" as const,
      institutional: "verified" as const
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-8 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <ProfileHeader 
            researcher={researcher} 
            onBookSession={() => setShowBookingModal(true)}
          />
          <ProfileTabs researcher={researcher} />
        </div>
      </main>
      <Footer />
      
      {showBookingModal && (
        <BookingModal 
          researcher={researcher}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
};

export default ResearcherProfile;
