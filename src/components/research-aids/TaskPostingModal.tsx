
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload } from "lucide-react";

interface TaskPostingModalProps {
  children: React.ReactNode;
}

const TaskPostingModal = ({ children }: TaskPostingModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    deadline: "",
    skills: [] as string[],
    files: [] as File[]
  });

  const categories = [
    "Statistics", "GIS Specialists", "Academic Editing", "Research Assistants",
    "Transcription", "Publishing Support", "Survey Tools", "Design & Visualization", "Translation"
  ];

  const handleSkillAdd = (skill: string) => {
    if (skill && !taskData.skills.includes(skill)) {
      setTaskData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const handleSkillRemove = (skill: string) => {
    setTaskData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setTaskData(prev => ({ ...prev, files: [...prev.files, ...Array.from(e.target.files)] }));
    }
  };

  const handleSubmit = () => {
    console.log("Submitting task:", taskData);
    // Here you would integrate with your backend
    setCurrentStep(1);
    setTaskData({
      title: "",
      description: "",
      category: "",
      budget: "",
      deadline: "",
      skills: [],
      files: []
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post a New Task - Step {currentStep} of 3</DialogTitle>
        </DialogHeader>

        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Task Title</label>
              <Input
                placeholder="e.g., Statistical Analysis of Survey Data"
                value={taskData.title}
                onChange={(e) => setTaskData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select value={taskData.category} onValueChange={(value) => setTaskData(prev => ({ ...prev, category: value }))}>
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
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                placeholder="Describe your task in detail..."
                value={taskData.description}
                onChange={(e) => setTaskData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>
            <Button onClick={() => setCurrentStep(2)} className="w-full">
              Next: Budget & Timeline
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Budget (FCFA)</label>
                <Input
                  placeholder="e.g., 25,000"
                  value={taskData.budget}
                  onChange={(e) => setTaskData(prev => ({ ...prev, budget: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Deadline</label>
                <Input
                  type="date"
                  value={taskData.deadline}
                  onChange={(e) => setTaskData(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Required Skills</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {taskData.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleSkillRemove(skill)} />
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Type a skill and press Enter"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSkillAdd(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button onClick={() => setCurrentStep(3)} className="flex-1">
                Next: Files & Review
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Upload Files (Optional)</label>
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
                <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                  Choose Files
                </Button>
              </div>
              {taskData.files.length > 0 && (
                <div className="mt-2">
                  {taskData.files.map((file, index) => (
                    <div key={index} className="text-sm text-gray-600">{file.name}</div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Review Your Task</h4>
              <p><strong>Title:</strong> {taskData.title}</p>
              <p><strong>Category:</strong> {taskData.category}</p>
              <p><strong>Budget:</strong> {taskData.budget} FCFA</p>
              <p><strong>Deadline:</strong> {taskData.deadline}</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Back
              </Button>
              <Button onClick={handleSubmit} className="flex-1">
                Post Task
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskPostingModal;
