
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

interface MoreInfoButtonProps {
  studentId: string;
  consultationId: string;
}

const MoreInfoButton = ({ studentId, consultationId }: MoreInfoButtonProps) => {
  // Mock research summary data - in real app, this would be fetched based on studentId
  const researchSummary = {
    title: "AI-Powered Healthcare Diagnostics",
    abstract: "This research explores the application of machine learning algorithms in medical diagnosis, focusing on image recognition for early detection of diseases.",
    objectives: [
      "Develop an AI model for medical image analysis",
      "Improve diagnostic accuracy by 25%",
      "Reduce diagnostic time from hours to minutes"
    ],
    methodology: "Convolutional Neural Networks with transfer learning",
    expectedOutcomes: "A deployable AI system for medical professionals",
    timeline: "6 months",
    resources: ["High-performance computing cluster", "Medical imaging datasets", "Expert medical consultation"]
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Info className="h-4 w-4 mr-2" />
          More Info
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Research Summary</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{researchSummary.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Abstract</h4>
                <p className="text-sm text-gray-700">{researchSummary.abstract}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Research Objectives</h4>
                <ul className="list-disc list-inside space-y-1">
                  {researchSummary.objectives.map((objective, index) => (
                    <li key={index} className="text-sm text-gray-700">{objective}</li>
                  ))}
                </ul>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Methodology</h4>
                  <p className="text-sm text-gray-700">{researchSummary.methodology}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Timeline</h4>
                  <p className="text-sm text-gray-700">{researchSummary.timeline}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Expected Outcomes</h4>
                <p className="text-sm text-gray-700">{researchSummary.expectedOutcomes}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Required Resources</h4>
                <ul className="list-disc list-inside space-y-1">
                  {researchSummary.resources.map((resource, index) => (
                    <li key={index} className="text-sm text-gray-700">{resource}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MoreInfoButton;
