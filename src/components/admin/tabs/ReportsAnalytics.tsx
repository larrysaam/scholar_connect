
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, BookOpen, MessageSquare, Download } from "lucide-react";

const ReportsAnalytics = () => {
  const engagementData = [
    { metric: "Daily Active Users", value: "423", change: "+12%" },
    { metric: "Session Duration", value: "24 min", change: "+8%" },
    { metric: "Consultation Completion Rate", value: "94%", change: "+2%" },
    { metric: "User Retention (30-day)", value: "76%", change: "-3%" }
  ];

  const topPerformers = {
    researchers: [
      { name: "Dr. Marie Ngono", sessions: 47, rating: 4.9, earnings: "450,000 XAF" },
      { name: "Prof. James Akinyemi", sessions: 32, rating: 4.8, earnings: "320,000 XAF" },
      { name: "Dr. Fatima Al-Rashid", sessions: 28, rating: 4.7, earnings: "280,000 XAF" }
    ],
    researchAids: [
      { name: "Dr. Neba Emmanuel", tasks: 23, rating: 4.9, earnings: "230,000 XAF" },
      { name: "Emma Wilson", tasks: 18, rating: 4.8, earnings: "180,000 XAF" },
      { name: "David Chen", tasks: 15, rating: 4.6, earnings: "150,000 XAF" }
    ]
  };

  const commonTopics = [
    { topic: "Research Methodology", bookings: 89, percentage: "23%" },
    { topic: "Data Analysis", bookings: 67, percentage: "17%" },
    { topic: "Literature Review", bookings: 54, percentage: "14%" },
    { topic: "Thesis Writing", bookings: 43, percentage: "11%" },
    { topic: "Statistical Analysis", bookings: 38, percentage: "10%" }
  ];

  const dropOffPoints = [
    { stage: "Registration to Profile Completion", dropoff: "15%", users: 58 },
    { stage: "Profile to First Search", dropoff: "22%", users: 85 },
    { stage: "Search to Booking", dropoff: "35%", users: 135 },
    { stage: "Booking to Session", dropoff: "8%", users: 31 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Full Report
        </Button>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {engagementData.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className={`text-xs ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Performers */}
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
              {topPerformers.researchers.map((researcher, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{researcher.name}</p>
                    <p className="text-sm text-gray-600">{researcher.sessions} sessions • {researcher.rating}/5 ⭐</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{researcher.earnings}</p>
                  </div>
                </div>
              ))}
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
              {topPerformers.researchAids.map((aid, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{aid.name}</p>
                    <p className="text-sm text-gray-600">{aid.tasks} tasks • {aid.rating}/5 ⭐</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{aid.earnings}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Most Popular Consultation Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {commonTopics.map((topic, index) => (
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
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Journey Drop-off Points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            User Journey Drop-off Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dropOffPoints.map((point, index) => (
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
            ))}
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
