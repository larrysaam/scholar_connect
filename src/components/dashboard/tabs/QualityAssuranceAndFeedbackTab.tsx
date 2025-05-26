
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, CheckCircle, AlertTriangle, Star, MessageSquare, ThumbsUp } from "lucide-react";

interface QualityMetrics {
  responseTime: number;
  accuracy: number;
  satisfaction: number;
  completeness: number;
}

const QualityAssuranceAndFeedbackTab = () => {
  const [metrics] = useState<QualityMetrics>({
    responseTime: 95,
    accuracy: 92,
    satisfaction: 88,
    completeness: 96
  });

  const qualityChecks = [
    {
      title: "Verified Credentials",
      status: "passed",
      description: "All researcher credentials have been verified"
    },
    {
      title: "Response Quality",
      status: "passed",
      description: "Consultation quality meets platform standards"
    },
    {
      title: "Timely Delivery",
      status: "warning",
      description: "Some delays in response time detected"
    },
    {
      title: "Student Satisfaction",
      status: "passed",
      description: "High satisfaction scores from recent consultations"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quality Assurance Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Quality Assurance Dashboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quality Metrics */}
            <div className="space-y-4">
              <h3 className="font-semibold">Performance Metrics</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Response Time</span>
                    <span>{metrics.responseTime}%</span>
                  </div>
                  <Progress value={metrics.responseTime} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Accuracy</span>
                    <span>{metrics.accuracy}%</span>
                  </div>
                  <Progress value={metrics.accuracy} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Satisfaction</span>
                    <span>{metrics.satisfaction}%</span>
                  </div>
                  <Progress value={metrics.satisfaction} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Completeness</span>
                    <span>{metrics.completeness}%</span>
                  </div>
                  <Progress value={metrics.completeness} className="h-2" />
                </div>
              </div>
            </div>

            {/* Quality Checks */}
            <div className="space-y-4">
              <h3 className="font-semibold">Quality Checks</h3>
              
              <div className="space-y-3">
                {qualityChecks.map((check, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    {getStatusIcon(check.status)}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{check.title}</h4>
                      <p className="text-xs text-gray-600">{check.description}</p>
                    </div>
                    <Badge 
                      variant={check.status === 'passed' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {check.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality Feedback Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Platform Feedback</CardTitle>
          <CardDescription>
            Help us improve ScholarConnect by sharing your feedback.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Rate this platform</h3>
              <div className="flex items-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-6 w-6 cursor-pointer hover:text-yellow-500"
                    fill="currentColor"
                  />
                ))}
              </div>
              <textarea
                className="w-full p-3 border rounded-md"
                rows={4}
                placeholder="Share your thoughts about the platform..."
              />
              <Button className="mt-3">Submit Feedback</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Recent Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    "Great platform for connecting with researchers. The booking system is very intuitive."
                  </p>
                  <Badge className="mt-2 bg-green-100 text-green-800">Submitted</Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Platform Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Sessions</span>
                      <span className="text-sm font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Rating Given</span>
                      <span className="text-sm font-medium">4.8/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Feedback Submitted</span>
                      <span className="text-sm font-medium">3</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityAssuranceAndFeedbackTab;
