
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2, Save, X } from "lucide-react";
import ResearchSummarySection from "../profile/ResearchSummarySection";

const ResearchSummaryTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [researchSummary, setResearchSummary] = useState({
    level: "",
    customLevel: "",
    researchTitle: "",
    projectLocation: "",
    problemStatement: "",
    researchQuestions: "",
    objectives: "",
    hypotheses: "",
    methodology: "",
    comments: ""
  });

  const handleUpdate = (field: keyof typeof researchSummary, value: string) => {
    setResearchSummary(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log("Saving research summary:", researchSummary);
    setIsEditing(false);
    // In a real app, this would save to the backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // In a real app, this would revert changes
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Research Summary</h2>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      <ResearchSummarySection
        researchSummary={researchSummary}
        isEditing={isEditing}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default ResearchSummaryTab;
