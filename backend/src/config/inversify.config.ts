import { Container } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../types/inversify.types';

// Repositories
import { UserRepository } from '../repositories/User.repository';
import { ReviewRepository } from '../repositories/Review.repository';
import { FeedbackRepository } from '../repositories/Feedback.repository';

// Services
import { UserService } from '../services/UserService';
import { ReviewService } from '../services/ReviewService';
import { GeminiService } from '../services/GeminiService';

// Interfaces
import { IUserService } from '../interfaces/IUserService';
import { IReviewService } from '../interfaces/IReviewService';
import { IGeminiService } from '../interfaces/IGeminiService';

const container = new Container();

// Bind Repositories
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
container.bind<ReviewRepository>(TYPES.ReviewRepository).to(ReviewRepository).inSingletonScope();
container.bind<FeedbackRepository>(TYPES.FeedbackRepository).to(FeedbackRepository).inSingletonScope();

// Bind Services
container.bind<IUserService>(TYPES.IUserService).to(UserService).inSingletonScope();
container.bind<IReviewService>(TYPES.IReviewService).to(ReviewService).inSingletonScope();
container.bind<IGeminiService>(TYPES.IGeminiService).to(GeminiService).inSingletonScope();

export { container };
