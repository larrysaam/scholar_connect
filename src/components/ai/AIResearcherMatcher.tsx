
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Brain, Zap, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAIRecommendations } from "@/services/geminiService";

interface MatchedResearcher {
  id: string;
  name: string;
  title: string;
  subtitle: string; // Added this line
  institution: string;
  field: string;
  rating: number;
  matchScore: number;
  specialties: string[];
  hourlyRate: number;
  imageUrl: string;
  matchReasons: string[];
}

const AIResearcherMatcher = () => {
  const [isMatching, setIsMatching] = useState(false);
  const [matches, setMatches] = useState<MatchedResearcher[]>([]);
  const { toast } = useToast();

  const handleAIMatch = async () => {
    setIsMatching(true);

    // In a real app, this data would come from your database or API.
    const researchers = [
      {
        id: "1",
        name: "Dr. Sarah Johnson",
        title: "Associate Professor",
        institution: "Stanford University",
        field: "Computer Science",
        rating: 4.9,
        specialties: ["Machine Learning", "AI Ethics", "Data Mining"],
        hourlyRate: 72000,
        imageUrl: "/placeholder-avatar.jpg",
      },
      {
        id: "2",
        name: "Dr. Michael Chen",
        title: "Research Scientist",
        institution: "MIT",
        field: "Computer Science",
        rating: 4.8,
        specialties: ["Neural Networks", "Deep Learning", "Computer Vision"],
        hourlyRate: 78000,
        imageUrl: "/placeholder-avatar.jpg",
      }
    ];

    // This would come from the logged-in student's profile
    const studentInfo = {
      researchInterests: ["Machine Learning", "AI Ethics"],
      challenges: ["Finding relevant literature", "Formulating a research question"]
    };

    try {
      // 1. Get high-level recommendations from the AI
      const recommendationsFromAI = await getAIRecommendations(studentInfo, researchers);

      // 2. Merge AI recommendations with full researcher data
      const enhancedMatches = recommendationsFromAI.map(rec => {
        const originalResearcher = researchers.find(r => r.name === rec.researcher);
        if (!originalResearcher) return null;

        return {
          ...originalResearcher,
          matchScore: rec.matchScore,
          matchReasons: [rec.explanation], // Adapt AI explanation to matchReasons array
        };
      }).filter(Boolean) as MatchedResearcher[]; // Filter out nulls and assert type

      setMatches(enhancedMatches);

      toast({
        title: "AI Matching Complete!",
        description: `Found ${enhancedMatches.length} highly compatible researchers for you.`
      });
    } catch (error) {
      toast({
        title: "AI Matching Failed",
        description: "Could not fetch recommendations. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsMatching(false);
    }
  };

  const handleBookConsultation = (researcher: MatchedResearcher) => {
    toast({
      title: "Booking Consultation",
      description: `Initiating booking process with ${researcher.subtitle} ${researcher.name}`
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-purple-600" />
          <span>AI Researcher Matcher</span>
        </CardTitle>
        <p className="text-gray-600">
          Our AI analyzes your research interests, project requirements, and preferences to find the perfect researchers for you.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {matches.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Ready to find your perfect research mentor?</p>
            <Button 
              onClick={handleAIMatch} 
              disabled={isMatching}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isMatching ? (
                <>
                  <Zap className="mr-2 h-4 w-4 animate-pulse" />
                  AI Matching in Progress...
                </>
              ) : (
                <>
                  <Target className="mr-2 h-4 w-4" />
                  Find My Perfect Match
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-700 flex items-center">
              <Target className="mr-2 h-5 w-5" />
              AI-Matched Researchers ({matches.length})
            </h3>
            
            {matches.map((researcher) => (
              <Card key={researcher.id} className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={researcher.imageUrl} alt={researcher.name} />
                        <AvatarFallback>{researcher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-lg">{researcher.subtitle} {researcher.name}</h4>
                          <Badge className="bg-purple-100 text-purple-800">
                            {researcher.matchScore}% Match
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-1">{researcher.title}</p>
                        <p className="text-sm text-gray-500 mb-2">{researcher.institution}</p>
                        
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < Math.floor(researcher.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                            <span className="ml-1 text-sm font-medium">{researcher.rating}</span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {researcher.hourlyRate.toLocaleString()} XAF/hour
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {researcher.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h5 className="text-sm font-medium text-green-800 mb-2">Why this is a great match:</h5>
                          <ul className="text-sm text-green-700 space-y-1">
                            {researcher.matchReasons.map((reason, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-600 mr-2">•</span>
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button 
                        onClick={() => handleBookConsultation(researcher)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Book Consultation
                      </Button>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={handleAIMatch}>
                Find More Matches
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIResearcherMatcher;
