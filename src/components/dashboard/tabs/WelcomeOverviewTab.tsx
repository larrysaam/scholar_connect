
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, Users, TrendingUp, MessageSquare, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWelcomeOverview } from "@/hooks/useWelcomeOverview";

const WelcomeOverviewTab = () => {
  const { profile } = useAuth();
  const {
    loading,
    upcomingConsultationsCount,
    weeklyStats,
    todaysSchedule,
    newMessagesCount,
  } = useWelcomeOverview();

  const getWelcomeMessage = () => {
    if (!profile?.name) return "Welcome!";
    
    const nameParts = profile.name.split(' ');
    const lastName = nameParts[nameParts.length - 1];
    
    // @ts-ignore
    if (profile.academic_rank && 
        // @ts-ignore
        (profile.academic_rank.includes('Professor') || 
        // @ts-ignore
         profile.academic_rank.includes('Prof'))) {
      return `Welcome, Prof. ${lastName}!`;
    }
    
    // @ts-ignore
    const hasPhD = profile.level_of_study?.toLowerCase().includes('phd') ||
                   // @ts-ignore
                   profile.level_of_study?.toLowerCase().includes('postdoc') ||
                   // @ts-ignore
                   profile.highest_education?.toLowerCase().includes('phd') ||
                   // @ts-ignore
                   profile.highest_education?.toLowerCase().includes('postdoc');
    
    if (hasPhD) {
      return `Welcome, Dr. ${lastName}!`;
    }
    
    return `Welcome, ${lastName}!`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading overview...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      {/* Welcome Message */}
      {/* <Card>
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{getWelcomeMessage()}</h2>
          <p className="text-sm sm:text-base text-gray-600">
            You have <span className="font-semibold text-blue-600">{upcomingConsultationsCount} upcoming consultations</span> and 
            <span className="font-semibold text-green-600">{newMessagesCount} new messages</span> waiting for you.
          </p>
        </CardContent>
      </Card> */}

      {/* Weekly Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600">This Week</p>
                <p className="text-lg sm:text-xl font-bold truncate">{weeklyStats.consultations}</p>
                <p className="text-xs text-gray-500">Consultations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600">Earnings</p>
                <p className="text-lg sm:text-xl font-bold truncate">{weeklyStats.earnings.toLocaleString()}</p>
                <p className="text-xs text-gray-500">XAF this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600">Hours</p>
                <p className="text-lg sm:text-xl font-bold truncate">{weeklyStats.hours}</p>
                <p className="text-xs text-gray-500">Total this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-600">Rating</p>
                <p className="text-lg sm:text-xl font-bold truncate">{weeklyStats.rating}</p>
                <p className="text-xs text-gray-500">Average</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader className="pb-2 sm:pb-6">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <span className="text-lg sm:text-xl">Today's Schedule</span>
            <Badge variant="secondary" className="w-fit">{todaysSchedule.length} consultations</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 sm:pt-6">
          <div className="space-y-3 sm:space-y-4">
            {todaysSchedule.map((booking: any) => (
              <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base truncate">{booking.service?.title || 'N/A'}</p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">with {booking.client?.name || 'N/A'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{booking.scheduled_time}</p>
                  <p className="text-sm text-gray-600">{booking.duration_minutes} min</p>
                </div>
              </div>
            ))}
            {todaysSchedule.length === 0 && (
              <p className="text-gray-500">No consultations scheduled for today.</p>
            )}
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
