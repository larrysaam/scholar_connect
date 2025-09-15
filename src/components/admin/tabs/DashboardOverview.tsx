
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, DollarSign, AlertTriangle, TrendingUp, UserCheck, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import LoadingSpinner from "@/components/LoadingSpinner";

const DashboardOverview = () => {
  const { 
    platformMetrics, 
    systemAlerts, 
    recentActivity, 
    loading, 
    error, 
    refreshData 
  } = useAdminDashboard();

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
        <p className="text-red-600">Error loading dashboard data: {error}</p>
        <Button onClick={refreshData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header with Refresh Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Platform Overview</h2>
          <p className="text-gray-600">Real-time metrics and platform activity</p>
        </div>
        <Button onClick={refreshData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Platform Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformMetrics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {platformMetrics.totalStudents} students, {platformMetrics.totalResearchers} researchers, {platformMetrics.totalResearchAids} aids
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Consultations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformMetrics.activeConsultationsToday}</div>
            <p className="text-xs text-muted-foreground">
              Today • {platformMetrics.activeConsultationsWeek} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformMetrics.revenueMonthly.toLocaleString()} XAF</div>
            <p className="text-xs text-muted-foreground">
              Weekly: {platformMetrics.revenueWeekly.toLocaleString()} XAF
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Sign-ups</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformMetrics.newSignupsWeek}</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>
      </div>      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
            System Alerts
            {systemAlerts.length > 0 && (
              <Badge className="ml-2" variant="destructive">
                {systemAlerts.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {systemAlerts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-green-600 mb-2">
                <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600">No active system alerts</p>
            </div>
          ) : (
            <div className="space-y-3">
              {systemAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant={alert.severity === "high" ? "destructive" : alert.severity === "medium" ? "default" : "secondary"}
                    >
                      {alert.severity}
                    </Badge>
                    <div>
                      <span className="text-sm">{alert.message}</span>
                      {alert.count && (
                        <div className="text-xs text-gray-500 mt-1">
                          Affecting {alert.count} record{alert.count > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {alert.actionUrl && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.location.href = alert.actionUrl!}
                      >
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Platform Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Avg. Daily Consultations</span>
                <span className="font-semibold">{platformMetrics.averageDailyConsultations}</span>
              </div>
              <div className="flex justify-between">
                <span>User Satisfaction Rate</span>
                <span className="font-semibold">{platformMetrics.userSatisfactionRate}%</span>
              </div>
              <div className="flex justify-between">
                <span>Task Completion Rate</span>
                <span className="font-semibold">{platformMetrics.taskCompletionRate}%</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Success Rate</span>
                <span className="font-semibold">{platformMetrics.paymentSuccessRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
