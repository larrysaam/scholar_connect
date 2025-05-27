
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, FileText, Eye, Download } from "lucide-react";
import StarRating from "./StarRating";
import { PlatformWork } from "@/types/previousWorks";

interface PlatformWorkCardProps {
  work: PlatformWork;
  onViewDetails: (workId: number, type: string) => void;
  onDownloadPortfolio: (workId: number, title: string) => void;
}

const PlatformWorkCard = ({ work, onViewDetails, onDownloadPortfolio }: PlatformWorkCardProps) => {
  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <CardTitle className="text-lg">{work.title}</CardTitle>
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={work.clientAvatar} alt={work.client} />
                <AvatarFallback>{work.client.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{work.client}</p>
                <StarRating rating={work.rating} />
              </div>
            </div>
          </div>
          <Badge className="bg-green-600">{work.projectValue}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>Completed: {work.completedDate}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>Duration: {work.duration}</span>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Client Review</h4>
          <p className="text-gray-700 text-sm italic">"{work.review}"</p>
        </div>

        <div>
          <h4 className="font-medium mb-2">Skills & Tags</h4>
          <div className="flex flex-wrap gap-2">
            {work.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Deliverables</h4>
          <div className="flex flex-wrap gap-2">
            {work.deliverables.map((deliverable, index) => (
              <div key={index} className="flex items-center space-x-1 text-sm bg-blue-50 px-2 py-1 rounded">
                <FileText className="h-3 w-3 text-blue-600" />
                <span>{deliverable}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails(work.id, "platform")}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDownloadPortfolio(work.id, work.title)}
          >
            <Download className="h-4 w-4 mr-1" />
            Download Portfolio
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformWorkCard;
