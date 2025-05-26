
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, User, MessageSquare, Target, GraduationCap } from "lucide-react";

interface StudentInfoModalProps {
  student: {
    id: string;
    name: string;
    email: string;
    field: string;
    university?: string;
    researchSummary: string;
    challenge: string;
    comment: string;
    documentsShared: {
      name: string;
      type: string;
      preview: string;
    }[];
  };
}

const StudentInfoModal = ({ student }: StudentInfoModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          More Information
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Student Information - {student.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Student Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Name:</p>
                  <p className="text-gray-700">{student.name}</p>
                </div>
                <div>
                  <p className="font-semibold">Email:</p>
                  <p className="text-blue-600">{student.email}</p>
                </div>
                <div>
                  <p className="font-semibold">Field of Study:</p>
                  <Badge variant="outline">{student.field}</Badge>
                </div>
                {student.university && (
                  <div>
                    <p className="font-semibold flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" />
                      University:
                    </p>
                    <p className="text-gray-700">{student.university}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Research Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Research Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{student.researchSummary}</p>
            </CardContent>
          </Card>

          {/* Challenge */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Challenge/Issue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{student.challenge}</p>
            </CardContent>
          </Card>

          {/* Additional Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Additional Comments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{student.comment}</p>
            </CardContent>
          </Card>

          {/* Documents Shared */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents Shared
              </CardTitle>
            </CardHeader>
            <CardContent>
              {student.documentsShared.length > 0 ? (
                <div className="space-y-4">
                  {student.documentsShared.map((doc, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-semibold">{doc.name}</p>
                          <Badge variant="secondary" className="text-xs">{doc.type}</Badge>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded border">
                        <p className="text-sm font-medium mb-2">Document Preview:</p>
                        <p className="text-sm text-gray-700">{doc.preview}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No documents shared for this consultation.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentInfoModal;
