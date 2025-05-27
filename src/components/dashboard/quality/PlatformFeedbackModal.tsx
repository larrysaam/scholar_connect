
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Star, MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FeedbackFormData } from "@/types/qualityFeedback";

interface PlatformFeedbackModalProps {
  feedbackCategories: string[];
}

const PlatformFeedbackModal = ({ feedbackCategories }: PlatformFeedbackModalProps) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState("");
  const { toast } = useToast();

  const handleSubmitPlatformFeedback = () => {
    if (!selectedRating || !feedbackText.trim() || !feedbackCategory) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Feedback Submitted",
      description: "Thank you for helping us improve ScholarConnect!"
    });

    setSelectedRating(0);
    setFeedbackText("");
    setFeedbackCategory("");
  };

  const renderStars = (rating: number, interactive = false, size = "h-4 w-4") => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`${size} cursor-pointer transition-colors ${
          index < rating 
            ? "text-yellow-400 fill-current" 
            : interactive 
              ? "text-gray-300 hover:text-yellow-300" 
              : "text-gray-300"
        }`}
        onClick={interactive ? () => setSelectedRating(index + 1) : undefined}
      />
    ));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <MessageSquare className="h-4 w-4 mr-2" />
          Rate Platform
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Rate ScholarConnect Platform</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Overall Platform Rating</Label>
            <div className="flex items-center space-x-1 mt-2">
              {renderStars(selectedRating, true, "h-6 w-6")}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {selectedRating === 0 && "Select a rating"}
              {selectedRating === 1 && "Poor - Needs major improvements"}
              {selectedRating === 2 && "Fair - Several issues to address"}
              {selectedRating === 3 && "Good - Generally satisfactory"}
              {selectedRating === 4 && "Very Good - Minor improvements needed"}
              {selectedRating === 5 && "Excellent - Highly satisfied"}
            </p>
          </div>
          <div>
            <Label htmlFor="feedback-category">Feedback Category</Label>
            <select
              id="feedback-category"
              value={feedbackCategory}
              onChange={(e) => setFeedbackCategory(e.target.value)}
              className="w-full p-2 border rounded-md mt-1"
            >
              <option value="">Select category</option>
              {feedbackCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="feedback-text">Your Feedback</Label>
            <Textarea
              id="feedback-text"
              placeholder="Tell us about your experience with ScholarConnect..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={4}
            />
          </div>
          <Button onClick={handleSubmitPlatformFeedback} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Submit Feedback
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlatformFeedbackModal;
