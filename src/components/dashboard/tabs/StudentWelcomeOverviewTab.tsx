
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuickStatsCards from "../overview/QuickStatsCards";
import NextSessionCard from "../overview/NextSessionCard";
import RecentSummariesCard from "../overview/RecentSummariesCard";
import QuickActionsCard from "../overview/QuickActionsCard";

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

interface RecentSummary {
  id: string;
  researcher: string;
  topic: string;
  date: string;
  notes: string;
}

const StudentWelcomeOverviewTab = () => {
  const navigate = useNavigate();
  const [stats] = useState<QuickStats>({
    upcomingSessions: 2,
    completedSessions: 5,
    newMessages: 1,
    researchGoals: 3
  });

  const [upcomingSession] = useState<UpcomingSession>({
    id: "1",
    researcher: "Dr. Marie Ngono Abega",
    topic: "Research Methodology Review",
    datetime: "Tomorrow, 2:00 PM",
    countdownHours: 18
  });

  const [recentSummaries] = useState<RecentSummary[]>([
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

  const handleFindResearcher = () => {
    navigate("/researchers");
  };

  const handleCheckMessages = () => {
    window.dispatchEvent(new CustomEvent('setActiveTab', { detail: 'messages' }));
  };

  const handleMyProgress = () => {
    window.dispatchEvent(new CustomEvent('setActiveTab', { detail: 'performance' }));
  };

  const handleViewNotes = (summaryId: string) => {
    window.dispatchEvent(new CustomEvent('setActiveTab', { detail: 'documents' }));
  };

  const handleJoinSession = (sessionId: string) => {
    window.open('https://meet.google.com/new', '_blank');
  };

  return (
    <div className="space-y-6">
      <QuickStatsCards stats={stats} />
      
      <NextSessionCard 
        session={upcomingSession} 
        onJoinSession={handleJoinSession} 
      />

      <RecentSummariesCard 
        summaries={recentSummaries} 
        onViewNotes={handleViewNotes} 
      />

      <QuickActionsCard 
        onFindResearcher={handleFindResearcher}
        onCheckMessages={handleCheckMessages}
        onMyProgress={handleMyProgress}
      />
    </div>
  );
};

export default StudentWelcomeOverviewTab;
