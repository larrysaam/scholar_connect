
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageSquare, DollarSign, Bell, TrendingUp, Users, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WelcomeOverviewTab = () => {
  const { toast } = useToast();

  // Sample recent notifications that would come from the notifications tab
  const recentNotifications = [
    {
      id: 1,
      title: "New Consultation Request",
      message: "Sarah Johnson has requested a consultation on AI in Healthcare",
      time: "5 minutes ago",
      isNew: true,
      type: "consultation_request"
    },
    {
      id: 2,
      title: "Co-authorship Response",
      message: "Dr. Michael Brown accepted your co-authorship invitation",
      time: "2 hours ago", 
      isNew: true,
      type: "co_author_invitation"
    },
    {
      id: 3,
      title: "Payment Received",
      message: "Payment of 25,000 XAF for consultation completed",
      time: "1 day ago",
      isNew: false,
      type: "payment"
    }
  ];

  const handleViewCalendar = () => {
    toast({
      title: "Opening Calendar",
      description: "Redirecting to your Google Calendar..."
    });
    // In a real app, this would integrate with Google Calendar API
    window.open("https://calendar.google.com", "_blank");
  };

  const handleCheckMessages = () => {
    toast({
      title: "Opening Messages",
      description: "Viewing your latest messages..."
    });
    // In a real app, this would open an in-app messaging system
    console.log("Opening messaging interface");
  };

  const handleViewEarnings = () => {
    toast({
      title: "Viewing Earnings",
      description: "Opening earnings overview..."
    });
    // This would typically navigate to the payments tab or open earnings modal
    console.log("Navigating to earnings section");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold">12 Consultations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold">485,000 XAF</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-2xl font-bold">4.8/5.0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={handleViewCalendar} className="h-20 flex flex-col space-y-2">
              <Calendar className="h-6 w-6" />
              <span>View Calendar</span>
            </Button>
            
            <Button onClick={handleCheckMessages} variant="outline" className="h-20 flex flex-col space-y-2">
              <MessageSquare className="h-6 w-6" />
              <span>Check Messages</span>
            </Button>
            
            <Button onClick={handleViewEarnings} variant="outline" className="h-20 flex flex-col space-y-2">
              <DollarSign className="h-6 w-6" />
              <span>View Earnings</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Important Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Important Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentNotifications.map((notification) => (
              <div key={notification.id} className="flex justify-between items-start p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium">{notification.title}</h4>
                    {notification.isNew && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Consultations Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">AI Healthcare Research</p>
                <p className="text-sm text-gray-600">with Sarah Johnson</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">2:00 PM - 3:00 PM</p>
                <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">Statistical Analysis Methods</p>
                <p className="text-sm text-gray-600">with Michael Chen</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">4:00 PM - 5:00 PM</p>
                <Badge variant="secondary">Pending</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeOverviewTab;
