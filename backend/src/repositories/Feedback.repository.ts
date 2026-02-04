import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database.config';
import { Feedback } from '../entities/Feedback.entity';

@injectable()
export class FeedbackRepository {
  private repository: Repository<Feedback>;

  constructor() {
    this.repository = AppDataSource.getRepository(Feedback);
  }

  async findById(id: number): Promise<Feedback | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByReviewId(reviewId: number): Promise<Feedback[]> {
    return await this.repository.find({
      where: { review: { id: reviewId } }
    });
  }

  async findByUserId(userId: number): Promise<Feedback[]> {
    return await this.repository.find({
      where: { user: { id: userId } }
    });
  }

  async countByReviewId(reviewId: number): Promise<number> {
    return await this.repository.count({
      where: { review: { id: reviewId } }
    });
  }

  async save(feedback: Feedback): Promise<Feedback> {
    return await this.repository.save(feedback);
  }

  async findAll(): Promise<Feedback[]> {
    return await this.repository.find();
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
