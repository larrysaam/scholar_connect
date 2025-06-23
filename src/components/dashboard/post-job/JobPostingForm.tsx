
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload, Calendar, DollarSign, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [newSkill, setNewSkill] = useState("");
  const { toast } = useToast();

  const categories = [
    "Statistics & Data Analysis",
    "GIS Specialists", 
    "Academic Editing",
    "Research Assistants",
    "Transcription Services",
    "Publishing Support",
    "Survey Tools & Design",
    "Design & Visualization",
    "Translation Services",
    "Literature Review",
    "Data Collection",
    "Report Writing"
  ];

  const handleSkillAdd = () => {
    if (newSkill.trim() && !jobData.skills.includes(newSkill.trim())) {
      setJobData(prev => ({ 
        ...prev, 
        skills: [...prev.skills, newSkill.trim()] 
      }));
      setNewSkill("");
    }
  };

  const handleSkillRemove = (skill: string) => {
    setJobData(prev => ({ 
      ...prev, 
      skills: prev.skills.filter(s => s !== skill) 
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setJobData(prev => ({ 
        ...prev, 
        files: [...prev.files, ...newFiles] 
      }));
    }
  };

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

    // Reset form
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
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Job Title *</label>
            <Input
              placeholder="e.g., Statistical Analysis of Survey Data"
              value={jobData.title}
              onChange={(e) => setJobData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <Select value={jobData.category} onValueChange={(value) => setJobData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Budget (FCFA) *</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="e.g., 25,000"
                value={jobData.budget}
                onChange={(e) => setJobData(prev => ({ ...prev, budget: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Job Description *</label>
          <Textarea
            placeholder="Describe your job requirements in detail..."
            value={jobData.description}
            onChange={(e) => setJobData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
          />
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Deadline</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={jobData.deadline}
                onChange={(e) => setJobData(prev => ({ ...prev, deadline: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="e.g., Remote, Yaoundé"
                value={jobData.location}
                onChange={(e) => setJobData(prev => ({ ...prev, location: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Duration</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="e.g., 2 weeks"
                value={jobData.duration}
                onChange={(e) => setJobData(prev => ({ ...prev, duration: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium mb-2">Required Skills</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {jobData.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                {skill}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleSkillRemove(skill)} />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSkillAdd();
                }
              }}
            />
            <Button onClick={handleSkillAdd} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Attachments (Optional)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">Drop files here or click to upload</p>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Choose Files
            </Button>
          </div>
          {jobData.files.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">Uploaded files:</p>
              {jobData.files.map((file, index) => (
                <div key={index} className="text-sm text-gray-600">{file.name}</div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={clearForm}>
            Clear Form
          </Button>
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            Post Job
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobPostingForm;
