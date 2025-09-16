
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, BookOpen, MessageSquare, Download, RefreshCw, AlertTriangle } from "lucide-react";
import { useReportsAnalytics } from "@/hooks/useReportsAnalytics";
import LoadingSpinner from "@/components/LoadingSpinner";

const ReportsAnalytics = () => {
  const {
    engagementMetrics,
    topResearchers,
    topResearchAids,
    popularTopics,
    userJourneyDropOffs,
    loading,
    error,
    refreshData
  } = useReportsAnalytics();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <p className="text-red-600 text-center">{error}</p>
        <Button onClick={refreshData} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Full Report
          </Button>
        </div>
      </div>      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {engagementMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className={`text-xs ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change} from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Top Performing Researchers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topResearchers.length > 0 ? (
                topResearchers.map((researcher, index) => (
                  <div key={researcher.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{researcher.name}</p>
                      <p className="text-sm text-gray-600">{researcher.sessions} sessions • {researcher.rating}/5 ⭐</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{researcher.earnings}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No researcher data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Top Performing Research Aids
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topResearchAids.length > 0 ? (
                topResearchAids.map((aid, index) => (
                  <div key={aid.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{aid.name}</p>
                      <p className="text-sm text-gray-600">{aid.tasks} tasks • {aid.rating}/5 ⭐</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{aid.earnings}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No research aid data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>      {/* Popular Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Most Popular Consultation Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {popularTopics.length > 0 ? (
              popularTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{index + 1}.</span>
                    <div>
                      <p className="font-medium">{topic.topic}</p>
                      <p className="text-sm text-gray-600">{topic.bookings} bookings</p>
                    </div>
                  </div>
                  <Badge variant="outline">{topic.percentage}</Badge>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No topic data available</p>
            )}
          </div>
        </CardContent>
      </Card>      {/* User Journey Drop-off Points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            User Journey Drop-off Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userJourneyDropOffs.length > 0 ? (
              userJourneyDropOffs.map((point, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{point.stage}</p>
                    <p className="text-sm text-gray-600">{point.users} users dropped off</p>
                  </div>
                  <Badge 
                    variant={parseInt(point.dropoff) > 20 ? "destructive" : parseInt(point.dropoff) > 10 ? "secondary" : "default"}
                  >
                    {point.dropoff} drop-off
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No drop-off data available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Custom Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              User Engagement Report
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Provider Performance Report
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <BookOpen className="h-6 w-6 mb-2" />
              Content Analytics Report
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <MessageSquare className="h-6 w-6 mb-2" />
              User Feedback Report
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Download className="h-6 w-6 mb-2" />
              Financial Summary Report
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              Growth Metrics Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsAnalytics;
