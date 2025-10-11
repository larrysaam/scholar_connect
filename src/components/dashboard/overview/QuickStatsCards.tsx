
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CheckCircle, MessageCircle, BookOpen } from "lucide-react";

interface QuickStats {
  upcomingSessions: number;
  completedSessions: number;
  newMessages: number;
  researchGoals: number;
}

interface QuickStatsCardsProps {
  stats: QuickStats;
}

const QuickStatsCards = ({ stats }: QuickStatsCardsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">      
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 ">Upcoming Sessions</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.upcomingSessions}</p>
            </div>
          </div>
        </CardContent>
      </Card>      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 ">Completed Sessions</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.completedSessions}</p>
            </div>
          </div>
        </CardContent>
      </Card>      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 sm:p-3 bg-purple-100 rounded-lg flex-shrink-0">
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 ">New Messages</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.newMessages}</p>
            </div>
          </div>
        </CardContent>
      </Card>      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg flex-shrink-0">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-yellow-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-600 ">Research Goals</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.researchGoals}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStatsCards;
