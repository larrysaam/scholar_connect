
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Lightbulb, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client"; // Import supabase
import { useAuth } from "@/hooks/useAuth"; // Import useAuth

const SuggestionBox = () => {
  const [suggestionText, setSuggestionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission loading
  const { toast } = useToast();
  const { user } = useAuth(); // Get current user

  const handleSubmitSuggestion = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a suggestion.",
        variant: "destructive"
      });
      return;
    }

    if (!suggestionText.trim()) {
      toast({
        title: "Error",
        description: "Please enter your suggestion",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    console.log("Attempting to submit suggestion...");
    console.log("Current user:", user);
    try {
      const { error } = await supabase.from("feedback").insert({
        user_id: user.id,
        rating: 0, // Default rating for suggestions
        category: "Suggestion", // Default category for suggestions
        text: suggestionText,
      });

      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }

      toast({
        title: "Suggestion Submitted",
        description: "Your suggestion has been forwarded to our development team"
      });

      setSuggestionText("");
    } catch (err: any) {
      toast({
        title: "Submission Error",
        description: err.message || "Failed to submit suggestion. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
          Suggest Improvements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="suggestion-text">How can we improve ScholarConnect?</Label>
            <Textarea
              id="suggestion-text"
              placeholder="Share your ideas for new features, improvements, or any changes you'd like to see..."
              value={suggestionText}
              onChange={(e) => setSuggestionText(e.target.value)}
              rows={4}
              disabled={isSubmitting}
            />
          </div>
          <Button onClick={handleSubmitSuggestion} disabled={isSubmitting}>
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? "Submitting..." : "Submit Suggestion"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuggestionBox;
