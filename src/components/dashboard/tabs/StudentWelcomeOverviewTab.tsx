
import { useNavigate } from "react-router-dom";
import QuickStatsCards from "../overview/QuickStatsCards";
import NextSessionCard from "../overview/NextSessionCard";
import RecentSummariesCard from "../overview/RecentSummariesCard";
import QuickActionsCard from "../overview/QuickActionsCard";
import { useStudentWelcomeOverview } from "@/hooks/useStudentWelcomeOverview";
import { Loader2 } from "lucide-react";

const StudentWelcomeOverviewTab = () => {
  const navigate = useNavigate();
  const { loading, stats, nextSession, recentSummaries } = useStudentWelcomeOverview();

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading overview...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <QuickStatsCards stats={stats} />
      
      {nextSession && (
        <NextSessionCard 
          // @ts-ignore
          session={nextSession} 
          onJoinSession={handleJoinSession} 
        />
      )}

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
