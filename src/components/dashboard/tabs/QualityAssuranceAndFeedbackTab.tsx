
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Platform Quality & Feedback</h2>
        <PlatformFeedbackModal feedbackCategories={feedbackCategories} />
      </div>

      <PlatformMetricsCards metrics={platformMetrics} />
      <RecentImprovements improvements={recentImprovements} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Recent Positive Feedback</h3>
          {positiveFeedback.length > 0 ? (
            <ul className="space-y-3">
              {positiveFeedback.map((feedback, index) => (
                <li key={index} className="bg-green-50 p-4 rounded-lg shadow-sm">
                  <p className="font-medium">Rating: {feedback.rating} / 5</p>
                  <p className="text-gray-700">Category: {feedback.category}</p>
                  <p className="text-gray-800 mt-1">"{feedback.text}"</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent positive feedback.</p>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Recent Negative Feedback</h3>
          {negativeFeedback.length > 0 ? (
            <ul className="space-y-3">
              {negativeFeedback.map((feedback, index) => (
                <li key={index} className="bg-red-50 p-4 rounded-lg shadow-sm">
                  <p className="font-medium">Rating: {feedback.rating} / 5</p>
                  <p className="text-gray-700">Category: {feedback.category}</p>
                  <p className="text-gray-800 mt-1">"{feedback.text}"</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent negative feedback.</p>
          )}
        </div>
      </div>
      <SuggestionBox />
      <FeedbackAreas />
    </div>
  );
};

export default QualityAssuranceAndFeedbackTab;
