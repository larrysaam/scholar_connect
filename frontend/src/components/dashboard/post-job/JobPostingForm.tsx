import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useJobManagement, CreateJobData } from "@/hooks/useJobManagement";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import { useAuth } from "@/hooks/useAuth";
import BasicInfoSection from "./BasicInfoSection";
import JobDescriptionSection from "./JobDescriptionSection";
import AdditionalDetailsSection from "./AdditionalDetailsSection";
import SkillsSection from "./SkillsSection";
import FileUploadSection from "./FileUploadSection";
import FormActions from "./FormActions";
import JobPaymentModal from "./JobPaymentModal";

const JobPostingForm = () => {
  const { user } = useAuth();
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
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingJobData, setPendingJobData] = useState<CreateJobData | null>(null);
  
  const { createJob, creating } = useJobManagement();
  const { toast } = useToast();
  const { uploadDocument, isUploading } = useDocumentUpload(user?.id || '', 'researcher');

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

    let filePath;
    if (jobData.files.length > 0) {
      const file = jobData.files[0];
      const uploadedDocument = await uploadDocument(file, 'job_attachment');
      if (!uploadedDocument) {
        toast({
          title: "File Upload Failed",
          description: "Please try again.",
          variant: "destructive",
        });
        return;
      }
      filePath = uploadedDocument.url;
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
      deadline: jobData.deadline ? new Date(jobData.deadline).toISOString() : undefined,
      file_path: filePath,
    };

    // Show payment modal instead of creating job directly
    setPendingJobData(createJobData);
    setShowPaymentModal(true);
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
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Post a New Job
          </CardTitle>
          <CardDescription>
            Fill in the details below to post a new research job for research aids.
          </CardDescription>
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
            isSubmitting={creating || isUploading}
          />
        </CardContent>
      </Card>

      {pendingJobData && (
        <JobPaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setPendingJobData(null);
          }}
          jobData={pendingJobData}
          budget={parseFloat(jobData.budget)}
          onPaymentSuccess={() => {
            clearForm();
            setPendingJobData(null);
          }}
        />
      )}
    </>
  );
};

export default JobPostingForm;
