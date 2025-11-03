
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, MapPin, User, Calendar, CheckCircle, AlertCircle } from "lucide-react";

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  duration: string;
  postedBy: string;
  postedDate: string;
  deadline: string;
  location: string;
  urgency: "low" | "medium" | "high";
  status: "open" | "in_progress" | "completed";
  skills: string[];
  applicants: number;
}

interface JobCardProps {
  job: Job;
  onApply: (jobId: string, jobTitle: string) => void;
}

const JobCard = ({ job, onApply }: JobCardProps) => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "high": return <AlertCircle className="h-3 w-3" />;
      case "medium": return <Clock className="h-3 w-3" />;
      case "low": return <CheckCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-xl">{job.title}</CardTitle>
              <Badge className={`${getUrgencyColor(job.urgency)} flex items-center gap-1`}>
                {getUrgencyIcon(job.urgency)}
                {job.urgency} priority
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {job.postedBy}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Due: {new Date(job.deadline).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {job.duration}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-2xl font-bold text-primary mb-1">
              <DollarSign className="h-5 w-5" />
              {job.budget.toLocaleString()} XAF
            </div>
            <div className="text-sm text-gray-500">{job.applicants} applicants</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-700 mb-4">{job.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {job.category}
          </Badge>
          {job.skills.map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div className="text-sm text-gray-500">
            Posted on {new Date(job.postedDate).toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              View Details
            </Button>
            <Button 
              size="sm" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => onApply(job.id, job.title)}
            >
              Apply Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
