
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Users, Star } from "lucide-react";

interface MatchingResult {
  id: string;
  name: string;
  field: string;
  matchScore: number;
  specialties: string[];
  reason: string;
  rating: number;
  hourlyRate: number;
}

const AIMatchingEngine = () => {
  const [matches, setMatches] = useState<MatchingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateMatches = () => {
    setIsLoading(true);
    
    // Simulate AI matching algorithm
    setTimeout(() => {
      const mockMatches: MatchingResult[] = [
        {
          id: "1",
          name: "Dr. Sarah Johnson",
          field: "Computer Science",
          matchScore: 95,
          specialties: ["Machine Learning", "AI Ethics"],
          reason: "Perfect match for your AI research interests and academic level",
          rating: 4.9,
          hourlyRate: 120
        },
        {
          id: "2",
          name: "Dr. Michael Chen",
          field: "Physics",
          matchScore: 87,
          specialties: ["Quantum Computing", "Theoretical Physics"],
          reason: "Strong alignment with your computational physics background",
          rating: 4.8,
          hourlyRate: 150
        },
        {
          id: "3",
          name: "Dr. Emily Rodriguez",
          field: "Biology",
          matchScore: 78,
          specialties: ["Bioinformatics", "Computational Biology"],
          reason: "Good interdisciplinary match for your data science skills",
          rating: 4.7,
          hourlyRate: 135
        }
      ];
      
      setMatches(mockMatches);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <span>AI-Powered Researcher Matching</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={generateMatches} disabled={isLoading} className="w-full">
            {isLoading ? "Finding Perfect Matches..." : "Find My Perfect Researchers"}
          </Button>
          
          {matches.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Top AI Recommendations</h3>
              {matches.map((match) => (
                <div key={match.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{match.name}</h4>
                      <p className="text-sm text-gray-600">{match.field}</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {match.matchScore}% Match
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {match.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-700">{match.reason}</p>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{match.rating}</span>
                    </div>
                    <span className="font-medium">{match.hourlyRate} XAF/hour</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIMatchingEngine;
