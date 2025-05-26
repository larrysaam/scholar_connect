
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Mail, Phone, GraduationCap, BookOpen, Upload } from "lucide-react";

const StudentProfileInfo = () => {
  const studentData = {
    name: "John Smith",
    title: "Mr",
    email: "john.smith@university.edu",
    phone: "+237 650 123 456",
    university: "University of Technology",
    faculty: "Faculty of Engineering",
    department: "Computer Science",
    level: "Master's Degree",
    yearOfStudy: "2nd Year",
    studentId: "CS2022001",
    researchInterests: ["Artificial Intelligence", "Machine Learning", "Data Science"],
    currentProjects: ["AI in Healthcare", "Predictive Analytics"],
    gpa: "3.8/4.0",
    profileImage: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
    idDocument: {
      name: "national_id.pdf",
      uploadDate: "2024-01-15"
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('ID document uploaded:', file.name);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Student Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Image and Basic Info */}
          <div className="flex flex-col items-center md:items-start">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={studentData.profileImage} alt={studentData.name} />
              <AvatarFallback>{studentData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="mb-2">
              <Select defaultValue={studentData.title}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mr">Mr</SelectItem>
                  <SelectItem value="Mrs">Mrs</SelectItem>
                  <SelectItem value="Miss">Miss</SelectItem>
                  <SelectItem value="Dr">Dr</SelectItem>
                  <SelectItem value="Eng">Eng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <h3 className="text-lg font-semibold">{studentData.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{studentData.level}</p>
            <Badge variant="secondary">{studentData.yearOfStudy}</Badge>
          </div>

          {/* Detailed Information */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{studentData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{studentData.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{studentData.university}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Academic Information</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Faculty:</span> {studentData.faculty}</div>
                <div><span className="font-medium">Department:</span> {studentData.department}</div>
                <div><span className="font-medium">Student ID:</span> {studentData.studentId}</div>
                <div><span className="font-medium">GPA:</span> {studentData.gpa}</div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-medium text-gray-900 mb-2">Identification Document</h4>
              <div className="mt-2">
                {studentData.idDocument ? (
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{studentData.idDocument.name}</p>
                      <p className="text-xs text-gray-500">Uploaded: {studentData.idDocument.uploadDate}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => document.getElementById('id-document')?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Replace
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-2">
                    <Button 
                      variant="outline"
                      onClick={() => document.getElementById('id-document')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload ID Document
                    </Button>
                    <span className="text-sm text-gray-500">No document uploaded</span>
                  </div>
                )}
                <input
                  id="id-document"
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                />
                <p className="text-xs text-gray-500">Accepted: Passport, Driver's License, School ID Card, or National ID Card</p>
              </div>

              <h4 className="font-medium text-gray-900 mb-2 mt-4">Research Interests</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {studentData.researchInterests.map((interest, index) => (
                  <Badge key={index} variant="outline">{interest}</Badge>
                ))}
              </div>

              <h4 className="font-medium text-gray-900 mb-2">Current Projects</h4>
              <div className="flex flex-wrap gap-2">
                {studentData.currentProjects.map((project, index) => (
                  <Badge key={index} className="bg-blue-100 text-blue-800">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {project}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentProfileInfo;
