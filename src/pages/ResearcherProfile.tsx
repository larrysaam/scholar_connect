
import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileHeader from "@/components/researcher/ProfileHeader";
import ProfileTabs from "@/components/researcher/ProfileTabs";

const ResearcherProfile = () => {
  const { id } = useParams();

  // Mock data - in a real app, this would come from an API
  const researcher = {
    id: id || "1",
    name: "Dr. Marie Ngono Abega",
    title: "Senior Research Fellow in Geographic Information Systems",
    institution: "University of Yaoundé I",
    department: "Department of Geography",
    field: "Geographic Information Systems",
    specialties: ["Remote Sensing", "Spatial Analysis", "Environmental Modeling", "Cartography", "Urban Planning", "Climate Change Analysis"],
    hourlyRate: 15000,
    rating: 4.9,
    reviews: [
      {
        id: "1",
        name: "Dr. Paul Mbarga",
        rating: 5,
        date: "2024-01-15",
        comment: "Excellent expertise in GIS analysis. Very professional and delivered quality work on time. Highly recommended for spatial analysis projects."
      },
      {
        id: "2",
        name: "Prof. Sarah Tankou",
        rating: 5,
        date: "2024-01-10",
        comment: "Outstanding knowledge in remote sensing. Helped me greatly with my research project on environmental monitoring."
      },
      {
        id: "3",
        name: "Dr. Jean Baptiste",
        rating: 4,
        date: "2024-01-05",
        comment: "Very knowledgeable researcher with deep understanding of cartographic principles. Great collaboration experience."
      }
    ],
    bio: "Dr. Marie Ngono Abega is a distinguished researcher with over 15 years of experience in Geographic Information Systems and Remote Sensing. She has published extensively in international journals and has worked on numerous projects involving spatial analysis, environmental modeling, and urban planning. Her expertise spans across multiple domains including climate change analysis, land use planning, and disaster risk assessment. She is passionate about using GIS technology to solve real-world problems and has collaborated with various international organizations including the UN and World Bank.",
    education: [
      {
        degree: "PhD in Geography (Geographic Information Systems)",
        institution: "University of Yaoundé I",
        year: "2018"
      },
      {
        degree: "MSc in Geographic Information Systems",
        institution: "University of Buea",
        year: "2014"
      },
      {
        degree: "BSc in Geography",
        institution: "University of Dschang",
        year: "2011"
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
      },
      {
        position: "GIS Analyst",
        institution: "Ministry of Environment",
        period: "2015-2018"
      }
    ],
    publications: [
      {
        title: "Spatial Analysis of Urban Growth in Cameroon Cities: A Remote Sensing Approach",
        journal: "African Journal of Geography",
        year: "2023",
        citations: 45
      },
      {
        title: "Remote Sensing Applications in Environmental Monitoring of Central African Forests",
        journal: "International Journal of Remote Sensing",
        year: "2022",
        citations: 62
      },
      {
        title: "Climate Change Impact Assessment Using GIS: A Case Study of Northern Cameroon",
        journal: "Environmental Science & Technology",
        year: "2021",
        citations: 38
      },
      {
        title: "Land Use Change Detection in Urban Areas Using Satellite Imagery",
        journal: "Journal of Urban Planning",
        year: "2020",
        citations: 29
      }
    ],
    awards: [
      {
        title: "Best Young Researcher Award - African Association of Remote Sensing",
        year: "2021"
      },
      {
        title: "Excellence in Research Grant - CODESRIA",
        year: "2020"
      },
      {
        title: "Outstanding Publication Award - University of Yaoundé I",
        year: "2019"
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
      },
      {
        title: "DAAD Research Fellowship",
        period: "2017-2018"
      }
    ],
    grants: [
      {
        title: "Climate Change Adaptation Research Grant",
        amount: "150,000 XAF",
        period: "2022-2024"
      },
      {
        title: "Innovation Research Fund - GIS Applications",
        amount: "75,000 XAF", 
        period: "2021-2023"
      },
      {
        title: "Environmental Monitoring Project Grant",
        amount: "200,000 XAF",
        period: "2020-2022"
      }
    ],
    memberships: [
      "African Association of Remote Sensing",
      "International Geographic Union",
      "Cameroon Geographic Society",
      "International Society for Photogrammetry and Remote Sensing",
      "African Association of Cartography"
    ],
    supervision: [
      {
        type: "PhD Students",
        count: 5
      },
      {
        type: "Master's Students", 
        count: 12
      },
      {
        type: "Research Assistants",
        count: 8
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
      },
      {
        date: new Date("2024-01-22"),
        slots: ["10:00", "14:00", "15:00", "16:00"]
      }
    ],
    onlineStatus: "online" as const,
    verifications: {
      academic: "verified" as const,
      publication: "verified" as const,
      institutional: "verified" as const
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        <ProfileHeader researcher={researcher} />
        
        <div className="container mx-auto px-4 py-8">
          <ProfileTabs researcher={researcher} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResearcherProfile;
