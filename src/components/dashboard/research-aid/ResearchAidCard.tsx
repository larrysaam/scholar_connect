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
  admin_verified?: boolean; // Add admin verification status
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
      <Card className="group relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-green-50/50 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 border-0 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />
        
        <CardContent className="p-4 sm:p-6 relative">
          <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-shrink-0 mx-auto sm:mx-0">
              <div className="relative">
                <img 
                  src={profileImage} 
                  alt={aid.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-3 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              </div>
              {aid.featured && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 shadow-lg animate-bounce">
                  <Award className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 w-full text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">
                    {aid.name}
                  </h3>
                  <p className="text-sm text-emerald-600 font-semibold bg-emerald-100 px-3 py-1 rounded-full inline-block">
                    {aid.title}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center justify-center sm:justify-start mt-2">
                    <MapPin className="h-4 w-4 mr-1 text-emerald-500" />
                    {aid.location || 'Location not set'}
                  </p>
                </div>
                {aid.featured && (
                  <Badge className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white border-0 shadow-lg mt-2 sm:mt-0 mx-auto sm:mx-0">
                    ⭐ Featured
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-4">
                {(aid.specializations || []).slice(0, 3).map((spec, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 hover:from-emerald-200 hover:to-green-200 transition-all">
                    {spec}
                  </Badge>
                ))}
                {(aid.specializations || []).length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-700">
                    +{(aid.specializations || []).length - 3} more
                  </Badge>
                )}
                {aid.admin_verified && (
                  <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-sm">
                    ✓ Verified
                  </Badge>
                )}
              </div>
              
              {/* Rating and Price Section */}
              <div className="flex flex-col space-y-3 mb-4">
                <div className="flex items-center justify-center sm:justify-start space-x-4">
                  <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-bold text-yellow-700">{(aid.rating || 0).toFixed(1)}</span>
                    <span className="text-sm text-yellow-600">({aid.reviewCount || 0})</span>
                  </div>
                  
                </div>
                
                {/* Action Buttons - Always Visible and Prominent */}
                <div className="space-y-2">
                  {/* Primary Action - Book Appointment (Most Prominent) */}
                  <Button 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 font-semibold"
                    asChild
                  >
                    <Link to={`/research-aids/${aid.id}`} className="flex items-center justify-center py-2">
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                      Book Appointment Now
                    </Link>
                  </Button>
                  
                  {/* Secondary Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleViewProfile}
                      className="bg-white/80 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      <span className="text-xs sm:text-sm">Profile</span>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowMessage(true)}
                      className="bg-white/80 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span className="text-xs sm:text-sm">Message</span>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-center sm:justify-start space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>{(aid.completedJobs || 0)} jobs completed</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Response: {aid.responseTime || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Modal - Modern Design */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-emerald-50/30">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent">
              {aid.name} - Profile
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Enhanced Header Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
              <div className="relative">
                <img 
                  src={profileImage}
                  alt={aid.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-xl border-4 border-white"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{aid.name}</h3>
                <p className="text-emerald-600 font-semibold bg-emerald-100 px-4 py-2 rounded-full inline-block mb-3">{aid.title}</p>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <p className="text-gray-600 flex items-center justify-center sm:justify-start">
                    <MapPin className="h-4 w-4 mr-2 text-emerald-500" />
                    {aid.location || 'Location not set'}
                  </p>
                  {aid.featured && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                      ⭐ Featured Research Aid
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 text-center">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{(aid.rating || 0).toFixed(1)}/5</h4>
                <p className="text-sm text-gray-600">{aid.reviewCount || 0} reviews</p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200 text-center">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{(aid.completedJobs || 0)}</h4>
                <p className="text-sm text-gray-600">Jobs Completed</p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{aid.responseTime || 'N/A'}</h4>
                <p className="text-sm text-gray-600">Response Time</p>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-sm">XAF</span>
                </div>
                <h4 className="font-bold text-green-600 mb-1">{(aid.hourly_rate || 0).toLocaleString()}</h4>
                <p className="text-sm text-gray-600">Per Hour</p>
              </div>
            </div>

            {/* Enhanced Specializations */}
            <div className="p-6 bg-gradient-to-br from-white to-emerald-50/50 rounded-2xl border border-emerald-100 shadow-lg">
              <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                  <Award className="h-4 w-4 text-white" />
                </div>
                Specializations & Expertise
              </h4>
              <div className="flex flex-wrap gap-3">
                {(aid.specializations || []).map((spec, index) => (
                  <Badge 
                    key={index} 
                    className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-300 px-4 py-2 rounded-full text-sm hover:from-emerald-200 hover:to-green-200 transition-all"
                  >
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={() => setShowMessage(true)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button 
                asChild
                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link to={`/research-aids/${aid.id}`}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Message Modal */}
      <Dialog open={showMessage} onOpenChange={setShowMessage}>
        <DialogContent className="w-[95vw] max-w-lg bg-gradient-to-br from-white to-blue-50/30">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Send Message to {aid.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Research Aid Info */}
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
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
                rows={5}
                className="text-sm border-2 border-blue-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-xl resize-none"
              />
              <p className="text-xs text-gray-500">
                {message.length}/500 characters
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                onClick={handleSendMessage} 
                disabled={!message.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
                className="w-full sm:w-auto border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
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
