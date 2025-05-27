
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import JobFilters from "./JobFilters";
import JobCard from "./JobCard";
import EmptyJobsState from "./EmptyJobsState";
import { jobs } from "./jobData";
import { filterJobs } from "./jobUtils";

const JobBoard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");
  const [selectedBudget, setSelectedBudget] = useState("all");
  const { toast } = useToast();

  const filteredJobs = filterJobs(
    jobs,
    searchQuery,
    selectedCategory,
    selectedUrgency,
    selectedBudget
  );

  const handleApplyToJob = (jobId: string, jobTitle: string) => {
    toast({
      title: "Application Submitted",
      description: `Your application for "${jobTitle}" has been submitted successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <JobFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedUrgency={selectedUrgency}
        setSelectedUrgency={setSelectedUrgency}
        selectedBudget={selectedBudget}
        setSelectedBudget={setSelectedBudget}
        filteredJobsCount={filteredJobs.length}
      />

      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <JobCard 
            key={job.id} 
            job={job} 
            onApply={handleApplyToJob} 
          />
        ))}
      </div>

      {filteredJobs.length === 0 && <EmptyJobsState />}
    </div>
  );
};

export default JobBoard;
