import { RequestHandler } from 'express';
import { registerValidator, loginValidator } from '../validators/auth.validator';
import { createReviewValidator, reviewIdValidator, paginationValidator } from '../validators/review.validator';
import { register, login, health } from '../controllers/auth.controller';
import { 
  createReview, 
  getMyReviews, 
  getReviewsPaginated, 
  getUserStats, 
  getReviewById, 
  deleteReview 
} from '../controllers/review.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

export interface RouteConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  validators?: any[];
  middlewares?: RequestHandler[];
  controller: any;
}

export const routes: RouteConfig[] = [
  // ========== Auth Routes (Public) ==========
  {
    method: 'POST',
    path: '/auth/register',
    validators: registerValidator,
    controller: register
  },
  {
    method: 'POST',
    path: '/auth/login',
    validators: loginValidator,
    controller: login
  },
  {
    method: 'GET',
    path: '/auth/health',
    controller: health
  },

  // ========== Review Routes (Protected) ==========
  {
    method: 'POST',
    path: '/reviews',
    middlewares: [AuthMiddleware.authenticate],
    validators: createReviewValidator,
    controller: createReview
  },
  {
    method: 'GET',
    path: '/reviews/my-reviews',
    middlewares: [AuthMiddleware.authenticate],
    controller: getMyReviews
  },
  {
    method: 'GET',
    path: '/reviews',
    middlewares: [AuthMiddleware.authenticate],
    validators: paginationValidator,
    controller: getReviewsPaginated
  },
  {
    method: 'GET',
    path: '/reviews/stats',
    middlewares: [AuthMiddleware.authenticate],
    controller: getUserStats
  },
  {
    method: 'GET',
    path: '/reviews/:id',
    middlewares: [AuthMiddleware.authenticate],
    controller: getReviewById
  },
  {
    method: 'DELETE',
    path: '/reviews/:id',
    middlewares: [AuthMiddleware.authenticate],
    controller: deleteReview
  }
];
