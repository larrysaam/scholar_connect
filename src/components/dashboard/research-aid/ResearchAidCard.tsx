import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Award, MessageCircle, Eye, Calendar } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";

interface ResearchAid {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  rating: number;
  reviewCount: number;
  avatar_url?: string | null; // Add avatar_url for profile picture
  hourly_rate?: number; // Add hourly_rate
  location?: string;    // Add location
  imageUrl?: string; // Make imageUrl optional
  completedJobs?: number;
  responseTime?: string;
  featured?: boolean;
}

interface ResearchAidCardProps {
  aid: ResearchAid;
}

const ResearchAidCard = ({ aid }: ResearchAidCardProps) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  // Use avatar_url if present, fallback to imageUrl, then placeholder
  const profileImage = aid.avatar_url || aid.imageUrl || '/placeholder.svg';

  const handleViewProfile = () => {
    setShowProfile(true);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      toast({
        title: "Message Sent!",
        description: `Your message has been sent to ${aid.name}`,
      });
      setMessage("");
      setShowMessage(false);
    } else {
      toast({
        title: "Empty Message",
        description: "Please enter a message before sending",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
        <CardContent className="p-4 sm:p-6">
          {/* Mobile-First Layout */}
          <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Profile Image and Featured Badge */}
            <div className="relative flex-shrink-0 mx-auto sm:mx-0">
              <img 
                src={profileImage} 
                alt={aid.name}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-green-100"
              />
              {aid.featured && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                  <Award className="h-2 w-2 sm:h-3 sm:w-3 text-yellow-800" />
                </div>
              )}
            </div>
            
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-2 sm:space-y-0">
                <div className="text-center sm:text-left">
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">{aid.name}</h3>
                  <p className="text-xs sm:text-sm text-green-600 font-medium truncate">{aid.title}</p>
                  <p className="text-xs sm:text-sm text-gray-500 flex items-center justify-center sm:justify-start mt-1">
                    <MapPin className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                    <span className="truncate">{aid.location || 'Location not set'}</span>
                  </p>
                </div>
                {aid.featured && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 text-xs self-center sm:self-start">
                    Featured
                  </Badge>
                )}
              </div>
              
              {/* Specializations */}
              <div className="flex flex-wrap gap-1 mb-3 justify-center sm:justify-start">
                {(aid.specializations || []).slice(0, 3).map((spec, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-700">
                    {spec}
                  </Badge>
                ))}
                {(aid.specializations || []).length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                    +{(aid.specializations || []).length - 3} more
                  </Badge>
                )}
              </div>
              
              {/* Stats Section - Stack on Mobile */}
              <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-3">
                <div className="flex items-center justify-center sm:justify-start space-x-3 sm:space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                    <span className="text-xs sm:text-sm font-medium">{(aid.rating || 0).toFixed(1)}</span>
                    <span className="text-xs sm:text-sm text-gray-500">({aid.reviewCount || 0})</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    {(aid.completedJobs || 0)} jobs
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-bold text-green-600 text-center sm:text-right">
                  {(aid.hourly_rate || 0).toLocaleString()} XAF/hr
                </div>
              </div>
              
              {/* Footer Section - Stack on Mobile */}
              <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                  Response: {aid.responseTime || 'N/A'}
                </div>
                
                {/* Action Buttons - Stack on Mobile */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowMessage(true)}
                    className="text-xs sm:text-sm h-8 sm:h-9 w-full sm:w-auto"
                  >
                    <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Message</span>
                    <span className="sm:hidden">Send Message</span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleViewProfile}
                    className="text-xs sm:text-sm h-8 sm:h-9 w-full sm:w-auto"
                  >
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Quick View</span>
                    <span className="sm:hidden">View Profile</span>
                  </Button>
                  <Button 
                    asChild 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm h-8 sm:h-9 w-full sm:w-auto"
                  >
                    <Link to={`/research-aids/${aid.id}`}>
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden sm:inline">Book Appointment</span>
                      <span className="sm:hidden">Book Now</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Modal - Mobile Responsive */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">{aid.name} - Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
              <img 
                src={profileImage}
                alt={aid.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
              />
              <div className="text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-semibold">{aid.name}</h3>
                <p className="text-green-600 font-medium text-sm sm:text-base">{aid.title}</p>
                <p className="text-gray-500 flex items-center justify-center sm:justify-start text-sm">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  {aid.location || 'Location not set'}
                </p>
              </div>
            </div>
            
            {/* Stats Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-1 text-sm">Rating & Reviews</h4>
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                  <span className="text-sm">{(aid.rating || 0).toFixed(1)} ({aid.reviewCount || 0} reviews)</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-1 text-sm">Experience</h4>
                <p className="text-sm text-center sm:text-left">{(aid.completedJobs || 0)} jobs completed</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-1 text-sm">Response Time</h4>
                <p className="text-sm text-center sm:text-left">{aid.responseTime || 'N/A'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-1 text-sm">Rate</h4>
                <p className="text-green-600 font-bold text-sm text-center sm:text-left">{(aid.hourly_rate || 0).toLocaleString()} XAF/hr</p>
              </div>
            </div>

            {/* Specializations */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2 text-sm">Specializations</h4>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {(aid.specializations || []).map((spec, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-700 text-xs">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Modal - Mobile Responsive */}
      <Dialog open={showMessage} onOpenChange={setShowMessage}>
        <DialogContent className="w-[95vw] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Send Message to {aid.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="text-sm sm:text-base"
            />
            <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
              <Button 
                onClick={handleSendMessage} 
                className="w-full sm:flex-1 text-sm sm:text-base h-9 sm:h-10"
              >
                Send Message
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowMessage(false)}
                className="w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResearchAidCard;
