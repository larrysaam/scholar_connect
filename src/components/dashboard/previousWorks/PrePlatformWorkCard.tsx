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
      <CardHeader className="p-4 sm:p-6">
        <div className="space-y-2">
          <CardTitle className="text-base sm:text-lg line-clamp-2">{work.title}</CardTitle>
          <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">{work.institution}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
            <span className="truncate">Completed: {new Date(work.completedDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
            <span className="truncate">Duration: {work.duration}</span>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2 text-sm sm:text-base">Project Description</h4>
          <p className="text-gray-700 text-xs sm:text-sm line-clamp-3">{work.description}</p>
        </div>

        <div>
          <h4 className="font-medium mb-2 text-sm sm:text-base">Skills & Tags</h4>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {work.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-1">{tag}</Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2 text-sm sm:text-base">Key Outcomes</h4>
          <div className="flex flex-wrap gap-1 sm:gap-2">            {work.outcomes.map((outcome, index) => (
              <div key={index} className="flex items-center space-x-1 text-xs sm:text-sm bg-green-50 px-2 py-1 rounded">
                <FileText className="h-3 w-3 text-green-600 flex-shrink-0" />
                <span className="truncate">{outcome}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails(work.id, "pre-platform")}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden sm:inline">View Details</span>
            <span className="sm:hidden">Details</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewCertificate(work.id, work.title)}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden sm:inline">View Certificate</span>
            <span className="sm:hidden">Certificate</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrePlatformWorkCard;