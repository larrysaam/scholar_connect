
export interface PlatformMetrics {
  overall_rating: number;
  total_feedbacks: number;
  improvement_rate: number;
  user_satisfaction: number;
}

export interface Improvement {
  title: string;
  description: string;
  implemented_date: string;
  user_requests: number;
}

export interface FeedbackFormData {
  rating: number;
  category: string;
  text: string;
}
