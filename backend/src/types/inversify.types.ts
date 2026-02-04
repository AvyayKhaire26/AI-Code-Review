export const TYPES = {
  AuthService: Symbol.for('AuthService'),
  UserService: Symbol.for('UserService'),
  CodeReviewService: Symbol.for('CodeReviewService'),

  IUserService: Symbol.for('IUserService'),
  IReviewService: Symbol.for('IReviewService'),
  IGeminiService: Symbol.for('IGeminiService'),
  
  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  ReviewRepository: Symbol.for('ReviewRepository'),
  FeedbackRepository: Symbol.for('FeedbackRepository')
};
