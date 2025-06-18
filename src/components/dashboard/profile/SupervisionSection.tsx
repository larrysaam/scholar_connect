
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Calendar, Award } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface SupervisionSectionProps {
  userType?: "student" | "researcher";
  supervisionData?: {
    currentStudents?: number;
    completedSupervisions?: number;
    totalPublications?: number;
    averageRating?: number;
    recentSupervisions?: Array<{
      studentName: string;
      thesisTitle: string;
      level: string;
      status: string;
      startDate: string;
    }>;
  };
}

const SupervisionSection = ({ 
  userType = "researcher", 
  supervisionData = {
    currentStudents: 3,
    completedSupervisions: 12,
    totalPublications: 8,
    averageRating: 4.8,
    recentSupervisions: [
      {
        studentName: "Marie Kouadio",
        thesisTitle: "AI Applications in Agricultural Prediction",
        level: "PhD",
        status: "In Progress",
        startDate: "2024-01-15"
      },
      {
        studentName: "Jean Baptiste",
        thesisTitle: "Machine Learning in Healthcare",
        level: "Masters",
        status: "Completed",
        startDate: "2023-09-01"
      }
    ]
  }
}: SupervisionSectionProps) => {
  const { profile } = useAuth();

  if (userType === "student") {
    return null;
  }

  // Use default supervision data for now
  const effectiveSupervisionData = supervisionData;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Student Supervision Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{effectiveSupervisionData.currentStudents}</div>
            <div className="text-sm text-gray-600">Current Students</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{effectiveSupervisionData.completedSupervisions}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{effectiveSupervisionData.totalPublications}</div>
            <div className="text-sm text-gray-600">Co-Publications</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{effectiveSupervisionData.averageRating}</div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </div>
        </div>

        {/* Recent Supervisions */}
        <div>
          <h4 className="font-medium mb-3 flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Recent Supervisions
          </h4>
          <div className="space-y-3">
            {effectiveSupervisionData.recentSupervisions?.map((supervision, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-medium">{supervision.studentName}</h5>
                    <p className="text-sm text-gray-600">{supervision.thesisTitle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{supervision.level}</Badge>
                    <Badge variant={supervision.status === "Completed" ? "default" : "secondary"}>
                      {supervision.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  Started: {new Date(supervision.startDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supervision Achievements */}
        <div>
          <h4 className="font-medium mb-3 flex items-center">
            <Award className="h-4 w-4 mr-2" />
            Supervision Achievements
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center p-3 bg-gray-50 rounded">
              <Award className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <div className="font-medium">Excellence in Supervision</div>
                <div className="text-sm text-gray-600">2023</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded">
              <Users className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <div className="font-medium">Mentorship Award</div>
                <div className="text-sm text-gray-600">2022</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupervisionSection;
