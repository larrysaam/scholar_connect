
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Star, MessageSquare, Send, TrendingUp, Users, Award, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const QualityAssuranceAndFeedbackTab = () => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState("");
  const [suggestionText, setSuggestionText] = useState("");
  const [platformExperience, setPlatformExperience] = useState("");
  const { toast } = useToast();

  const platformMetrics = {
    overallRating: 4.6,
    totalFeedbacks: 156,
    improvementRate: 85,
    userSatisfaction: 92
  };

  const feedbackCategories = [
    "User Interface",
    "Job Matching System",
    "Payment Process",
    "Communication Tools",
    "Profile Management",
    "Notification System",
    "Mobile Experience",
    "Customer Support",
    "General Experience"
  ];

  const recentImprovements = [
    {
      title: "Enhanced Job Matching",
      description: "Improved AI-powered job matching based on user feedback",
      implementedDate: "2024-01-20",
      userRequests: 23
    },
    {
      title: "Faster Payment Processing",
      description: "Reduced payment processing time from 48 to 24 hours",
      implementedDate: "2024-01-15",
      userRequests: 45
    },
    {
      title: "Mobile App Optimization",
      description: "Enhanced mobile interface for better user experience",
      implementedDate: "2024-01-10",
      userRequests: 67
    }
  ];

  const handleSubmitPlatformFeedback = () => {
    if (!selectedRating || !feedbackText.trim() || !feedbackCategory) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Feedback Submitted",
      description: "Thank you for helping us improve ScholarConnect!"
    });

    setSelectedRating(0);
    setFeedbackText("");
    setFeedbackCategory("");
  };

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Platform Quality & Feedback</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <MessageSquare className="h-4 w-4 mr-2" />
              Rate Platform
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Rate ScholarConnect Platform</DialogTitle>
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
                  placeholder="Tell us about your experience with ScholarConnect..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={handleSubmitPlatformFeedback} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Submit Feedback
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Platform Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Platform Rating</p>
                <p className="text-2xl font-bold">{platformMetrics.overallRating}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">User Feedback</p>
                <p className="text-2xl font-bold">{platformMetrics.totalFeedbacks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Improvement Rate</p>
                <p className="text-2xl font-bold">{platformMetrics.improvementRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Satisfaction</p>
                <p className="text-2xl font-bold">{platformMetrics.userSatisfaction}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Platform Improvements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Recent Platform Improvements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentImprovements.map((improvement, index) => (
              <div key={index} className="flex justify-between items-start p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{improvement.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{improvement.description}</p>
                  <p className="text-xs text-gray-500">Implemented: {improvement.implementedDate}</p>
                </div>
                <Badge variant="secondary">
                  {improvement.userRequests} requests
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suggestion Box */}
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

      {/* Feedback Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Help Us Improve</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2 text-blue-800">What's Working Well?</h4>
              <ul className="text-sm space-y-1 text-blue-700">
                <li>• Easy job application process</li>
                <li>• Quick payment processing</li>
                <li>• Good communication tools</li>
                <li>• Helpful client matching</li>
              </ul>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium mb-2 text-orange-800">Areas for Enhancement</h4>
              <ul className="text-sm space-y-1 text-orange-700">
                <li>• Mobile app performance</li>
                <li>• Advanced search filters</li>
                <li>• Real-time notifications</li>
                <li>• Enhanced profile customization</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium mb-2 text-green-800">Your Voice Matters</h4>
            <p className="text-sm text-green-700">
              Every piece of feedback helps us create a better platform for research aids and clients. 
              We review all submissions and prioritize improvements based on user needs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityAssuranceAndFeedbackTab;
