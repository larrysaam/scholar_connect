
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap } from "lucide-react";

const AIMatchingEngine = () => {
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [selectedField, setSelectedField] = useState('');
  const [publicationType, setPublicationType] = useState('');
  const [isMatching, setIsMatching] = useState(false);

  const challenges = [
    "Literature review",
    "Data analysis", 
    "Statistical methodology",
    "Research design",
    "Academic writing",
    "Thesis structure",
    "Citation management",
    "Publication strategy"
  ];

  const publicationTypes = [
    "Journal Article",
    "Conference Paper", 
    "Book Chapter",
    "Thesis/Dissertation",
    "Review Article",
    "Case Study",
    "Technical Report"
  ];

  const fields = [
    "Computer Science",
    "Biology", 
    "Physics",
    "Chemistry",
    "Mathematics",
    "Psychology",
    "Economics",
    "Medicine",
    "Engineering",
    "Literature"
  ];

  const toggleChallenge = (challenge: string) => {
    setSelectedChallenges(prev => 
      prev.includes(challenge) 
        ? prev.filter(c => c !== challenge)
        : [...prev, challenge]
    );
  };

  const handleAIMatch = () => {
    setIsMatching(true);
    // Simulate AI matching process
    setTimeout(() => {
      setIsMatching(false);
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <span>AI Smart Matching</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>What's your challenge? (Select all that apply)</Label>
          <div className="grid grid-cols-1 gap-2">
            {challenges.map((challenge) => (
              <div key={challenge} className="flex items-center space-x-2">
                <Checkbox
                  id={challenge}
                  checked={selectedChallenges.includes(challenge)}
                  onCheckedChange={() => toggleChallenge(challenge)}
                />
                <Label htmlFor={challenge} className="text-sm">
                  {challenge}
                </Label>
              </div>
            ))}
          </div>
          
          {selectedChallenges.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {selectedChallenges.map((challenge) => (
                <Badge key={challenge} variant="secondary" className="text-xs">
                  {challenge}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Field of Study</Label>
          <Select value={selectedField} onValueChange={setSelectedField}>
            <SelectTrigger>
              <SelectValue placeholder="Select your field" />
            </SelectTrigger>
            <SelectContent>
              {fields.map((field) => (
                <SelectItem key={field} value={field}>
                  {field}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Publication Type</Label>
          <Select value={publicationType} onValueChange={setPublicationType}>
            <SelectTrigger>
              <SelectValue placeholder="Select publication type" />
            </SelectTrigger>
            <SelectContent>
              {publicationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleAIMatch}
          disabled={selectedChallenges.length === 0 || !selectedField || isMatching}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isMatching ? (
            <>
              <Zap className="h-4 w-4 mr-2 animate-pulse" />
              Finding Perfect Matches...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Find AI-Matched Researchers
            </>
          )}
        </Button>

        {isMatching && (
          <div className="text-center">
            <div className="animate-pulse text-sm text-gray-600">
              Analyzing your requirements and matching with the best researchers...
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIMatchingEngine;
