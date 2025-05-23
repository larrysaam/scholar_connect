
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ResearchSummaryForm = () => {
  const [researchData, setResearchData] = useState({
    interest: "",
    title: "",
    problemStatement: "",
    questions: "",
    objectives: "",
    hypotheses: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setResearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log("Saving research summary:", researchData);
    // In a real app, this would save to backend
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Research Summary</CardTitle>
        <CardDescription>
          Fill in your research details to help researchers understand your work better.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="interest">Research Interest</Label>
          <Input
            id="interest"
            value={researchData.interest}
            onChange={(e) => handleInputChange("interest", e.target.value)}
            placeholder="e.g., Machine Learning, Environmental Science..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Research Title</Label>
          <Input
            id="title"
            value={researchData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Enter your research title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="problemStatement">Problem Statement</Label>
          <Textarea
            id="problemStatement"
            value={researchData.problemStatement}
            onChange={(e) => handleInputChange("problemStatement", e.target.value)}
            placeholder="Describe the problem your research addresses"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="questions">Research Questions</Label>
          <Textarea
            id="questions"
            value={researchData.questions}
            onChange={(e) => handleInputChange("questions", e.target.value)}
            placeholder="List your main research questions"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="objectives">Research Objectives</Label>
          <Textarea
            id="objectives"
            value={researchData.objectives}
            onChange={(e) => handleInputChange("objectives", e.target.value)}
            placeholder="Outline your research objectives"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hypotheses">Research Hypotheses</Label>
          <Textarea
            id="hypotheses"
            value={researchData.hypotheses}
            onChange={(e) => handleInputChange("hypotheses", e.target.value)}
            placeholder="State your research hypotheses"
            rows={3}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Research Summary
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResearchSummaryForm;
