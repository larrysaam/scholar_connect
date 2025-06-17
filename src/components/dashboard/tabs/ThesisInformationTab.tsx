
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BookOpen, Save, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ThesisData {
  title: string;
  problemStatement: string;
  researchQuestions: string[];
  researchObjectives: string[];
  researchHypothesis: string;
  expectedOutcomes: string[];
}

const ThesisInformationTab = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [thesisData, setThesisData] = useState<ThesisData>({
    title: "Machine Learning Applications in Healthcare Data Analysis",
    problemStatement: "The healthcare industry generates vast amounts of data daily, but lacks efficient automated systems to analyze and extract meaningful insights that can improve patient outcomes and reduce operational costs.",
    researchQuestions: [
      "How can machine learning algorithms be optimized for healthcare data analysis?",
      "What are the most effective ML models for predicting patient outcomes?",
      "How can data privacy be maintained while enabling comprehensive analysis?"
    ],
    researchObjectives: [
      "Develop and implement ML algorithms for healthcare data processing",
      "Evaluate the effectiveness of different ML models in healthcare contexts", 
      "Create a framework for privacy-preserving healthcare data analysis",
      "Validate the system through real-world healthcare datasets"
    ],
    researchHypothesis: "Implementation of optimized machine learning algorithms in healthcare data analysis will significantly improve diagnostic accuracy and treatment recommendations while maintaining patient data privacy.",
    expectedOutcomes: [
      "A comprehensive ML framework for healthcare data analysis",
      "Improved diagnostic accuracy by 15-20%",
      "Reduced data processing time by 40%",
      "Published research papers in peer-reviewed journals",
      "Potential patent applications for novel algorithms"
    ]
  });

  const handleSave = () => {
    toast({
      title: "Thesis Information Saved",
      description: "Your thesis information has been successfully updated.",
    });
    setIsEditing(false);
  };

  const handleArrayChange = (field: keyof Pick<ThesisData, 'researchQuestions' | 'researchObjectives' | 'expectedOutcomes'>, index: number, value: string) => {
    setThesisData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: keyof Pick<ThesisData, 'researchQuestions' | 'researchObjectives' | 'expectedOutcomes'>) => {
    setThesisData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), ""]
    }));
  };

  const removeArrayItem = (field: keyof Pick<ThesisData, 'researchQuestions' | 'researchObjectives' | 'expectedOutcomes'>, index: number) => {
    setThesisData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Thesis Information</h2>
          <p className="text-gray-600">
            Manage your thesis details and research information
          </p>
        </div>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="flex items-center space-x-2"
        >
          {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          <span>{isEditing ? "Save Changes" : "Edit"}</span>
        </Button>
      </div>

      {/* Thesis Title */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Thesis Title
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Input
              value={thesisData.title}
              onChange={(e) => setThesisData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter your thesis title"
            />
          ) : (
            <p className="text-gray-800">{thesisData.title}</p>
          )}
        </CardContent>
      </Card>

      {/* Problem Statement */}
      <Card>
        <CardHeader>
          <CardTitle>Problem Statement</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={thesisData.problemStatement}
              onChange={(e) => setThesisData(prev => ({ ...prev, problemStatement: e.target.value }))}
              placeholder="Describe the problem your research addresses"
              rows={4}
            />
          ) : (
            <p className="text-gray-800">{thesisData.problemStatement}</p>
          )}
        </CardContent>
      </Card>

      {/* Research Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Research Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {thesisData.researchQuestions.map((question, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-sm font-medium text-gray-500 mt-1">{index + 1}.</span>
              {isEditing ? (
                <div className="flex-1 flex space-x-2">
                  <Input
                    value={question}
                    onChange={(e) => handleArrayChange('researchQuestions', index, e.target.value)}
                    placeholder="Enter research question"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('researchQuestions', index)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <p className="text-gray-800 flex-1">{question}</p>
              )}
            </div>
          ))}
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('researchQuestions')}
            >
              Add Question
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Research Objectives */}
      <Card>
        <CardHeader>
          <CardTitle>Research Objectives</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {thesisData.researchObjectives.map((objective, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-sm font-medium text-gray-500 mt-1">{index + 1}.</span>
              {isEditing ? (
                <div className="flex-1 flex space-x-2">
                  <Input
                    value={objective}
                    onChange={(e) => handleArrayChange('researchObjectives', index, e.target.value)}
                    placeholder="Enter research objective"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('researchObjectives', index)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <p className="text-gray-800 flex-1">{objective}</p>
              )}
            </div>
          ))}
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('researchObjectives')}
            >
              Add Objective
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Research Hypothesis */}
      <Card>
        <CardHeader>
          <CardTitle>Research Hypothesis</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={thesisData.researchHypothesis}
              onChange={(e) => setThesisData(prev => ({ ...prev, researchHypothesis: e.target.value }))}
              placeholder="State your research hypothesis"
              rows={3}
            />
          ) : (
            <p className="text-gray-800">{thesisData.researchHypothesis}</p>
          )}
        </CardContent>
      </Card>

      {/* Expected Outcomes */}
      <Card>
        <CardHeader>
          <CardTitle>Expected Outcomes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {thesisData.expectedOutcomes.map((outcome, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-sm font-medium text-gray-500 mt-1">{index + 1}.</span>
              {isEditing ? (
                <div className="flex-1 flex space-x-2">
                  <Input
                    value={outcome}
                    onChange={(e) => handleArrayChange('expectedOutcomes', index, e.target.value)}
                    placeholder="Enter expected outcome"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem('expectedOutcomes', index)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <p className="text-gray-800 flex-1">{outcome}</p>
              )}
            </div>
          ))}
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => addArrayItem('expectedOutcomes')}
            >
              Add Outcome
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ThesisInformationTab;
