import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, ThumbsUp, UserPlus } from "lucide-react";
import InviteModal from "@/components/researcher/InviteModal";
import PlatformMetricsCards from "@/components/dashboard/quality/PlatformMetricsCards";

const ResearchAidQualityTab = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Quality Feedback</h2>
          <InviteModal userType="research-aid" triggerText="Invite a Research Aid" />
        </div>
        <p className="text-gray-600 mb-6">Help us improve ResearchWow by sharing your feedback.</p>

        {/* Platform Metrics */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Platform Performance</h3>
          <PlatformMetricsCards />
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Rate this platform</CardTitle>
            <CardDescription>
              How would you rate your overall experience with ResearchWow?
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

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
                "Great platform for providing research assistance. The project matching system works well."
              </p>
              <Badge className="mt-2 bg-green-100 text-green-800">Submitted</Badge>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Projects</span>
                  <span className="text-sm font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg Rating Given</span>
                  <span className="text-sm font-medium">4.7/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Feedback Submitted</span>
                  <span className="text-sm font-medium">2</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResearchAidQualityTab;
