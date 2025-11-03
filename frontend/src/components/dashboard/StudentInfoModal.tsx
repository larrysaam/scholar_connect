
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, User, MapPin, FileText, Target, HelpCircle, Lightbulb, Microscope } from "lucide-react";

interface StudentInfoModalProps {
  studentName: string;
  researchSummary?: {
    level: string;
    researchTitle: string;
    projectLocation: string;
    problemStatement: string;
    researchQuestions: string;
    objectives: string;
    hypotheses: string;
    methodology: string;
    comments: string;
  };
}

const StudentInfoModal = ({ studentName, researchSummary }: StudentInfoModalProps) => {
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
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {studentName} - Research Summary
          </DialogTitle>
          <DialogDescription>
            Detailed information about the student's research project
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {researchSummary ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-gray-700">Level:</p>
                    <p className="text-gray-900">{researchSummary.level}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Project Location:</p>
                    <p className="text-gray-900 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {researchSummary.projectLocation}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="font-medium text-gray-700">Research Title:</p>
                    <p className="text-gray-900 font-medium">{researchSummary.researchTitle}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Problem Statement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-900 whitespace-pre-wrap">{researchSummary.problemStatement}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Research Questions & Objectives
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-700 mb-2">Research Questions:</p>
                    <p className="text-gray-900 whitespace-pre-wrap">{researchSummary.researchQuestions}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-2">Objectives:</p>
                    <p className="text-gray-900 whitespace-pre-wrap">{researchSummary.objectives}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Hypotheses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-900 whitespace-pre-wrap">{researchSummary.hypotheses}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Microscope className="h-5 w-5" />
                    Methodology
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-900 whitespace-pre-wrap">{researchSummary.methodology}</p>
                </CardContent>
              </Card>

              {researchSummary.comments && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Additional Comments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-900 whitespace-pre-wrap">{researchSummary.comments}</p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No research summary available for this student.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentInfoModal;
