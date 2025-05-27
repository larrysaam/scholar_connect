
import UpcomingTab from "@/components/dashboard/tabs/UpcomingTab";
import PastTab from "@/components/dashboard/tabs/PastTab";
import PaymentsTab from "@/components/dashboard/tabs/PaymentsTab";
import ProfileTab from "@/components/dashboard/tabs/ProfileTab";
import DocumentsTab from "@/components/dashboard/tabs/DocumentsTab";
import SettingsTab from "@/components/dashboard/tabs/SettingsTab";
import ResearchAidQualityTab from "@/components/dashboard/tabs/ResearchAidQualityTab";
import ResearchAidsTasksTab from "@/components/dashboard/tabs/ResearchAidsTasksTab";
import DiscussionTab from "@/components/dashboard/tabs/DiscussionTab";
import NotificationsTab from "@/components/dashboard/tabs/NotificationsTab";
import ResearchAidsOverview from "@/components/dashboard/tabs/ResearchAidsOverview";
import ResearchAidsJobRequests from "@/components/dashboard/tabs/ResearchAidsJobRequests";
import ResearchAidsMessages from "@/components/dashboard/tabs/ResearchAidsMessages";
import ResearchAidsAppointments from "@/components/dashboard/tabs/ResearchAidsAppointments";
import ResearchAidsFilesDeliverables from "@/components/dashboard/tabs/ResearchAidsFilesDeliverables";
import ResearchAidsPaymentsEarnings from "@/components/dashboard/tabs/ResearchAidsPaymentsEarnings";
import ResearchAidsProfileRatings from "@/components/dashboard/tabs/ResearchAidsProfileRatings";
import ResearchAidsSettings from "@/components/dashboard/tabs/ResearchAidsSettings";
import ResearchAidsPreviousWorks from "@/components/dashboard/tabs/ResearchAidsPreviousWorks";
import ResearchAidsNotifications from "@/components/dashboard/tabs/ResearchAidsNotifications";
import QualityAssuranceAndFeedbackTab from "@/components/dashboard/tabs/QualityAssuranceAndFeedbackTab";
import VerificationTab from "@/components/dashboard/tabs/VerificationTab";

interface DashboardTabRendererProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardTabRenderer = ({ activeTab, setActiveTab }: DashboardTabRendererProps) => {
  switch (activeTab) {
    case "overview":
      return <ResearchAidsOverview setActiveTab={setActiveTab} />;
    case "job-requests":
      return <ResearchAidsJobRequests />;
    case "messages":
      return <ResearchAidsMessages />;
    case "appointments":
      return <ResearchAidsAppointments />;
    case "files-deliverables":
      return <ResearchAidsFilesDeliverables />;
    case "payments-earnings":
      return <ResearchAidsPaymentsEarnings />;
    case "profile-ratings":
      return <ResearchAidsProfileRatings />;
    case "previous-works":
      return <ResearchAidsPreviousWorks />;
    case "notifications":
      return <ResearchAidsNotifications />;
    case "discussion":
      return <DiscussionTab />;
    case "quality-feedback":
      return <QualityAssuranceAndFeedbackTab />;
    case "verification":
      return <VerificationTab />;
    case "settings":
      return <ResearchAidsSettings />;
    default:
      return <ResearchAidsOverview setActiveTab={setActiveTab} />;
  }
};

export default DashboardTabRenderer;
