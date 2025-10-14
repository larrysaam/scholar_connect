
import PlatformMetricsCards from "@/components/dashboard/quality/PlatformMetricsCards";
import PlatformFeedbackModal from "@/components/dashboard/quality/PlatformFeedbackModal";
import RecentImprovements from "@/components/dashboard/quality/RecentImprovements";
import SuggestionBox from "@/components/dashboard/quality/SuggestionBox";
import FeedbackAreas from "@/components/dashboard/quality/FeedbackAreas";
import { useQualityFeedback } from "@/hooks/useQualityFeedback";

const QualityAssuranceAndFeedbackTab = () => {
  const { platformMetrics, feedbackCategories, recentImprovements, positiveFeedback, negativeFeedback, loading, error } = useQualityFeedback();

  if (loading) {
    return <div className="text-center py-10">Loading quality and feedback data...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-xl sm:text-2xl font-bold">Platform Quality & Feedback</h2>
        <PlatformFeedbackModal feedbackCategories={feedbackCategories} />
      </div>

      <PlatformMetricsCards metrics={platformMetrics} />
      {/* <RecentImprovements improvements={recentImprovements} /> */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Recent Positive Feedback</h3>
          {positiveFeedback.length > 0 ? (
            <ul className="space-y-2 sm:space-y-3">
              {positiveFeedback.map((feedback, index) => (
                <li key={index} className="bg-green-50 p-3 sm:p-4 rounded-lg shadow-sm">
                  <p className="font-medium text-sm sm:text-base">Rating: {feedback.rating} / 5</p>
                  <p className="text-gray-700 text-xs sm:text-sm">Category: {feedback.category}</p>
                  <p className="text-gray-800 mt-1 text-xs sm:text-sm">"{feedback.text}"</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No recent positive feedback.</p>
          )}
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Recent Negative Feedback</h3>
          {negativeFeedback.length > 0 ? (
            <ul className="space-y-2 sm:space-y-3">
              {negativeFeedback.map((feedback, index) => (
                <li key={index} className="bg-red-50 p-3 sm:p-4 rounded-lg shadow-sm">
                  <p className="font-medium text-sm sm:text-base">Rating: {feedback.rating} / 5</p>
                  <p className="text-gray-700 text-xs sm:text-sm">Category: {feedback.category}</p>
                  <p className="text-gray-800 mt-1 text-xs sm:text-sm">"{feedback.text}"</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No recent negative feedback.</p>
          )}
        </div>
      </div>
      <SuggestionBox />
      <FeedbackAreas />
    </div>
  );
};

export default QualityAssuranceAndFeedbackTab;
