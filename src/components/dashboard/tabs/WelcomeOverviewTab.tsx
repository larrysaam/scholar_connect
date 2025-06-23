
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, Users, TrendingUp, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const WelcomeOverviewTab = () => {
  const { profile } = useAuth();

  const getWelcomeMessage = () => {
    if (!profile?.name) return "Welcome!";
    
    const nameParts = profile.name.split(' ');
    const lastName = nameParts[nameParts.length - 1];
    
    // Check for academic rank first (Professor takes precedence)
    if (profile.academic_rank && 
        (profile.academic_rank.includes('Professor') || 
         profile.academic_rank.includes('Prof'))) {
      return `Welcome, Prof. ${lastName}!`;
    }
    
    // Check for PhD/Postdoc in level_of_study or highest_education
    const hasPhD = profile.level_of_study?.toLowerCase().includes('phd') ||
                   profile.level_of_study?.toLowerCase().includes('postdoc') ||
                   profile.highest_education?.toLowerCase().includes('phd') ||
                   profile.highest_education?.toLowerCase().includes('postdoc');
    
    if (hasPhD) {
      return `Welcome, Dr. ${lastName}!`;
    }
    
    return `Welcome, ${lastName}!`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{getWelcomeMessage()}</h2>
          <p className="text-gray-600">
            You have <span className="font-semibold text-blue-600">3 upcoming consultations</span> and 
            <span className="font-semibold text-green-600"> 2 new messages</span> waiting for you.
          </p>
        </CardContent>
      </Card>

      {/* Weekly Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-xl font-bold">12</p>
                <p className="text-xs text-gray-500">Consultations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Earnings</p>
                <p className="text-xl font-bold">180,000</p>
                <p className="text-xs text-gray-500">XAF this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Hours</p>
                <p className="text-xl font-bold">24</p>
                <p className="text-xs text-gray-500">Total this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-xl font-bold">4.8</p>
                <p className="text-xs text-gray-500">Average</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Today's Schedule</span>
            <Badge variant="secondary">3 consultations</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Machine Learning Consultation</p>
                  <p className="text-sm text-gray-600">with Sarah Johnson</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">10:00 AM</p>
                <p className="text-sm text-gray-600">1 hour</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Data Analysis Review</p>
                  <p className="text-sm text-gray-600">with Michael Chen</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">2:00 PM</p>
                <p className="text-sm text-gray-600">2 hours</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Research Methodology</p>
                  <p className="text-sm text-gray-600">with Emma Wilson</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">4:30 PM</p>
                <p className="text-sm text-gray-600">1.5 hours</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              View Calendar
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="mr-2 h-4 w-4" />
              Check Messages
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <DollarSign className="mr-2 h-4 w-4" />
              View Earnings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">New consultation request</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Payment received</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Profile viewed 5 times</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeOverviewTab;
