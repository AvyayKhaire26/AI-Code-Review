export interface UserStatsResponse {
  totalReviews: number;
  totalBugsFound: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  reviewsByLanguage: Record<string, number>;
  averageProcessingTimeMs: number;
}
