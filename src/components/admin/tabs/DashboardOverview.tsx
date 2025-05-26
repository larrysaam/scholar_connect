
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, DollarSign, AlertTriangle, TrendingUp, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const DashboardOverview = () => {
  const platformMetrics = {
    totalUsers: 1247,
    totalStudents: 1058,
    totalResearchers: 142,
    totalResearchAids: 47,
    activeConsultationsToday: 23,
    activeConsultationsWeek: 156,
    revenueDaily: 2450000,
    revenueWeekly: 15680000,
    revenueMonthly: 67320000,
    newSignupsWeek: 38
  };

  const systemAlerts = [
    { type: "payment", message: "3 failed payments requiring attention", severity: "high" },
    { type: "verification", message: "12 researcher profiles pending verification", severity: "medium" },
    { type: "content", message: "2 consultation reports flagged for review", severity: "low" }
  ];

  const recentActivity = [
    { user: "Dr. Marie Ngono", action: "Completed consultation with John Doe", time: "2 hours ago" },
    { user: "Sarah Johnson", action: "New researcher registration", time: "4 hours ago" },
    { user: "Research Aid: Emma Wilson", action: "Submitted thesis editing task", time: "6 hours ago" }
  ];

  return (
    <div className="space-y-6">
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
      </div>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant={alert.severity === "high" ? "destructive" : alert.severity === "medium" ? "default" : "secondary"}
                  >
                    {alert.severity}
                  </Badge>
                  <span>{alert.message}</span>
                </div>
                <Button size="sm" variant="outline">Resolve</Button>
              </div>
            ))}
          </div>
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
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Avg. Daily Consultations</span>
                <span className="font-semibold">22.3</span>
              </div>
              <div className="flex justify-between">
                <span>User Satisfaction Rate</span>
                <span className="font-semibold">4.8/5</span>
              </div>
              <div className="flex justify-between">
                <span>Task Completion Rate</span>
                <span className="font-semibold">94%</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Success Rate</span>
                <span className="font-semibold">97.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
