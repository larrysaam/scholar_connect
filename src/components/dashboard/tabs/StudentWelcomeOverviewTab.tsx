
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MessageCircle, BookOpen, AlertTriangle, CheckCircle, Video, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickStats {
  upcomingSessions: number;
  completedSessions: number;
  newMessages: number;
  researchGoals: number;
}

interface UpcomingSession {
  id: string;
  researcher: string;
  topic: string;
  datetime: string;
  countdownHours: number;
}

const StudentWelcomeOverviewTab = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<QuickStats>({
    upcomingSessions: 2,
    completedSessions: 5,
    newMessages: 1,
    researchGoals: 3
  });

  const [upcomingSession, setUpcomingSession] = useState<UpcomingSession>({
    id: "1",
    researcher: "Dr. Marie Ngono Abega",
    topic: "Research Methodology Review",
    datetime: "Tomorrow, 2:00 PM",
    countdownHours: 18
  });

  const [recentSummaries] = useState([
    {
      id: "1",
      researcher: "Dr. Paul Mbarga",
      topic: "Thesis Structure",
      date: "2 days ago",
      notes: "Excellent progress on introduction chapter"
    },
    {
      id: "2", 
      researcher: "Prof. Sarah Tankou",
      topic: "Literature Review",
      date: "1 week ago",
      notes: "Focus on methodology gaps in current literature"
    }
  ]);

  const handleBookSession = () => {
    navigate("/researchers");
  };

  const handleFindResearcher = () => {
    navigate("/researchers");
  };

  const handleCheckMessages = () => {
    // This would normally set the active tab through props, but for demo we'll show a toast
    window.dispatchEvent(new CustomEvent('setActiveTab', { detail: 'messages' }));
  };

  const handleMyProgress = () => {
    window.dispatchEvent(new CustomEvent('setActiveTab', { detail: 'performance' }));
  };

  const handleViewNotes = (summaryId: string) => {
    // Navigate to documents or show notes modal
    window.dispatchEvent(new CustomEvent('setActiveTab', { detail: 'documents' }));
  };

  const handleJoinSession = (sessionId: string) => {
    // In a real app, this would open the video conference link
    alert(`Joining session ${sessionId}. Video link would open here.`);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Greeting */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Emmanuel!</h1>
        <p className="opacity-90">Ready to advance your research journey?</p>
        <div className="mt-4">
          <Button 
            className="bg-white text-green-600 hover:bg-gray-100"
            onClick={handleBookSession}
          >
            <Search className="h-4 w-4 mr-2" />
            Book a Session
          </Button>
        </div>
      </div>

      {/* Quick Navigation & Stats */}
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

      {/* Upcoming Session Snapshot */}
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
              <h3 className="font-semibold">{upcomingSession.topic}</h3>
              <p className="text-sm text-gray-600">with {upcomingSession.researcher}</p>
              <p className="text-sm text-blue-600">{upcomingSession.datetime}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{upcomingSession.countdownHours}h</p>
              <p className="text-xs text-gray-500">until session</p>
            </div>
            <Button 
              className="ml-4"
              onClick={() => handleJoinSession(upcomingSession.id)}
            >
              <Video className="h-4 w-4 mr-2" />
              Join Session
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Consultation Summaries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Consultation Summaries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSummaries.map((summary) => (
              <div key={summary.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{summary.topic}</h4>
                  <p className="text-sm text-gray-600">with {summary.researcher} • {summary.date}</p>
                  <p className="text-sm text-green-600 mt-1">{summary.notes}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewNotes(summary.id)}
                >
                  View Notes
                </Button>
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
            <Button 
              className="h-20 flex flex-col space-y-2"
              onClick={handleFindResearcher}
            >
              <Search className="h-6 w-6" />
              <span>Find Researcher</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col space-y-2"
              onClick={handleCheckMessages}
            >
              <MessageCircle className="h-6 w-6" />
              <span>Check Messages</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col space-y-2"
              onClick={handleMyProgress}
            >
              <BookOpen className="h-6 w-6" />
              <span>My Progress</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentWelcomeOverviewTab;
