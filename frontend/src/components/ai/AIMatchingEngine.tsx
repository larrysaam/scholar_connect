
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Brain, Search, Users, FileText, Clock, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AIMatchingEngine = () => {
  const [challenges, setChallenges] = useState<string[]>([]);
  const [timeline, setTimeline] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [publicationType, setPublicationType] = useState("");
  const [budget, setBudget] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const challengeOptions = [
    "Finding relevant research papers",
    "Data collection and analysis",
    "Statistical analysis",
    "Writing and structuring the paper",
    "Citation and referencing",
    "Methodology design",
    "Literature review",
    "Peer review preparation",
    "Journal selection",
    "Grant writing"
  ];

  const publicationTypes = [
    "Journal Article",
    "Conference Paper",
    "Thesis/Dissertation",
    "Book Chapter",
    "Technical Report",
    "Case Study",
    "Review Article",
    "Short Communication"
  ];

  const fieldsOfStudy = [
    "Computer Science",
    "Biology",
    "Chemistry",
    "Physics",
    "Mathematics",
    "Psychology",
    "Economics",
    "Medicine",
    "Engineering",
    "Literature",
    "History",
    "Sociology"
  ];

  const handleChallengeChange = (challenge: string, checked: boolean) => {
    if (checked) {
      setChallenges([...challenges, challenge]);
    } else {
      setChallenges(challenges.filter(c => c !== challenge));
    }
  };

  const handleMatch = () => {
    setIsLoading(true);
    // Simulate AI matching process
    setTimeout(() => {
      setIsLoading(false);
      console.log("AI Matching Results:", {
        challenges,
        timeline,
        fieldOfStudy,
        publicationType,
        budget
      });
    }, 2000);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-xl">
          <Brain className="h-6 w-6 text-blue-600" />
          <span>AI-Powered Research Matching</span>
        </CardTitle>
        <p className="text-gray-600">
          Tell us about your research needs and we'll match you with the perfect researcher or research aid.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Field of Study */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Field of Study</span>
          </Label>
          <Select value={fieldOfStudy} onValueChange={setFieldOfStudy}>
            <SelectTrigger>
              <SelectValue placeholder="Select your field of study" />
            </SelectTrigger>
            <SelectContent>
              {fieldsOfStudy.map((field) => (
                <SelectItem key={field} value={field}>
                  {field}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Publication Type */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Publication Type</span>
          </Label>
          <Select value={publicationType} onValueChange={setPublicationType}>
            <SelectTrigger>
              <SelectValue placeholder="What type of publication are you working on?" />
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

        {/* Challenges */}
        <div className="space-y-3">
          <Label className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>What's your challenge? (Select all that apply)</span>
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {challengeOptions.map((challenge) => (
              <div key={challenge} className="flex items-center space-x-2">
                <Checkbox
                  id={challenge}
                  checked={challenges.includes(challenge)}
                  onCheckedChange={(checked) => handleChallengeChange(challenge, !!checked)}
                />
                <Label htmlFor={challenge} className="cursor-pointer text-sm">
                  {challenge}
                </Label>
              </div>
            ))}
          </div>
          {challenges.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {challenges.map((challenge) => (
                <Badge key={challenge} variant="secondary" className="text-xs">
                  {challenge}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Timeline</span>
          </Label>
          <Select value={timeline} onValueChange={setTimeline}>
            <SelectTrigger>
              <SelectValue placeholder="When do you need this completed?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="urgent">Within 1 week</SelectItem>
              <SelectItem value="soon">Within 1 month</SelectItem>
              <SelectItem value="flexible">Within 3 months</SelectItem>
              <SelectItem value="longterm">More than 3 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <Label>Budget Range (XAF)</Label>
          <Input
            type="text"
            placeholder="e.g., 50,000 - 200,000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>

        {/* Match Button */}
        <Button 
          onClick={handleMatch} 
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isLoading || challenges.length === 0 || !fieldOfStudy || !timeline}
        >
          {isLoading ? (
            <>
              <Brain className="h-4 w-4 mr-2 animate-spin" />
              Finding Perfect Matches...
            </>
          ) : (
            <>
              <Users className="h-4 w-4 mr-2" />
              Find My Research Match
            </>
          )}
        </Button>

        {isLoading && (
          <div className="text-center text-sm text-gray-600">
            Our AI is analyzing your requirements and matching you with the best researchers and research aids...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIMatchingEngine;
