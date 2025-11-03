
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PlatformMetrics, Improvement } from "@/types/qualityFeedback";

export const useQualityFeedback = () => {
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics | null>(null);
  const [feedbackCategories, setFeedbackCategories] = useState<string[]>([]);
  const [recentImprovements, setRecentImprovements] = useState<Improvement[]>([]);
  const [positiveFeedback, setPositiveFeedback] = useState<any[]>([]); // New state
  const [negativeFeedback, setNegativeFeedback] = useState<any[]>([]); // New state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch Platform Metrics
        const { data: metricsData, error: metricsError } = await supabase
          .from("platform_metrics")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (metricsError) throw metricsError;
        if (metricsData) {
          setPlatformMetrics({
            overall_rating: metricsData.overall_rating,
            total_feedbacks: metricsData.total_feedbacks,
            improvement_rate: metricsData.improvement_rate,
            user_satisfaction: metricsData.user_satisfaction,
          });
        }

        // Fetch Feedback Categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("feedback_categories")
          .select("name");

        if (categoriesError) throw categoriesError;
        if (categoriesData) {
          setFeedbackCategories(categoriesData.map((cat) => cat.name));
        }

        // Fetch Recent Improvements
        const { data: improvementsData, error: improvementsError } = await supabase
          .from("improvements")
          .select("*")
          .order("implemented_date", { ascending: false })
          .limit(3);

        if (improvementsError) throw improvementsError;
        if (improvementsData) {
          setRecentImprovements(improvementsData.map((imp) => ({
            title: imp.title,
            description: imp.description,
            implemented_date: imp.implemented_date,
            user_requests: imp.user_requests,
          })));
        }

        // Fetch Recent Positive Feedback (e.g., rating 4 or 5, excluding suggestions)
        const { data: positiveData, error: positiveError } = await supabase
          .from("feedback")
          .select("text, category, rating")
          .gte("rating", 4) // Rating 4 or 5
          .neq("category", "Suggestion") // Exclude suggestions
          .order("created_at", { ascending: false })
          .limit(4);

        if (positiveError) throw positiveError;
        if (positiveData) {
          setPositiveFeedback(positiveData);
        }

        // Fetch Recent Negative Feedback (e.g., rating 1 or 2, excluding suggestions)
        const { data: negativeData, error: negativeError } = await supabase
          .from("feedback")
          .select("text, category, rating")
          .lte("rating", 2) // Rating 1 or 2
          .neq("category", "Suggestion") // Exclude suggestions
          .order("created_at", { ascending: false })
          .limit(4);

        if (negativeError) throw negativeError;
        if (negativeData) {
          setNegativeFeedback(negativeData);
        }

      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching quality feedback data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
};
