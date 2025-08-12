
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useJobManagement, CreateJobData } from "@/hooks/useJobManagement";
import BasicInfoSection from "./BasicInfoSection";
import JobDescriptionSection from "./JobDescriptionSection";
import AdditionalDetailsSection from "./AdditionalDetailsSection";
import SkillsSection from "./SkillsSection";
import FileUploadSection from "./FileUploadSection";
import FormActions from "./FormActions";

const JobPostingForm = () => {
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    deadline: "",
    location: "",
    duration: "",
    experience_level: "",
    urgency: "medium",
    skills: [] as string[],
    files: [] as File[]
  });
  
  const { createJob, creating } = useJobManagement();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!jobData.title || !jobData.description || !jobData.category || !jobData.budget) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const budgetNumber = parseFloat(jobData.budget);
    if (isNaN(budgetNumber) || budgetNumber <= 0) {
      toast({
        title: "Invalid Budget",
        description: "Please enter a valid budget amount",
        variant: "destructive"
      });
      return;
    }

    const createJobData: CreateJobData = {
      title: jobData.title,
      description: jobData.description,
      category: jobData.category,
      budget: budgetNumber,
      currency: "XAF",
      location: jobData.location || undefined,
      duration: jobData.duration || undefined,
      skills_required: jobData.skills,
      experience_level: jobData.experience_level || undefined,
      urgency: jobData.urgency as "low" | "medium" | "high",
      deadline: jobData.deadline ? new Date(jobData.deadline).toISOString() : undefined
    };

    const success = await createJob(createJobData);
    if (success) {
      clearForm();
    }
  };

  const clearForm = () => {
    setJobData({
      title: "",
      description: "",
      category: "",
      budget: "",
      deadline: "",
      location: "",
      duration: "",
      experience_level: "",
      urgency: "medium",
      skills: [],
      files: []
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="h-5 w-5 mr-2 text-green-600" />
          Create New Job Posting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <BasicInfoSection
          title={jobData.title}
          category={jobData.category}
          budget={jobData.budget}
          onTitleChange={(value) => setJobData(prev => ({ ...prev, title: value }))}
          onCategoryChange={(value) => setJobData(prev => ({ ...prev, category: value }))}
          onBudgetChange={(value) => setJobData(prev => ({ ...prev, budget: value }))}
        />

        <JobDescriptionSection
          description={jobData.description}
          onDescriptionChange={(value) => setJobData(prev => ({ ...prev, description: value }))}
        />

        <AdditionalDetailsSection
          deadline={jobData.deadline}
          location={jobData.location}
          duration={jobData.duration}
          onDeadlineChange={(value) => setJobData(prev => ({ ...prev, deadline: value }))}
          onLocationChange={(value) => setJobData(prev => ({ ...prev, location: value }))}
          onDurationChange={(value) => setJobData(prev => ({ ...prev, duration: value }))}
        />

        <SkillsSection
          skills={jobData.skills}
          onSkillsChange={(skills) => setJobData(prev => ({ ...prev, skills }))}
        />

        <FileUploadSection
          files={jobData.files}
          onFilesChange={(files) => setJobData(prev => ({ ...prev, files }))}
        />

        <FormActions
          onSubmit={handleSubmit}
          onClear={clearForm}
          isSubmitting={creating}
        />
      </CardContent>
    </Card>
  );
};

export default JobPostingForm;
