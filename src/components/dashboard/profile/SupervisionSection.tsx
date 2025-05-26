
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SupervisionSectionProps {
  userType?: "student" | "researcher";
}

const SupervisionSection = ({ userType = "researcher" }: SupervisionSectionProps) => {
  // Always return null to completely hide this section
  return null;
};

export default SupervisionSection;
