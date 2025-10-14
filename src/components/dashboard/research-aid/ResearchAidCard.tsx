import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Award, MessageCircle, Eye, Calendar, CheckCircle } from "lucide-react";
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
  admin_verified?: boolean; // Add admin verification status
  acceptedJobsCount?: number;
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
      <Card className="hover:shadow-lg transition-shadow duration-200 border border-gray-200 hover:border-gray-300 bg-white">
        <CardContent className="p-4">
          <div className="space-y-3">
            
            {/* Header - Profile Info */}
            <div className="flex items-start space-x-3">
              <div className="relative flex-shrink-0">
                <img 
                  src={profileImage} 
                  alt={aid.name}
                  className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {aid.name}
                    </h3>
                    <p className="text-sm text-blue-600 truncate">{aid.title}</p>
                    <div className="flex items-center text-gray-500 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="text-xs truncate">{aid.location || 'Location not set'}</span>
                    </div>
                  </div>
                  
                  {aid.featured && (
                    <Badge className="bg-yellow-500 text-white text-xs ml-2">
                      ⭐
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Skills & Verification */}
            <div className="flex flex-wrap gap-1">
              {(aid.specializations || []).slice(0, 2).map((spec, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                  {spec}
                </Badge>
              ))}
              {(aid.specializations || []).length > 2 && (
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                  +{(aid.specializations || []).length - 2}
                </Badge>
              )}
              {aid.admin_verified && (
                <Badge className="bg-green-500 text-white text-xs">
                  ✓ Verified
                </Badge>
              )}
            </div>
            
            {/* Job Stats */}
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center text-xs text-gray-600">
                <Award className="h-3 w-3 mr-1 text-green-500" />
                <span>{aid.completedJobs || 0} Done</span>
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <CheckCircle className="h-3 w-3 mr-1 text-purple-500" />
                <span>{aid.acceptedJobsCount || 0} Accepted</span>
              </div>
            </div>
            
            {/* Stats & Price */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              {/* <div className="flex items-center space-x-2">
                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                  <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                  <span className="text-xs font-medium text-yellow-700">{(aid.rating || 0).toFixed(1)}</span>
                </div>
                <span className="text-xs text-gray-500">{aid.reviewCount || 0} reviews</span>
              </div> */}
              
              {aid.hourly_rate && (
                <div className="text-sm font-semibold text-green-600">
                  {aid.hourly_rate.toLocaleString()} XAF/hr
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleViewProfile}
                className="flex-1"
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              {/* <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowMessage(true)}
                className="flex-1"
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                Message
              </Button> */}
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white flex-1"
                asChild
              >
                <Link to={`/research-aids/${aid.id}`}>
                  <Calendar className="h-3 w-3 mr-1" />
                  Book
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Modal - Simple Design */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              {aid.name} - Profile
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <img 
                src={profileImage}
                alt={aid.name}
                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{aid.name}</h3>
                <p className="text-blue-600 font-medium">{aid.title}</p>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{aid.location || 'Location not set'}</span>
                </div>
                {aid.featured && (
                  <Badge className="bg-yellow-500 text-white mt-2">
                    ⭐ Featured
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-3 bg-yellow-50 rounded-lg text-center border border-yellow-200">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="font-bold text-gray-900">{(aid.rating || 0).toFixed(1)}/5</div>
                <div className="text-sm text-gray-600">{aid.reviewCount || 0} reviews</div>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg text-center border border-green-200">
                <Award className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="font-bold text-gray-900">{aid.completedJobs || 0}</div>
                <div className="text-sm text-gray-600">Jobs Done</div>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg text-center border border-purple-200">
                <CheckCircle className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="font-bold text-gray-900">{aid.acceptedJobsCount || 0}</div>
                <div className="text-sm text-gray-600">Jobs Accepted</div>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg text-center border border-blue-200">
                <MessageCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="font-bold text-gray-900">{aid.responseTime || 'N/A'}</div>
                <div className="text-sm text-gray-600">Response Time</div>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg text-center border border-green-200">
                <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-xs">XAF</span>
                </div>
                <div className="font-bold text-green-600">{(aid.hourly_rate || 0).toLocaleString()}</div>
                <div className="text-sm text-gray-600">Per Hour</div>
              </div>
            </div>

            {/* Specializations */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Specializations</h4>
              <div className="flex flex-wrap gap-2">
                {(aid.specializations || []).map((spec, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="bg-gray-100 text-gray-700"
                  >
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                onClick={() => setShowMessage(true)}
                variant="outline"
                className="flex-1"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button 
                asChild
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Link to={`/research-aids/${aid.id}`}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Now
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Modal */}
      <Dialog open={showMessage} onOpenChange={setShowMessage}>
        <DialogContent className="w-[95vw] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900">
              Send Message to {aid.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Research Aid Info */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <img 
                src={profileImage} 
                alt={aid.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900">{aid.name}</p>
                <p className="text-sm text-blue-600">{aid.title}</p>
              </div>
            </div>
            
            {/* Message Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Your Message</label>
              <Textarea
                placeholder="Type your message here... Be specific about your requirements and timeline."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="text-sm resize-none"
              />
              <p className="text-xs text-gray-500">
                {message.length}/500 characters
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={handleSendMessage} 
                disabled={!message.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowMessage(false);
                  setMessage("");
                }}
                className="flex-1"
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
