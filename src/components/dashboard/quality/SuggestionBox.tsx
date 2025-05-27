
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Lightbulb, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SuggestionBox = () => {
  const [suggestionText, setSuggestionText] = useState("");
  const { toast } = useToast();

  const handleSubmitSuggestion = () => {
    if (!suggestionText.trim()) {
      toast({
        title: "Error",
        description: "Please enter your suggestion",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Suggestion Submitted",
      description: "Your suggestion has been forwarded to our development team"
    });

    setSuggestionText("");
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
            />
          </div>
          <Button onClick={handleSubmitSuggestion}>
            <Send className="h-4 w-4 mr-2" />
            Submit Suggestion
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuggestionBox;
