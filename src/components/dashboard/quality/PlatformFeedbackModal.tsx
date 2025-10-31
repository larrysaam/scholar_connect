import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PlatformFeedbackModalProps {
  feedbackCategories: string[];
}

const PlatformFeedbackModal: React.FC<PlatformFeedbackModalProps> = ({ feedbackCategories }) => {
  const [isOpen, setIsOpen] = useState(false); // State to control dialog open/close
  const [selectedRating, setSelectedRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmitPlatformFeedback = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit feedback.",
        variant: "destructive"
      });
      return;
    }
    if (selectedRating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating.",
        variant: "destructive"
      });
      return;
    }
    if (!feedbackCategory) {
      toast({
        title: "Category Required",
        description: "Please select a feedback category.",
        variant: "destructive"
      });
      return;
    }
    if (!feedbackText.trim()) {
      toast({
        title: "Feedback Required",
        description: "Please provide some feedback text.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    console.log("Attempting to submit feedback...");
    console.log("Current user:", user);
    try {
      const { error } = await supabase.from("feedback").insert({
        user_id: user.id,
        rating: selectedRating,
        category: feedbackCategory,
        text: feedbackText,
      });

      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }

      toast({
        title: "Feedback Submitted",
        description: "Thank you for helping us improve ResearchTandem!"
      });

      // Reset form and close dialog
      setSelectedRating(0);
      setFeedbackText("");
      setFeedbackCategory("");
      setIsOpen(false); // Close the dialog

    } catch (err: any) {
      toast({
        title: "Submission Error",
        description: err.message || "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <MessageSquare className="h-4 w-4 mr-2" />
          Rate Platform
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Rate ResearchTandem Platform</DialogTitle>
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
              placeholder="Tell us about your experience with ResearchTandem..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={4}
              disabled={isSubmitting}
            />
          </div>
          <Button onClick={handleSubmitPlatformFeedback} className="w-full" disabled={isSubmitting}>
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlatformFeedbackModal;