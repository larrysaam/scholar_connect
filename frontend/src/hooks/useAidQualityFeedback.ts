import { useState, useEffect } from "react";

// This is a placeholder. You should implement the actual data fetching logic for aid quality feedback.
export function useAidQualityFeedback() {
  const [platformMetrics, setPlatformMetrics] = useState([]);
  const [feedbackCategories, setFeedbackCategories] = useState([]);
  const [recentImprovements, setRecentImprovements] = useState([]);
  const [positiveFeedback, setPositiveFeedback] = useState([]);
  const [negativeFeedback, setNegativeFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Replace with real API call for aid quality feedback
    setLoading(true);
    setTimeout(() => {
      setPlatformMetrics([
        { label: "Aid Satisfaction", value: 4.7 },
        { label: "Aid Response Time", value: "1.2h" },
        { label: "Aid Engagement", value: "High" },
      ]);
      setFeedbackCategories(["Communication", "Helpfulness", "Expertise"]);
      setRecentImprovements([
        { title: "Faster Response Times", description: "Average response time reduced by 30%." },
        { title: "Expanded Training", description: "Aids now receive monthly upskilling." },
      ]);
      setPositiveFeedback([
        { rating: 5, category: "Helpfulness", text: "Aid was very supportive and knowledgeable." },
        { rating: 4, category: "Communication", text: "Clear and prompt replies." },
      ]);
      setNegativeFeedback([
        { rating: 2, category: "Expertise", text: "Aid was unsure about some topics." },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  return {
    platformMetrics,
    feedbackCategories,
    recentImprovements,
    positiveFeedback,
    negativeFeedback,
    loading,
    error,
  };
}
