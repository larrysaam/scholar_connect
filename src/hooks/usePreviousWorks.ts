
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PlatformWork, PrePlatformWork, NewWork } from "@/types/previousWorks";

export const usePreviousWorks = () => {
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
  const { toast } = useToast();

  const platformWorks: PlatformWork[] = [
    {
      id: 1,
      title: "Statistical Analysis for Agricultural Study",
      client: "Dr. Sarah Johnson",
      clientAvatar: "/placeholder-avatar.jpg",
      completedDate: "2024-01-15",
      duration: "3 weeks",
      rating: 5,
      review: "Excellent work on the statistical analysis. Very thorough and professional.",
      tags: ["Statistics", "Agriculture", "Data Analysis"],
      deliverables: ["Final Report", "SPSS Output", "Presentation"],
      projectValue: "75,000 XAF"
    },
    {
      id: 2,
      title: "Literature Review on Climate Change",
      client: "Prof. Michael Chen",
      clientAvatar: "/placeholder-avatar.jpg",
      completedDate: "2024-01-08",
      duration: "2 weeks",
      rating: 4,
      review: "Good quality literature review with comprehensive coverage of recent studies.",
      tags: ["Literature Review", "Climate Change", "Environmental Science"],
      deliverables: ["Literature Review Document", "Bibliography", "Summary"],
      projectValue: "50,000 XAF"
    },
    {
      id: 3,
      title: "Survey Data Collection",
      client: "Dr. Marie Dubois",
      clientAvatar: "/placeholder-avatar.jpg",
      completedDate: "2023-12-20",
      duration: "4 weeks",
      rating: 5,
      review: "Outstanding data collection work. Very organized and efficient.",
      tags: ["Data Collection", "Surveys", "Field Work"],
      deliverables: ["Raw Data", "Data Entry", "Quality Report"],
      projectValue: "120,000 XAF"
    }
  ];

  const prePlatformWorks: PrePlatformWork[] = [
    {
      id: 1,
      title: "PhD Dissertation Research Support",
      institution: "University of Yaoundé I",
      completedDate: "2023-06-15",
      duration: "6 months",
      description: "Provided comprehensive research support for doctoral dissertation on agricultural productivity in Cameroon.",
      tags: ["PhD Support", "Agricultural Research", "Statistical Analysis"],
      outcomes: ["Successful PhD Defense", "2 Publications", "Conference Presentation"]
    },
    {
      id: 2,
      title: "Research Project for Ministry of Agriculture",
      institution: "Ministry of Agriculture",
      completedDate: "2023-03-10",
      duration: "4 months",
      description: "Conducted impact assessment study on agricultural extension programs in rural communities.",
      tags: ["Impact Assessment", "Government Project", "Rural Development"],
      outcomes: ["Policy Recommendations", "Government Report", "Community Feedback"]
    },
    {
      id: 3,
      title: "NGO Research Initiative",
      institution: "Green Earth Foundation",
      completedDate: "2022-11-20",
      duration: "3 months",
      description: "Led research on sustainable farming practices and their economic impact on smallholder farmers.",
      tags: ["Sustainability", "NGO", "Economic Impact"],
      outcomes: ["Research Report", "Training Materials", "Impact Metrics"]
    }
  ];

  const handleAddWork = () => {
    if (!newWork.title.trim() || !newWork.description.trim() || !newWork.projectType) {
      toast({
        title: "Error",
        description: "Please fill in required fields including project type",
        variant: "destructive"
      });
      return;
    }

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
    handleViewCertificate
  };
};
