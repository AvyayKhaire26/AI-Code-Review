import { Request, Response } from 'express';
import { container } from '../config/inversify.config';
import { IReviewService } from '../interfaces/IReviewService';
import { TYPES } from '../types/inversify.types';
import { CodeReviewRequest } from '../models/request/CodeReviewRequest';
import { AuthRequest } from '../middleware/auth.middleware';
import { Language, Severity } from '../entities/Review.entity';
import { logger } from '../utils/logger.util';

const reviewService = container.get<IReviewService>(TYPES.IReviewService);

export async function createReview(req: AuthRequest, res: Response): Promise<void> {
  logger.info('Inside ReviewController: createReview');
  
  const request: CodeReviewRequest = req.body;
  const username = req.username!;
  
  const response = await reviewService.createReview(request, username);
  
  logger.info(`ReviewController: Review created successfully for user - ${username}`);
  res.status(201).json(response);
}

export async function getMyReviews(req: AuthRequest, res: Response): Promise<void> {
  logger.info('Inside ReviewController: getMyReviews');
  
  const username = req.username!;
  const reviews = await reviewService.getUserReviews(username);
  
  logger.info(`ReviewController: Retrieved ${reviews.length} reviews for user - ${username}`);
  res.status(200).json(reviews);
}

export async function getReviewsPaginated(req: AuthRequest, res: Response): Promise<void> {
  logger.info('Inside ReviewController: getReviewsPaginated');
  
  const username = req.username!;
  const page = parseInt(req.query.page as string) || 0; // ✅ Spring uses 0-based indexing
  const limit = parseInt(req.query.size as string) || 10; // ✅ Spring uses 'size' not 'limit'
  const language = req.query.language as Language | undefined;
  const severity = req.query.severity as Severity | undefined;
  
  const response = await reviewService.getUserReviewsPaginated(
    username,
    language,
    severity,
    page + 1,
    limit
  );
  
  const pageResponse = {
    content: response.reviews,
    pageable: {
      pageNumber: page,
      pageSize: limit,
      offset: page * limit,
      paged: true,
      unpaged: false
    },
    totalPages: response.totalPages,
    totalElements: response.total,
    last: page >= response.totalPages - 1,
    first: page === 0,
    size: limit,
    number: page,
    numberOfElements: response.reviews.length,
    empty: response.reviews.length === 0
  };
  
  logger.info(`ReviewController: Retrieved paginated reviews - Page ${page}, Total: ${response.total}`);
  res.status(200).json(pageResponse);
}


export async function getUserStats(req: AuthRequest, res: Response): Promise<void> {
  logger.info('Inside ReviewController: getUserStats');
  
  const username = req.username!;
  const stats = await reviewService.getUserStats(username);
  
  logger.info(`ReviewController: Retrieved stats for user - ${username}`);
  res.status(200).json(stats);
}

export async function getReviewById(req: AuthRequest, res: Response): Promise<void> {
  logger.info('Inside ReviewController: getReviewById');
  
  const reviewId = parseInt(req.params.id as string);
  const username = req.username!;
  
  const response = await reviewService.getReviewById(reviewId, username);
  
  logger.info(`ReviewController: Retrieved review ${reviewId} for user - ${username}`);
  res.status(200).json(response);
}

export async function deleteReview(req: AuthRequest, res: Response): Promise<void> {
  logger.info('Inside ReviewController: deleteReview');
  
  const reviewId = parseInt(req.params.id as string);
  const username = req.username!;
  
  await reviewService.deleteReview(reviewId, username);
  
  logger.info(`ReviewController: Deleted review ${reviewId} for user - ${username}`);
  res.status(200).json({
    success: true,
    message: 'Review deleted successfully'
  });
}
