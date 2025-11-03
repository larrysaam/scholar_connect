
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIBioGeneratorProps {
  currentBio: string;
  profileData: any;
  onBioGenerated: (newBio: string) => void;
  userType: "student" | "researcher";
}

const AIBioGenerator = ({ currentBio, profileData, onBioGenerated, userType }: AIBioGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBio, setGeneratedBio] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const generateBio = async () => {
    setIsGenerating(true);
    try {
      // Simulate AI bio generation based on profile data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let bio = "";
      if (userType === "researcher") {
        bio = `${profileData.name} is a ${profileData.title} at ${profileData.institution} specializing in ${profileData.specialties?.join(", ") || "research"}. With extensive experience in ${profileData.department}, they bring valuable expertise to academic consultations and research collaborations.`;
      } else {
        bio = `${profileData.name} is a ${profileData.level || "student"} at ${profileData.university || profileData.institution} pursuing studies in ${profileData.department}. Their research interests include ${profileData.specialties?.join(", ") || "various academic fields"}, and they are actively engaged in advancing their academic knowledge through collaborative research.`;
      }
      
      setGeneratedBio(bio);
      toast({
        title: "Bio Generated Successfully",
        description: "Your AI-generated bio is ready for review.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate bio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const acceptBio = () => {
    onBioGenerated(generatedBio);
    setIsOpen(false);
    toast({
      title: "Bio Updated",
      description: "Your bio has been updated with the AI-generated content.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <Sparkles className="h-4 w-4 mr-2" />
          Generate with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Bio Generator
          </DialogTitle>
          <DialogDescription>
            Generate a professional bio based on your profile information
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Current Bio:</h4>
            <Textarea value={currentBio} readOnly rows={3} />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={generateBio} 
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isGenerating ? "Generating..." : "Generate Bio"}
            </Button>
          </div>
          
          {generatedBio && (
            <div>
              <h4 className="font-medium mb-2">Generated Bio:</h4>
              <Textarea 
                value={generatedBio} 
                onChange={(e) => setGeneratedBio(e.target.value)}
                rows={4}
                placeholder="Generated bio will appear here..."
              />
              <div className="flex gap-2 mt-2">
                <Button onClick={acceptBio}>
                  Accept Bio
                </Button>
                <Button variant="outline" onClick={() => setGeneratedBio("")}>
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIBioGenerator;
