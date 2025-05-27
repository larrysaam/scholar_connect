
export interface PlatformMetrics {
  overallRating: number;
  totalFeedbacks: number;
  improvementRate: number;
  userSatisfaction: number;
}

export interface Improvement {
  title: string;
  description: string;
  implementedDate: string;
  userRequests: number;
}

export interface FeedbackFormData {
  rating: number;
  category: string;
  text: string;
}
