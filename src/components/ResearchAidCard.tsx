
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import VerificationBadge from "@/components/verification/VerificationBadge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";

interface ResearchAidCardProps {
  id: string;
  name: string;
  title: string;
  specialization: string;
  skills: string[];
  hourlyRate: number;
  rating: number;
  reviews: number;
  imageUrl: string;
  languages: string[];
  company: string;
  acceptedJobs: number;
  verifications?: {
    academic: "verified" | "pending" | "unverified";
    publication: "verified" | "pending" | "unverified";
    institutional: "verified" | "pending" | "unverified";
  };
}

const ResearchAidCard = ({ 
  id,
  name,
  title,
  specialization,
  skills,
  hourlyRate,
  rating,
  reviews,
  imageUrl,
  languages,
  company,
  acceptedJobs,
  verifications = {
    academic: "unverified",
    publication: "unverified", 
    institutional: "unverified"
  }
}: ResearchAidCardProps) => {
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (message.trim()) {
      toast({
        title: "Message Sent!",
        description: `Your message has been sent to ${name}`,
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
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full bg-green-100">
            <img 
              src={imageUrl} 
              alt={name} 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white to-transparent pt-16">
              <div className="flex items-end">            <div className="h-20 w-20 rounded-full bg-white border-4 border-white shadow-sm overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-primary flex items-center justify-center text-2xl font-semibold text-white">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <CardTitle className="text-lg font-semibold">{name}</CardTitle>
              <CardDescription className="text-sm">{title} at {company}</CardDescription>
            </div>
            
          </div>

          {/* Single Verification Badge */}
          <div className="flex items-center mb-4">
            <VerificationBadge 
              type="overall" 
              status="verified" 
              size="md" 
              verifications={verifications}
            />
          </div>
          
          <div className="mt-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{skills.length - 3} more
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {languages.map((language, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                  {language}
                </Badge>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-4">              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="flex items-center">
                    {Array(5).fill(0).map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <span className="ml-1 text-sm text-gray-600">{rating} ({reviews})</span>
                </div>
                <div className="flex items-center">
                  <Badge variant="secondary" className="text-xs">
                    {acceptedJobs} Jobs
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-xl font-bold text-gray-900">{hourlyRate} XAF</span>
                <span className="block text-xs text-gray-500">per hour</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 bg-gray-50 flex space-x-2">
        
          <Button asChild className="flex-1">
            <Link to={`/research-aids/${id}`}>View Profile</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Message Modal */}
      <Dialog open={showMessage} onOpenChange={setShowMessage}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message to {name}</DialogTitle>
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
