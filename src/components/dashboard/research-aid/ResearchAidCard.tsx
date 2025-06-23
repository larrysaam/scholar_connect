
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Award, MessageCircle, Eye } from "lucide-react";

interface ResearchAid {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  location: string;
  imageUrl: string;
  completedJobs: number;
  responseTime: string;
  featured: boolean;
}

interface ResearchAidCardProps {
  aid: ResearchAid;
}

const ResearchAidCard = ({ aid }: ResearchAidCardProps) => (
  <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
    <CardContent className="p-6">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <img 
            src={aid.imageUrl} 
            alt={aid.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-green-100"
          />
          {aid.featured && (
            <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
              <Award className="h-3 w-3 text-yellow-800" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{aid.name}</h3>
              <p className="text-sm text-green-600 font-medium">{aid.title}</p>
              <p className="text-sm text-gray-500 flex items-center mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                {aid.location}
              </p>
            </div>
            {aid.featured && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                Featured
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {aid.specializations.map((spec, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-700">
                {spec}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{aid.rating}</span>
                <span className="text-sm text-gray-500">({aid.reviewCount})</span>
              </div>
              <div className="text-sm text-gray-600">
                {aid.completedJobs} jobs completed
              </div>
            </div>
            <div className="text-sm font-bold text-green-600">
              {aid.hourlyRate.toLocaleString()} XAF/hr
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Response time: {aid.responseTime}
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <MessageCircle className="h-4 w-4 mr-1" />
                Message
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Eye className="h-4 w-4 mr-1" />
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ResearchAidCard;
