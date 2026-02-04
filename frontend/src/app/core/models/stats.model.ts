export interface UserStats {
  totalReviews: number;
  totalBugsFound: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  reviewsByLanguage: { [key: string]: number };
  averageProcessingTimeMs: number;
}
