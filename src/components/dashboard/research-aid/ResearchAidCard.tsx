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
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <img 
                src={profileImage} 
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
                    {aid.location || 'Location not set'}
                  </p>
                </div>
                {aid.featured && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                    Featured
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {(aid.specializations || []).map((spec, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-700">
                    {spec}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{(aid.rating || 0).toFixed(1)}</span>
                    <span className="text-sm text-gray-500">({aid.reviewCount || 0})</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {(aid.completedJobs || 0)} jobs completed
                  </div>
                </div>
                <div className="text-sm font-bold text-green-600">
                  {(aid.hourly_rate || 0).toLocaleString()} XAF/hr
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Response time: {aid.responseTime || 'N/A'}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowMessage(true)}>
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleViewProfile}>
                    <Eye className="h-4 w-4 mr-1" />
                    Quick View
                  </Button>
                  <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
                    <Link to={`/research-aids/${aid.id}`}>
                      <Calendar className="h-4 w-4 mr-1" />
                      Book Appointment
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Modal */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{aid.name} - Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img 
                src={profileImage}
                alt={aid.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold">{aid.name}</h3>
                <p className="text-green-600 font-medium">{aid.title}</p>
                <p className="text-gray-500 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {aid.location || 'Location not set'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Rating & Reviews</h4>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>{(aid.rating || 0).toFixed(1)} ({aid.reviewCount || 0} reviews)</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Experience</h4>
                <p>{(aid.completedJobs || 0)} jobs completed</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Response Time</h4>
                <p>{aid.responseTime || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Rate</h4>
                <p className="text-green-600 font-bold">{(aid.hourly_rate || 0).toLocaleString()} XAF/hr</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Specializations</h4>
              <div className="flex flex-wrap gap-2">
                {(aid.specializations || []).map((spec, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-700">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Modal */}
      <Dialog open={showMessage} onOpenChange={setShowMessage}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message to {aid.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
            <div className="flex space-x-2">
              <Button onClick={handleSendMessage} className="flex-1">
                Send Message
              </Button>
              <Button variant="outline" onClick={() => setShowMessage(false)}>
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
