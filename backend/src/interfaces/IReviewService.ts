import { CodeReviewRequest } from '../models/request/CodeReviewRequest';
import { ReviewResponse } from '../models/response/ReviewResponse';
import { UserStatsResponse } from '../models/response/UserStatsResponse';
import { Language, Severity } from '../entities/Review.entity';

export interface PaginatedReviews {
  reviews: ReviewResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IReviewService {
  /**
   * Create a new code review using AI
   */
  createReview(request: CodeReviewRequest, username: string): Promise<ReviewResponse>;

  /**
   * Get review by ID
   */
  getReviewById(reviewId: number, username: string): Promise<ReviewResponse>;

  /**
   * Get all reviews for a user
   */
  getUserReviews(username: string): Promise<ReviewResponse[]>;

  /**
   * Get paginated reviews with filters
   */
  getUserReviewsPaginated(
    username: string,
    language?: Language,
    severity?: Severity,
    page?: number,
    limit?: number
  ): Promise<PaginatedReviews>;

  /**
   * Get user statistics
   */
  getUserStats(username: string): Promise<UserStatsResponse>;

  /**
   * Delete a review
   */
  deleteReview(reviewId: number, username: string): Promise<void>;
}
