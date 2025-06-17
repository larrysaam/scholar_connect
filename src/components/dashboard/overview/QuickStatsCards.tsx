
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Upcoming Sessions</p>
              <p className="text-2xl font-bold">{stats.upcomingSessions}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed Sessions</p>
              <p className="text-2xl font-bold">{stats.completedSessions}</p>
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
              <BookOpen className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Research Goals</p>
              <p className="text-2xl font-bold">{stats.researchGoals}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStatsCards;
