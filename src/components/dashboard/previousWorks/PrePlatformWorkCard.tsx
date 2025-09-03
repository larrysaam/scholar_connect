import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Eye } from "lucide-react";
import { PrePlatformWork } from "@/types/previousWorks";

interface PrePlatformWorkCardProps {
  work: PrePlatformWork;
  onViewDetails: (workId: number, type: string) => void;
  onViewCertificate: (workId: number, title: string) => void;
}

const PrePlatformWorkCard = ({ work, onViewDetails, onViewCertificate }: PrePlatformWorkCardProps) => {
  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="text-lg">{work.title}</CardTitle>
          <p className="text-sm text-gray-600 font-medium">{work.institution}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>Completed: {new Date(work.completedDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>Duration: {work.duration}</span>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Project Description</h4>
          <p className="text-gray-700 text-sm">{work.description}</p>
        </div>

        <div>
          <h4 className="font-medium mb-2">Skills & Tags</h4>
          <div className="flex flex-wrap gap-2">
            {work.tags.map((tag, index) => (
              <Badge key={index} variant="outline">{tag}</Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Key Outcomes</h4>
          <div className="flex flex-wrap gap-2">
            {work.outcomes.map((outcome, index) => (
              <div key={index} className="flex items-center space-x-1 text-sm bg-green-50 px-2 py-1 rounded">
                <FileText className="h-3 w-3 text-green-600" />
                <span>{outcome}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails(work.id, "pre-platform")}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewCertificate(work.id, work.title)}
          >
            <FileText className="h-4 w-4 mr-1" />
            View Certificate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrePlatformWorkCard;