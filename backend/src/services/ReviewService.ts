import { injectable, inject } from 'inversify';
import { IReviewService, PaginatedReviews } from '../interfaces/IReviewService';
import { ReviewRepository } from '../repositories/Review.repository';
import { UserRepository } from '../repositories/User.repository';
import { IGeminiService } from '../interfaces/IGeminiService';
import { CodeReviewRequest } from '../models/request/CodeReviewRequest';
import { ReviewResponse } from '../models/response/ReviewResponse';
import { UserStatsResponse } from '../models/response/UserStatsResponse';
import { Review, Language, Severity } from '../entities/Review.entity';
import { TYPES } from '../types/inversify.types';
import { ResourceNotFoundException, AccessDeniedException } from '../exceptions/CustomErrors';
import { logger } from '../utils/logger.util';

@injectable()
export class ReviewService implements IReviewService {
  constructor(
    @inject(TYPES.ReviewRepository) private reviewRepository: ReviewRepository,
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.IGeminiService) private geminiService: IGeminiService
  ) {}

  async createReview(request: CodeReviewRequest, username: string): Promise<ReviewResponse> {
    // Find user
    logger.info(`Creating review for user: ${username}, language: ${request.language}`);
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new ResourceNotFoundException(`User not found: ${username}`);
    }

    // Start timing
    const startTime = Date.now();

    try {
      // Call Gemini API
      const aiResponse = await this.geminiService.analyzeCode(
        request.codeSnippet,
        request.language,
        request.customPrompt
      );

      // Calculate processing time
      const processingTime = Date.now() - startTime;
      logger.info(`AI analysis completed in ${processingTime}ms`);

      // Parse AI response and extract metrics
      const bugsFound = this.countOccurrences(aiResponse, 'bug');
      const suggestionsCount = this.countOccurrences(aiResponse, 'suggest');
      const severity = this.determineSeverity(aiResponse);

      // Create review entity
      const review = new Review();
      review.user = user;
      review.codeSnippet = request.codeSnippet;
      review.language = request.language;
      review.customPrompt = request.customPrompt;
      review.aiResponse = aiResponse;
      review.reviewSummary = this.extractSummary(aiResponse);
      review.severity = severity;
      review.bugsFound = bugsFound;
      review.suggestionsCount = suggestionsCount;
      review.processingTimeMs = processingTime;

      // Save to database
      const savedReview = await this.reviewRepository.save(review);
      logger.info(`Review saved with ID: ${savedReview.id}`);

      // Convert to response
      return this.convertToResponse(savedReview);
    } catch (error: any) {
      logger.error(`Error creating review for user: ${username}`, error);
      throw new Error(`Failed to create review: ${error.message}`);
    }
  }

  async getReviewById(reviewId: number, username: string): Promise<ReviewResponse> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new ResourceNotFoundException(`Review not found: ${reviewId}`);
    }

    // Check if this review belongs to the requesting user
    const user = await review.user;
    if (user.username !== username) {
      throw new AccessDeniedException("You don't have permission to view this review");
    }

    return this.convertToResponse(review);
  }

  async getUserReviews(username: string): Promise<ReviewResponse[]> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new ResourceNotFoundException(`User not found: ${username}`);
    }

    const reviews = await this.reviewRepository.findByUserIdOrderByCreatedAtDesc(user.id);
    return reviews.map(review => this.convertToResponse(review));
  }

  async getUserReviewsPaginated(
    username: string,
    language?: Language,
    severity?: Severity,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedReviews> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new ResourceNotFoundException(`User not found: ${username}`);
    }

    const { reviews, total } = await this.reviewRepository.findByUserIdWithFilters(
      { userId: user.id, language, severity },
      { page, limit }
    );

    const totalPages = Math.ceil(total / limit);

    return {
      reviews: reviews.map(review => this.convertToResponse(review)),
      total,
      page,
      limit,
      totalPages
    };
  }

  async getUserStats(username: string): Promise<UserStatsResponse> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new ResourceNotFoundException(`User not found: ${username}`);
    }

    const reviews = await this.reviewRepository.findByUserIdOrderByCreatedAtDesc(user.id);

    // Calculate statistics
    const totalReviews = reviews.length;
    const totalBugsFound = reviews.reduce((sum, r) => sum + r.bugsFound, 0);
    
    const criticalIssues = reviews.filter(r => r.severity === Severity.CRITICAL).length;
    const highIssues = reviews.filter(r => r.severity === Severity.HIGH).length;
    const mediumIssues = reviews.filter(r => r.severity === Severity.MEDIUM).length;
    const lowIssues = reviews.filter(r => r.severity === Severity.LOW).length;

    // Group by language
    const reviewsByLanguage: Record<string, number> = {};
    reviews.forEach(review => {
      const lang = review.language;
      reviewsByLanguage[lang] = (reviewsByLanguage[lang] || 0) + 1;
    });

    // Average processing time
    const averageProcessingTimeMs = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.processingTimeMs || 0), 0) / reviews.length
      : 0;

    return {
      totalReviews,
      totalBugsFound,
      criticalIssues,
      highIssues,
      mediumIssues,
      lowIssues,
      reviewsByLanguage,
      averageProcessingTimeMs
    };
  }

  async deleteReview(reviewId: number, username: string): Promise<void> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new ResourceNotFoundException(`Review not found: ${reviewId}`);
    }

    // Check if user owns this review
    const user = await review.user;
    if (user.username !== username) {
      throw new AccessDeniedException("You don't have permission to delete this review");
    }

    await this.reviewRepository.delete(reviewId);
  }

  // Helper methods
  private convertToResponse(review: Review): ReviewResponse {
    return {
      id: review.id,
      codeSnippet: review.codeSnippet,
      language: review.language,
      customPrompt: review.customPrompt,
      aiResponse: review.aiResponse,
      reviewSummary: review.reviewSummary,
      severity: review.severity,
      bugsFound: review.bugsFound,
      suggestionsCount: review.suggestionsCount,
      processingTimeMs: review.processingTimeMs,
      createdAt: review.createdAt || new Date(),
      userRating: review.userRating
    };
  }

  private countOccurrences(text: string, keyword: string): number {
    const lowerText = text.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();
    let count = 0;
    let index = 0;

    while ((index = lowerText.indexOf(lowerKeyword, index)) !== -1) {
      count++;
      index += lowerKeyword.length;
    }

    return count;
  }

  private determineSeverity(aiResponse: string): Severity {
    const lower = aiResponse.toLowerCase();

    if (
      lower.includes('critical') ||
      lower.includes('severe') ||
      lower.includes('sql injection') ||
      lower.includes('security vulnerability')
    ) {
      return Severity.CRITICAL;
    } else if (
      lower.includes('high') ||
      lower.includes('major') ||
      lower.includes('serious bug')
    ) {
      return Severity.HIGH;
    } else if (lower.includes('medium') || lower.includes('moderate')) {
      return Severity.MEDIUM;
    } else {
      return Severity.LOW;
    }
  }

  private extractSummary(aiResponse: string): string {
    // Extract first 200 characters as summary
    if (aiResponse.length > 200) {
      return aiResponse.substring(0, 200) + '...';
    }
    return aiResponse;
  }
}
