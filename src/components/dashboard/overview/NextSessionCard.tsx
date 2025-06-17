
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Video } from "lucide-react";

interface UpcomingSession {
  id: string;
  researcher: string;
  topic: string;
  datetime: string;
  countdownHours: number;
}

interface NextSessionCardProps {
  session: UpcomingSession;
  onJoinSession: (sessionId: string) => void;
}

const NextSessionCard = ({ session, onJoinSession }: NextSessionCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Next Session</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div className="flex-1">
            <h3 className="font-semibold">{session.topic}</h3>
            <p className="text-sm text-gray-600">with {session.researcher}</p>
            <p className="text-sm text-blue-600">{session.datetime}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{session.countdownHours}h</p>
            <p className="text-xs text-gray-500">until session</p>
          </div>
          <Button 
            className="ml-4"
            onClick={() => onJoinSession(session.id)}
          >
            <Video className="h-4 w-4 mr-2" />
            Join Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NextSessionCard;
