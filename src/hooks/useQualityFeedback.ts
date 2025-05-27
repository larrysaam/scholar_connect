
import { useState } from "react";
import { PlatformMetrics, Improvement } from "@/types/qualityFeedback";

export const useQualityFeedback = () => {
  const [platformMetrics] = useState<PlatformMetrics>({
    overallRating: 4.6,
    totalFeedbacks: 156,
    improvementRate: 85,
    userSatisfaction: 92
  });

  const [feedbackCategories] = useState<string[]>([
    "User Interface",
    "Job Matching System",
    "Payment Process",
    "Communication Tools",
    "Profile Management",
    "Notification System",
    "Mobile Experience",
    "Customer Support",
    "General Experience"
  ]);

  const [recentImprovements] = useState<Improvement[]>([
    {
      title: "Enhanced Job Matching",
      description: "Improved AI-powered job matching based on user feedback",
      implementedDate: "2024-01-20",
      userRequests: 23
    },
    {
      title: "Faster Payment Processing",
      description: "Reduced payment processing time from 48 to 24 hours",
      implementedDate: "2024-01-15",
      userRequests: 45
    },
    {
      title: "Mobile App Optimization",
      description: "Enhanced mobile interface for better user experience",
      implementedDate: "2024-01-10",
      userRequests: 67
    }
  ]);

  return {
    platformMetrics,
    feedbackCategories,
    recentImprovements
  };
};
