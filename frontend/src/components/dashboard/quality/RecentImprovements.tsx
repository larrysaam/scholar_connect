
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { Improvement } from "@/types/qualityFeedback";

interface RecentImprovementsProps {
  improvements: Improvement[];
}

const RecentImprovements = ({ improvements }: RecentImprovementsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
          Recent Platform Improvements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {improvements.map((improvement, index) => (
            <div key={index} className="flex justify-between items-start p-4 border rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium mb-1">{improvement.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{improvement.description}</p>
                <p className="text-xs text-gray-500">Implemented: {improvement.implementedDate}</p>
              </div>
              <Badge variant="secondary">
                {improvement.userRequests} requests
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentImprovements;
