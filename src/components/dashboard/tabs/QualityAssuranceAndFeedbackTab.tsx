
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, MessageSquare, ThumbsUp, AlertTriangle, Send, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const QualityAssuranceAndFeedbackTab = () => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState("");
  const [viewAllFeedback, setViewAllFeedback] = useState(false);
  const { toast } = useToast();

  const [feedbackList, setFeedbackList] = useState([
    {
      id: 1,
      client: "Dr. Sarah Johnson",
      project: "Statistical Analysis Project",
      rating: 5,
      feedback: "Excellent work! Very thorough analysis and professional presentation.",
      date: "2024-01-28",
      category: "Quality",
      status: "positive"
    },
    {
      id: 2,
      client: "Prof. Michael Chen",
      project: "Literature Review",
      rating: 4,
      feedback: "Good quality work, delivered on time. Could improve on formatting.",
      date: "2024-01-25",
      category: "Timeliness",
      status: "positive"
    },
    {
      id: 3,
      client: "Dr. Marie Dubois",
      project: "Data Collection",
      rating: 5,
      feedback: "Outstanding data collection work. Very organized and efficient.",
      date: "2024-01-20",
      category: "Organization",
      status: "positive"
    }
  ]);

  const qualityMetrics = {
    averageRating: 4.7,
    totalFeedbacks: feedbackList.length,
    positivePercentage: 95,
    responseRate: 100
  };

  const handleSubmitFeedback = () => {
    if (!selectedRating || !feedbackText.trim() || !feedbackCategory) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newFeedback = {
      id: feedbackList.length + 1,
      client: "System Generated",
      project: "Self Assessment",
      rating: selectedRating,
      feedback: feedbackText,
      date: new Date().toISOString().split('T')[0],
      category: feedbackCategory,
      status: selectedRating >= 4 ? "positive" : selectedRating >= 3 ? "neutral" : "negative"
    };

    setFeedbackList(prev => [newFeedback, ...prev]);
    setSelectedRating(0);
    setFeedbackText("");
    setFeedbackCategory("");

    toast({
      title: "Feedback Submitted",
      description: "Your feedback has been submitted successfully"
    });
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "positive":
        return <Badge className="bg-green-600">Positive</Badge>;
      case "neutral":
        return <Badge variant="secondary">Neutral</Badge>;
      case "negative":
        return <Badge variant="destructive">Needs Improvement</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const displayedFeedback = viewAllFeedback ? feedbackList : feedbackList.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quality Assurance & Feedback</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <MessageSquare className="h-4 w-4 mr-2" />
              Submit Feedback
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Quality Feedback</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Overall Rating</Label>
                <div className="flex items-center space-x-1 mt-2">
                  {renderStars(selectedRating, true, "h-6 w-6")}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedRating === 0 && "Select a rating"}
                  {selectedRating === 1 && "Poor"}
                  {selectedRating === 2 && "Fair"}
                  {selectedRating === 3 && "Good"}
                  {selectedRating === 4 && "Very Good"}
                  {selectedRating === 5 && "Excellent"}
                </p>
              </div>
              <div>
                <Label htmlFor="feedback-category">Category</Label>
                <select
                  id="feedback-category"
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                >
                  <option value="">Select category</option>
                  <option value="Quality">Work Quality</option>
                  <option value="Timeliness">Timeliness</option>
                  <option value="Communication">Communication</option>
                  <option value="Organization">Organization</option>
                  <option value="Technical Skills">Technical Skills</option>
                </select>
              </div>
              <div>
                <Label htmlFor="feedback-text">Feedback Details</Label>
                <Textarea
                  id="feedback-text"
                  placeholder="Provide detailed feedback..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={handleSubmitFeedback} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Submit Feedback
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quality Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold">{qualityMetrics.averageRating}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Feedback</p>
                <p className="text-2xl font-bold">{qualityMetrics.totalFeedbacks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <ThumbsUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Positive Rate</p>
                <p className="text-2xl font-bold">{qualityMetrics.positivePercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold">{qualityMetrics.responseRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Recent Feedback</CardTitle>
            <Button 
              variant="outline" 
              onClick={() => setViewAllFeedback(!viewAllFeedback)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {viewAllFeedback ? "View Less" : "View All Feedback"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayedFeedback.map((feedback) => (
              <Card key={feedback.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder-avatar.jpg" alt={feedback.client} />
                        <AvatarFallback>{feedback.client.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{feedback.client}</h4>
                        <p className="text-sm text-gray-600">{feedback.project}</p>
                        <p className="text-xs text-gray-500">{feedback.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        {renderStars(feedback.rating)}
                        <span className="text-sm text-gray-600 ml-2">({feedback.rating}/5)</span>
                      </div>
                      {getStatusBadge(feedback.status)}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <Badge variant="outline" className="mb-2">{feedback.category}</Badge>
                    <p className="text-gray-700">{feedback.feedback}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quality Improvement Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quality Improvement Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Strengths</h4>
              <ul className="text-sm space-y-1">
                <li>• Consistent high-quality deliverables</li>
                <li>• Excellent communication skills</li>
                <li>• Timely project completion</li>
                <li>• Professional presentation</li>
              </ul>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium mb-2">Areas for Improvement</h4>
              <ul className="text-sm space-y-1">
                <li>• Document formatting consistency</li>
                <li>• Initial response time to queries</li>
                <li>• Proactive progress updates</li>
                <li>• Technical documentation clarity</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityAssuranceAndFeedbackTab;
