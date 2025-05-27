
import PlatformMetricsCards from "@/components/dashboard/quality/PlatformMetricsCards";
import PlatformFeedbackModal from "@/components/dashboard/quality/PlatformFeedbackModal";
import RecentImprovements from "@/components/dashboard/quality/RecentImprovements";
import SuggestionBox from "@/components/dashboard/quality/SuggestionBox";
import FeedbackAreas from "@/components/dashboard/quality/FeedbackAreas";
import { useQualityFeedback } from "@/hooks/useQualityFeedback";

const QualityAssuranceAndFeedbackTab = () => {
  const { platformMetrics, feedbackCategories, recentImprovements } = useQualityFeedback();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Platform Quality & Feedback</h2>
        <PlatformFeedbackModal feedbackCategories={feedbackCategories} />
      </div>

      <PlatformMetricsCards metrics={platformMetrics} />
      <RecentImprovements improvements={recentImprovements} />
      <SuggestionBox />
      <FeedbackAreas />
    </div>
  );
};

export default QualityAssuranceAndFeedbackTab;
