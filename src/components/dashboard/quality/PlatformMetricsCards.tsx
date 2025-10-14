import { Card, CardContent } from "@/components/ui/card";
import { Star, Users, TrendingUp, Award } from "lucide-react";
import { usePlatformMetrics } from "@/hooks/usePlatformMetrics";
import LoadingSpinner from "@/components/LoadingSpinner";

const PlatformMetricsCards = () => {
  const { metrics, loading, error } = usePlatformMetrics();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading platform metrics: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Star className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">Platform Rating</p>
              <p className="text-2xl font-bold">{metrics.overall_rating}/5</p>
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
              <p className="text-2xl font-bold">{metrics.total_feedbacks}</p>
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
              <p className="text-2xl font-bold">{metrics.improvement_rate}%</p>
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
              <p className="text-2xl font-bold">{metrics.user_satisfaction}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformMetricsCards;
