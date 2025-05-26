
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Brain, Zap, Target, TrendingUp } from "lucide-react";

interface MatchedExpert {
  id: string;
  name: string;
  title: string;
  matchScore: number;
  image?: string;
  skills: string[];
  hourlyRate: number;
  availability: string;
  matchReasons: string[];
}

interface AIMatchingEngineProps {
  taskDescription?: string;
  taskCategory?: string;
  budget?: number;
}

const AIMatchingEngine = ({ taskDescription, taskCategory, budget }: AIMatchingEngineProps) => {
  const [isMatching, setIsMatching] = useState(false);
  const [matches, setMatches] = useState<MatchedExpert[]>([]);

  const mockMatches: MatchedExpert[] = [
    {
      id: "1",
      name: "Dr. Marie Ngono",
      title: "Statistical Analysis Expert",
      matchScore: 95,
      image: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png",
      skills: ["SPSS", "R", "STATA", "Data Analysis"],
      hourlyRate: 15000,
      availability: "Available",
      matchReasons: ["Perfect skill match", "Within budget", "High rating", "Available now"]
    },
    {
      id: "2",
      name: "Emmanuel Talla",
      title: "Research Methodology Expert",
      matchScore: 88,
      image: "/lovable-uploads/327ccde5-c0c9-443a-acd7-4570799bb7f8.png",
      skills: ["Survey Design", "Data Collection", "Analysis"],
      hourlyRate: 12500,
      availability: "Available",
      matchReasons: ["Similar project experience", "Excellent reviews", "Fast turnaround"]
    }
  ];

  const handleFindMatches = () => {
    setIsMatching(true);
    setTimeout(() => {
      setMatches(mockMatches);
      setIsMatching(false);
    }, 2000);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <span>AI-Powered Matching</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {!matches.length && !isMatching && (
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <Target className="h-8 w-8 text-purple-600 mx-auto" />
              <p className="text-sm text-gray-600">
                Get AI-powered matches based on your specific requirements
              </p>
            </div>
            <Button onClick={handleFindMatches} className="w-full bg-purple-600 hover:bg-purple-700">
              <Zap className="h-4 w-4 mr-2" />
              Find Perfect Matches
            </Button>
          </div>
        )}

        {isMatching && (
          <div className="text-center space-y-4">
            <div className="animate-spin h-8 w-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-sm text-gray-600">Analyzing your requirements...</p>
          </div>
        )}

        {matches.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">
                Found {matches.length} perfect matches!
              </span>
            </div>

            {matches.map((match) => (
              <Card key={match.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={match.image} alt={match.name} />
                      <AvatarFallback>{match.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{match.name}</h4>
                          <p className="text-sm text-gray-600">{match.title}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getMatchScoreColor(match.matchScore)}`}>
                            {match.matchScore}%
                          </div>
                          <p className="text-xs text-gray-500">Match</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {match.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="text-xs text-gray-600 mb-2">
                        {match.hourlyRate.toLocaleString()} FCFA/hour • {match.availability}
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">Why this match:</p>
                        <div className="flex flex-wrap gap-1">
                          {match.matchReasons.slice(0, 2).map((reason, index) => (
                            <span key={index} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <Button size="sm" className="w-full">
                        Contact Expert
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIMatchingEngine;
