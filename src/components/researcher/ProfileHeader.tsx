
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Users, Calendar, MessageSquare } from "lucide-react";
import StatusIndicator from "./StatusIndicator";
import BookingModal from "./BookingModal";
import CoAuthorModal from "./CoAuthorModal";
import ConsultationServicesDisplay from "./ConsultationServicesDisplay";

interface ProfileHeaderProps {
  researcher: {
    id: string;
    name: string;
    title: string;
    affiliation: string;
    location: string;
    rating: number;
    totalReviews: number;
    studentsSupervised: number;
    yearsExperience: number;
    expertise: string[];
    bio: string;
    imageUrl: string;
    isOnline: boolean;
    responseTime: string;
    languages: string[];
  };
}

const ProfileHeader = ({ researcher }: ProfileHeaderProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Image and Status */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={researcher.imageUrl}
                alt={researcher.name}
                className="w-32 h-32 rounded-full object-cover"
              />
              <StatusIndicator 
                isOnline={researcher.isOnline} 
                className="absolute -bottom-2 -right-2"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-grow space-y-4">
            <div>
              <h1 className="text-2xl font-bold">{researcher.name}</h1>
              <p className="text-lg text-gray-600">{researcher.title}</p>
              <p className="text-gray-600">{researcher.affiliation}</p>
              <div className="flex items-center text-gray-500 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{researcher.location}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="font-medium">{researcher.rating}</span>
                <span className="text-gray-500 ml-1">({researcher.totalReviews} reviews)</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-blue-500 mr-1" />
                <span>{researcher.studentsSupervised} students supervised</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-green-500 mr-1" />
                <span>{researcher.yearsExperience} years experience</span>
              </div>
            </div>

            {/* Expertise Tags */}
            <div className="flex flex-wrap gap-2">
              {researcher.expertise.slice(0, 5).map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
              {researcher.expertise.length > 5 && (
                <Badge variant="outline">+{researcher.expertise.length - 5} more</Badge>
              )}
            </div>

            {/* Languages */}
            <div>
              <span className="text-sm font-medium text-gray-700">Languages: </span>
              <span className="text-sm text-gray-600">
                {researcher.languages.join(", ")}
              </span>
            </div>

            {/* Response Time */}
            <div className="text-sm text-gray-600">
              <span className="font-medium">Response time:</span> {researcher.responseTime}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 md:w-64">
            <ConsultationServicesDisplay 
              researcherId={researcher.id}
              researcherName={researcher.name}
            />
            
            <Button variant="outline" className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            
            <Button variant="outline" className="w-full">
              <Users className="h-4 w-4 mr-2" />
              Invite to Co-Author
            </Button>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold mb-2">About</h3>
          <p className="text-gray-700 leading-relaxed">{researcher.bio}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
