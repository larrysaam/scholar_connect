
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Clock, Users, Globe, Award, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useResearcherProfile } from "@/hooks/useResearcherProfile";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component for loading states

interface PerformanceMetrics {
  averageRating: number;
  totalReviews: number;
  responseTime: number; // in hours
  noShowRate: number; // percentage
  completionRate: number; // percentage
  regionalReach: Array<{
    country: string;
    sessions: number;
  }>;
  rankingStatus: "top-expert" | "expert" | "rising" | "new" | string; // Added string for flexibility
}

const PerformanceReputationTab = () => {
  const { user, loading: authLoading } = useAuth();
  const { researcher, loading: researcherLoading, error: researcherError } = useResearcherProfile(user?.id || '');

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    averageRating: 0,
    totalReviews: 0,
    responseTime: 0,
    noShowRate: 0, // Placeholder, needs real data
    completionRate: 0, // Placeholder, needs real data
    regionalReach: [], // Placeholder, needs real data
    rankingStatus: "new"
  });

  useEffect(() => {
    if (researcher) {
      const parseResponseTime = (responseTimeStr: string): number => {
        const match = responseTimeStr.match(/(\d+)\s*hours/);
        if (match && match[1]) {
          return parseInt(match[1], 10);
        }
        return 24; // Default if parsing fails
      };

      setMetrics({
        averageRating: researcher.rating || 0,
        totalReviews: researcher.total_reviews || 0,
        responseTime: parseResponseTime(researcher.response_time || ""),
        noShowRate: 0, // TODO: Integrate real no-show rate data
        completionRate: 0, // TODO: Integrate real completion rate data
        regionalReach: [], // TODO: Integrate real regional reach data
        rankingStatus: researcher.rankingStatus || "new" // Assuming researcher profile might have a ranking status
      });
    }
  }, [researcher]);

  if (authLoading || researcherLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-6 w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (researcherError) {
    return <div className="text-red-500">Error loading performance data: {researcherError.message}</div>;
  }

  if (!researcher) {
    return <div className="text-gray-500">No researcher profile found.</div>;
  }


  const getRankingBadge = (status: string) => {
    switch (status) {
      case "top-expert":
        return <Badge className="bg-gold text-white">🏆 Top Expert</Badge>;
      case "expert":
        return <Badge className="bg-blue-600">⭐ Expert</Badge>;
      case "rising":
        return <Badge className="bg-green-600">📈 Rising Star</Badge>;
      case "new":
        return <Badge variant="secondary">🌱 New Researcher</Badge>;
      default:
        return <Badge variant="outline">Researcher</Badge>;
    }
  };

  const getPerformanceColor = (value: number, isGood: boolean) => {
    if (isGood) {
      return value >= 90 ? "text-green-600" : value >= 70 ? "text-yellow-600" : "text-red-600";
    } else {
      return value <= 5 ? "text-green-600" : value <= 15 ? "text-yellow-600" : "text-red-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance & Reputation</h2>
          <p className="text-gray-600">Track your metrics and platform standing</p>
        </div>
        {getRankingBadge(metrics.rankingStatus)}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <div className="flex items-center space-x-1">
                  <p className="text-2xl font-bold">{metrics.averageRating.toFixed(1)}</p>
                  <span className="text-sm text-gray-500">({metrics.totalReviews} reviews)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Response Time</p>
                <p className="text-2xl font-bold">{metrics.responseTime}h</p>
                <p className="text-xs text-green-600">Excellent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(metrics.completionRate, true)}`}>
                  {metrics.completionRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">No-Show Rate</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(metrics.noShowRate, false)}`}>
                  {metrics.noShowRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Reach */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Regional Reach</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.regionalReach.length > 0 ? (
              metrics.regionalReach.map((region, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{region.country}</span>
                    <Badge variant="outline">{region.sessions} sessions</Badge>
                  </div>
                  <div className="w-32">
                    <Progress 
                      value={(region.sessions / Math.max(...metrics.regionalReach.map(r => r.sessions))) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No regional reach data available.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-green-600">Strengths</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  <span>Excellent response time ({metrics.responseTime} hours)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  <span>High completion rate ({metrics.completionRate}%)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  <span>Strong international reach</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-blue-600">Growth Opportunities</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span>Expand to East African markets</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span>Offer specialized AI/ML workshops</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span>Increase session frequency</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ranking Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Ranking Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress to Maintain Top Expert Status</span>
              <span className="text-sm text-gray-500">92%</span>
            </div>
            <Progress value={92} className="h-3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="font-medium text-green-600">Requirements Met</p>
                <p className="text-green-800">Rating ≥ 4.7 ✓</p>
                <p className="text-green-800">Response ≤ 6h ✓</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="font-medium text-yellow-600">Monitor Closely</p>
                <p className="text-yellow-800">Completion ≥ 95% ✓</p>
                <p className="text-yellow-800">No-show ≤ 5% ✓</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-600">Bonus Criteria</p>
                <p className="text-blue-800">Sessions/Month: 12+</p>
                <p className="text-blue-800">Student Retention: High</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceReputationTab;
