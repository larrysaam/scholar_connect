import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import JobFilters from "./JobFilters";
import JobCard from "./JobCard";
import EmptyJobsState from "./EmptyJobsState";
import { useJobManagement, Job } from "@/hooks/useJobManagement";
import { filterJobs } from "./jobUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const JobBoard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");
  const [selectedBudget, setSelectedBudget] = useState("all");
  const { toast } = useToast();
  const { fetchAllJobsForResearchAids, applyForJob, loading } = useJobManagement();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    const loadJobs = async () => {
      const allJobs = await fetchAllJobsForResearchAids();
      setJobs(allJobs);
    };
    loadJobs();
  }, [fetchAllJobsForResearchAids]);

  const filteredJobs = filterJobs(
    jobs,
    searchQuery,
    selectedCategory,
    selectedUrgency,
    selectedBudget
  );

  const handleApplyToJob = (job: Job) => {
    setSelectedJob(job);
  };

  const handleConfirmApply = async () => {
    if (!selectedJob || !coverLetter) return;
    const success = await applyForJob(selectedJob.id, coverLetter);
    if (success) {
      setSelectedJob(null);
      setCoverLetter("");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading jobs...</div>;
  }

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
            onApply={() => handleApplyToJob(job)}
          />
        ))}
      </div>

      {filteredJobs.length === 0 && <EmptyJobsState />}

      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
            <DialogDescription>
              Please enter your cover letter below.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Enter your cover letter here..."
            rows={10}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setSelectedJob(null)}>Cancel</Button>
            <Button onClick={handleConfirmApply}>Submit Application</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobBoard;