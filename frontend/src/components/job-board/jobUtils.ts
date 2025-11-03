
import { Job } from "./jobData";

export const filterJobs = (
  jobs: Job[],
  searchQuery: string,
  selectedCategory: string,
  selectedUrgency: string,
  selectedBudget: string
) => {
  return jobs.filter(job => {
    const matchesSearch = searchQuery === "" || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || job.category === selectedCategory;
    const matchesUrgency = selectedUrgency === "all" || job.urgency === selectedUrgency;
    
    let matchesBudget = true;
    if (selectedBudget !== "all") {
      const [min, max] = selectedBudget.split("-").map(Number);
      if (max) {
        matchesBudget = job.budget >= min && job.budget <= max;
      } else {
        matchesBudget = job.budget >= min;
      }
    }
    
    return matchesSearch && matchesCategory && matchesUrgency && matchesBudget && job.status === "open";
  });
};
