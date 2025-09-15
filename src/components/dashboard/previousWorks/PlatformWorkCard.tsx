import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, FileText, Download, Upload, X } from "lucide-react"; // Removed Eye
import StarRating from "./StarRating";
import { PlatformWork } from "@/types/previousWorks";

interface PlatformWorkCardProps {
  work: PlatformWork;
  onViewDetails: (workId: number, type: string) => void;
  onDownloadPortfolio: (workId: number, title: string) => void;
  onPreviewDeliverable: (url: string, name: string) => void;
  onUploadFile: (workId: string) => void; // New prop
  onDeleteDeliverable: (workId: string, deliverableUrl: string) => void; // New prop
}

const PlatformWorkCard = ({ work, onViewDetails, onDownloadPortfolio, onPreviewDeliverable, onUploadFile, onDeleteDeliverable }: PlatformWorkCardProps) => {
  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
          <div className="space-y-2 flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg truncate pr-2">{work.title}</CardTitle>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                <AvatarImage src={work.clientAvatar} alt={work.client} />
                <AvatarFallback className="text-xs sm:text-sm">{work.client.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-xs sm:text-sm truncate">{work.client}</p>
                <StarRating rating={work.rating} />
              </div>
            </div>
          </div>
          <Badge className="bg-green-600 text-xs sm:text-sm whitespace-nowrap self-start">{work.projectValue}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
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
          <h4 className="font-medium mb-2 text-sm sm:text-base">Client Review</h4>
          <p className="text-gray-700 text-xs sm:text-sm italic line-clamp-3">"{work.review}"</p>
        </div>

        <div>
          <h4 className="font-medium mb-2 text-sm sm:text-base">Skills & Tags</h4>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {work.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-1">{tag}</Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2 text-sm sm:text-base">Deliverables</h4>
          <div className="space-y-2">
            {work.deliverables.map((deliverable, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <a
                  href={deliverable.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors flex-1 min-w-0"
                >
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">{deliverable.name}</span>
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteDeliverable(work.id.toString(), deliverable.url)}
                  className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 hover:text-red-700 flex-shrink-0 ml-2"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(work.id, "platform")}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">View Details</span>
            <span className="sm:hidden">Details</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownloadPortfolio(work.id, work.title)}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden sm:inline">Download Portfolio</span>
            <span className="sm:hidden">Download</span>
          </Button>
          <Button // New Upload Button
            variant="outline"
            size="sm"
            onClick={() => onUploadFile(work.id.toString())}
            className="w-full sm:w-auto text-xs sm:text-sm"
          >
            <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden sm:inline">Upload File</span>
            <span className="sm:hidden">Upload</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformWorkCard;