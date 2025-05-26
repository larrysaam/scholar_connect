
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare, Calendar, User } from "lucide-react";

const QualityAssuranceAndFeedbackTab = () => {
  const feedbacks = [
    {
      id: "1",
      studentName: "Sarah Johnson",
      consultationDate: "2024-01-15",
      rating: 5,
      feedback: "Excellent consultation! Dr. Smith provided valuable insights into my AI research methodology. The session was well-structured and highly informative.",
      category: "Research Methodology"
    },
    {
      id: "2", 
      studentName: "Michael Chen",
      consultationDate: "2024-01-12",
      rating: 4,
      feedback: "Very helpful discussion about machine learning algorithms. Would have liked more time for Q&A session.",
      category: "Machine Learning"
    },
    {
      id: "3",
      studentName: "Emily Davis",
      consultationDate: "2024-01-10", 
      rating: 5,
      feedback: "Outstanding expertise in data science. The practical examples really helped clarify complex concepts.",
      category: "Data Science"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Quality Assurance & Feedback</h2>
      
      {/* Recent Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Recent Student Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div key={feedback.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{feedback.studentName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{feedback.consultationDate}</span>
                    </div>
                  </div>
                  <Badge variant="outline">{feedback.category}</Badge>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">{renderStars(feedback.rating)}</div>
                  <span className="text-sm text-gray-600">({feedback.rating}/5)</span>
                </div>
                
                <p className="text-sm text-gray-700">{feedback.feedback}</p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-6">
            <Button variant="outline">View All Feedback</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityAssuranceAndFeedbackTab;
