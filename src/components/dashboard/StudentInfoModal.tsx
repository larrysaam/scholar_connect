
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, GraduationCap, BookOpen, AlertCircle, FileText } from "lucide-react";

interface Student {
  id: string;
  name: string;
  field: string;
  university: string;
  researchSummary: string;
  challenge: string;
  comment: string;
  documentsShared: {
    name: string;
    type: string;
    preview: string;
  }[];
}

interface StudentInfoModalProps {
  student: Student;
}

const StudentInfoModal = ({ student }: StudentInfoModalProps) => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const handleViewDocument = (docName: string) => {
    setSelectedDocument(docName);
    console.log("Viewing document:", docName);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          More Information
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Student Information
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Student Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Student Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png" />
                  <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{student.name}</h3>
                  <p className="text-gray-600 mb-2">{student.field}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{student.university}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Research Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Research Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{student.researchSummary}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Research Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{student.challenge}</p>
              </CardContent>
            </Card>
          </div>

          {/* Student Comment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Student's Comment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{student.comment}</p>
            </CardContent>
          </Card>

          {/* Shared Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Shared Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {student.documentsShared.map((doc, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{doc.name}</h4>
                        <p className="text-xs text-gray-500">{doc.type}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewDocument(doc.name)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600">{doc.preview}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentInfoModal;
