export interface PerformanceMetrics {
  averageRating: number;
  totalReviews: number;
  responseTime: number; // in hours
  noShowRate: number; // percentage
  completionRate: number; // percentage
  regionalReach: Array<{
    country: string;
    sessions: number;
  }>;
  rankingStatus: "top-expert" | "expert" | "rising" | "new";
}
