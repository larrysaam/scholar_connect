
import { useNavigate } from "react-router-dom";
import QuickStatsCards from "../overview/QuickStatsCards";
import NextSessionCard from "../overview/NextSessionCard";
import RecentSummariesCard from "../overview/RecentSummariesCard";
import QuickActionsCard from "../overview/QuickActionsCard";
import ResearcherAidStats from "../overview/ResearcherAidStats";
import { useStudentWelcomeOverview } from "@/hooks/useStudentWelcomeOverview";
import { Loader2 } from "lucide-react";

const StudentWelcomeOverviewTab = () => {
  const navigate = useNavigate();
  const { loading: overviewLoading, stats, nextSession, recentSummaries } = useStudentWelcomeOverview();

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

  const handleBookSession = () => {
    window.dispatchEvent(new CustomEvent('setActiveTab', { detail: 'session-booking' }));
  };

  if (overviewLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading overview...</span>
      </div>
    );
  }

  const formattedNextSession = nextSession ? {
    id: nextSession.id,
    researcher: nextSession.provider?.name || 'Researcher',
    topic: nextSession.service?.title || 'Consultation Session',
    datetime: new Date(nextSession.scheduled_date + ' ' + nextSession.scheduled_time).toLocaleString(),
    countdownHours: Math.ceil((new Date(nextSession.scheduled_date + ' ' + nextSession.scheduled_time).getTime() - new Date().getTime()) / (1000 * 60 * 60))
  } : null;

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <QuickStatsCards stats={stats} />
        
        <NextSessionCard 
          session={formattedNextSession} 
          onJoinSession={handleJoinSession}
          onBookSession={handleBookSession}
        />

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 sm:gap-6">
          <RecentSummariesCard 
            summaries={recentSummaries} 
            onViewNotes={handleViewNotes} 
          />

         
          
        </div>
        <ResearcherAidStats />
      </div>
    </div>
  );
};

export default StudentWelcomeOverviewTab;
