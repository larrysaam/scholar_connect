
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SupervisionSectionProps {
  userType?: "student" | "researcher";
}

const SupervisionSection = ({ userType = "researcher" }: SupervisionSectionProps) => {
  // Don't render supervision section for students
  if (userType === "student") {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Supervision</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Current Students</h4>
            <p className="text-sm text-gray-600">No current students</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Graduated Students</h4>
            <p className="text-sm text-gray-600">No graduated students</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupervisionSection;
