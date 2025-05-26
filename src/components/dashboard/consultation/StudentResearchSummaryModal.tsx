
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

interface StudentResearchSummaryModalProps {
  studentId: string;
  consultationId: string;
}

const StudentResearchSummaryModal = ({ studentId, consultationId }: StudentResearchSummaryModalProps) => {
  // Mock research summary data - in real app, this would be fetched based on studentId
  const researchSummary = {
    title: "AI-Powered Healthcare Diagnostics",
    level: "PhD",
    projectLocation: "University of Cambridge",
    problemStatement: "Current medical diagnostic processes are time-consuming and prone to human error, particularly in image analysis for early disease detection.",
    researchQuestions: [
      "How can machine learning improve diagnostic accuracy?",
      "What is the optimal algorithm for medical image recognition?",
      "How can we reduce diagnostic time while maintaining accuracy?"
    ],
    objectives: [
      "Develop an AI model for medical image analysis",
      "Improve diagnostic accuracy by 25%",
      "Reduce diagnostic time from hours to minutes"
    ],
    hypotheses: "Implementing convolutional neural networks with transfer learning will significantly improve diagnostic accuracy and speed compared to traditional methods.",
    methodology: "Convolutional Neural Networks with transfer learning using pre-trained models on medical imaging datasets",
    comments: "Looking for guidance on model optimization and validation techniques for medical applications."
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Info className="h-4 w-4 mr-2" />
          More Info
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Research Summary</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{researchSummary.title}</CardTitle>
              <div className="flex gap-4 text-sm text-gray-600">
                <span><strong>Level:</strong> {researchSummary.level}</span>
                <span><strong>Location:</strong> {researchSummary.projectLocation}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3 text-lg border-b pb-1">Problem Statement</h4>
                <p className="text-gray-700 leading-relaxed">{researchSummary.problemStatement}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-lg border-b pb-1">Research Questions</h4>
                <ul className="space-y-2">
                  {researchSummary.researchQuestions.map((question, index) => (
                    <li key={index} className="text-gray-700 flex">
                      <span className="font-medium text-blue-600 mr-2">{index + 1}.</span>
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-lg border-b pb-1">Research Objectives</h4>
                <ul className="space-y-2">
                  {researchSummary.objectives.map((objective, index) => (
                    <li key={index} className="text-gray-700 flex">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-lg border-b pb-1">Hypotheses</h4>
                  <p className="text-gray-700 leading-relaxed">{researchSummary.hypotheses}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-lg border-b pb-1">Methodology</h4>
                  <p className="text-gray-700 leading-relaxed">{researchSummary.methodology}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-lg border-b pb-1">Additional Comments</h4>
                <p className="text-gray-700 leading-relaxed italic">{researchSummary.comments}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentResearchSummaryModal;
