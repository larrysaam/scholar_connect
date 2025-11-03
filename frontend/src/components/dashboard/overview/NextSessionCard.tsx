
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Video, Calendar, Plus } from "lucide-react";

interface UpcomingSession {
  id: string;
  researcher: string;
  topic: string;
  datetime: string;
  countdownHours: number;
}

interface NextSessionCardProps {
  session?: UpcomingSession | null;
  onJoinSession?: (sessionId: string) => void;
  onBookSession?: () => void;
}

const NextSessionCard = ({ session, onJoinSession, onBookSession }: NextSessionCardProps) => {
  if (!session) {
    return (
      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <span>Schedule Your Next Session</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-4">No upcoming consultations scheduled. Book your next session to get started!</p>
            {/* <Button
              onClick={onBookSession}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Book Consultation</span>
            </Button> */}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
          <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          <span>Next Session</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm sm:text-base truncate">{session.topic}</h3>
            <p className="text-xs sm:text-sm text-gray-600 truncate">with {session.researcher}</p>
            <p className="text-xs sm:text-sm text-blue-600 mt-1">{session.datetime}</p>
          </div>
          <div className="flex items-center justify-between sm:justify-center sm:flex-col gap-4 sm:gap-2">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{session.countdownHours}h</p>
              <p className="text-xs text-gray-500">until session</p>
            </div>
            {/* <Button 
              size="sm"
              className="flex-shrink-0 bg-blue-600 hover:bg-blue-700"
              onClick={() => onJoinSession?.(session.id)}
            >
              <Video className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Join Session</span>
            </Button> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NextSessionCard;
