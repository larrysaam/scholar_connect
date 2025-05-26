
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MessageCircle, DollarSign, AlertTriangle, CheckCircle, Video } from "lucide-react";

interface QuickStats {
  completedConsultations: number;
  upcomingBookings: number;
  newMessages: number;
  monthlyEarnings: number;
}

interface Alert {
  id: string;
  type: "verification" | "booking" | "session";
  message: string;
  urgent: boolean;
}

const WelcomeOverviewTab = () => {
  const [stats, setStats] = useState<QuickStats>({
    completedConsultations: 8,
    upcomingBookings: 3,
    newMessages: 2,
    monthlyEarnings: 450000
  });

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "verification",
      message: "Complete your publication verification to increase your profile visibility",
      urgent: false
    },
    {
      id: "2",
      type: "booking",
      message: "2 new consultation requests waiting for your response",
      urgent: true
    },
    {
      id: "3",
      type: "session",
      message: "Upcoming session with John Doe in 25 minutes",
      urgent: true
    }
  ]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "verification": return <CheckCircle className="h-4 w-4" />;
      case "booking": return <Calendar className="h-4 w-4" />;
      case "session": return <Video className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Greeting */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome, Dr. Smith</h1>
        <p className="opacity-90">Ready to help students excel in their research journey?</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed This Month</p>
                <p className="text-2xl font-bold">{stats.completedConsultations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Upcoming Bookings</p>
                <p className="text-2xl font-bold">{stats.upcomingBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">New Messages</p>
                <p className="text-2xl font-bold">{stats.newMessages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Earnings</p>
                <p className="text-2xl font-bold">{stats.monthlyEarnings.toLocaleString()} XAF</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Important Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`flex items-center justify-between p-3 rounded-lg border ${
                alert.urgent ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    alert.urgent ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <p className="text-sm">{alert.message}</p>
                </div>
                {alert.urgent && (
                  <Badge variant="destructive" className="text-xs">
                    Urgent
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col space-y-2">
              <Calendar className="h-6 w-6" />
              <span>View Calendar</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <MessageCircle className="h-6 w-6" />
              <span>Check Messages</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <DollarSign className="h-6 w-6" />
              <span>View Earnings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeOverviewTab;
