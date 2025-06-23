
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
    skills: [] as string[],
    files: [] as File[]
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!jobData.title || !jobData.description || !jobData.category || !jobData.budget) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    console.log("Submitting job:", jobData);
    
    toast({
      title: "Job Posted Successfully!",
      description: "Your job has been posted and research aids will be notified"
    });

    clearForm();
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
        />
      </CardContent>
    </Card>
  );
};

export default JobPostingForm;
