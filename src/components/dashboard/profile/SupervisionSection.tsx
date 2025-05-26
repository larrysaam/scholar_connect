
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SupervisionSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Information</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">This section is not applicable for students.</p>
      </CardContent>
    </Card>
  );
};

export default SupervisionSection;
