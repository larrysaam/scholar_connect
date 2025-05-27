
import { JobMatch, UserSkills } from "@/types/notifications";

export class JobMatchingService {
  private userSkills: UserSkills = {
    skills: ["Statistical Analysis", "Data Analysis", "Literature Review", "Academic Writing"],
    categories: ["Statistics", "Research", "Agriculture"],
    experience_level: "intermediate"
  };

  // Match jobs based on user skills
  findJobMatches(availableJobs: JobMatch[]): JobMatch[] {
    return availableJobs.filter(job => {
      const skillsInDescription = this.userSkills.skills.some(skill => 
        job.description.toLowerCase().includes(skill.toLowerCase()) ||
        job.title.toLowerCase().includes(skill.toLowerCase())
      );
      
      return skillsInDescription;
    }).sort((a, b) => b.skillsMatch - a.skillsMatch);
  }

  // Get sample job data for testing
  getSampleJobs(): JobMatch[] {
    return [
      {
        jobId: "job_001",
        title: "Statistical Analysis for Agricultural Research",
        description: "Need help with statistical analysis of crop yield data using SPSS",
        skillsMatch: 95,
        client: "Dr. Sarah Johnson",
        budget: "75,000 XAF",
        deadline: "2024-02-15"
      },
      {
        jobId: "job_002", 
        title: "Literature Review on Climate Change Impact",
        description: "Comprehensive literature review on climate change effects on agriculture",
        skillsMatch: 85,
        client: "Prof. Michael Chen",
        budget: "50,000 XAF",
        deadline: "2024-02-20"
      }
    ];
  }

  getUserSkills(): UserSkills {
    return this.userSkills;
  }
}
