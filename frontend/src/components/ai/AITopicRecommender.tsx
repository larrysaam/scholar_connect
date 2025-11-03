
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Lightbulb, Brain, Zap, BookOpen, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAITopicSuggestions } from "@/services/geminiService";

interface TopicRecommendation {
  id: string;
  title: string;
  description: string;
  relevanceScore: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedDuration: string;
  keywords: string[];
  trendingScore: number;
  methodology: string[];
}

const AITopicRecommender = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [userField, setUserField] = useState("");
  const [recommendations, setRecommendations] = useState<TopicRecommendation[]>([]);
  const { toast } = useToast();

  const handleGenerateRecommendations = async () => {
    if (!userField.trim()) {
      toast({
        title: "Field Required",
        description: "Please enter your field of study to get personalized recommendations.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    // Mock student profile (replace with actual data)
    const studentProfile = {
      field: userField,
      interests: ["Sustainable Technology", "Renewable Energy"]
    };

    try {
      const suggestions = await getAITopicSuggestions(studentProfile);
      // Add a unique ID to each recommendation for key prop
      const suggestionsWithIds = suggestions.map((suggestion, index) => ({ ...suggestion, id: `topic-${index}` }));
      setRecommendations(suggestionsWithIds);
      toast({
        title: "AI Recommendations Generated!",
        description: `Found ${suggestions.length} trending research topics in your field.`
      });
    } catch (error) {
      toast({
        title: "AI Recommendation Failed",
        description: "Could not fetch recommendations. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveRecommendation = (topic: TopicRecommendation) => {
    toast({
      title: "Topic Saved!",
      description: `"${topic.title}" has been saved to your research interests.`
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lightbulb className="h-6 w-6 text-orange-600" />
          <span>AI Research Topic Recommender</span>
        </CardTitle>
        <p className="text-gray-600">
          Get personalized research topic suggestions based on current trends, your interests, and academic level.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex space-x-3">
          <Input
            placeholder="Enter your field of study (e.g., Computer Science, Biology, Psychology)"
            value={userField}
            onChange={(e) => setUserField(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleGenerateRecommendations} 
            disabled={isGenerating}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isGenerating ? (
              <>
                <Zap className="mr-2 h-4 w-4 animate-pulse" />
                Generating...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Get Recommendations
              </>
            )}
          </Button>
        </div>

        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Enter your field to discover trending research topics</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-700 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Trending Research Topics ({recommendations.length})
            </h3>
            
            {recommendations.map((topic) => (
              <Card key={topic.id} className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-lg text-gray-900 flex-1">{topic.title}</h4>
                      <div className="flex space-x-2 ml-4">
                        <Badge className="bg-orange-100 text-orange-800">
                          {topic.relevanceScore}% Match
                        </Badge>
                        <Badge className={getDifficultyColor(topic.difficulty)}>
                          {topic.difficulty}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-gray-700">{topic.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Duration: {topic.estimatedDuration}</span>
                      <span className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Trending: {topic.trendingScore}%
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Keywords: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(topic.keywords || []).map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-700">Suggested Methodology: </span> 
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(topic.methodology || []).map((method, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {method}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button variant="outline" size="sm">
                        Find Experts
                      </Button>
                      <Button 
                        onClick={() => handleSaveRecommendation(topic)}
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        Save Topic
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={handleGenerateRecommendations}>
                Generate More Topics
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AITopicRecommender;
