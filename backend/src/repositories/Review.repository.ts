import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database.config';
import { Review, Language, Severity } from '../entities/Review.entity';

interface PaginationOptions {
  page: number;
  limit: number;
}

interface ReviewFilters {
  userId: number;
  language?: Language;
  severity?: Severity;
}

@injectable()
export class ReviewRepository {
  private repository: Repository<Review>;

  constructor() {
    this.repository = AppDataSource.getRepository(Review);
  }

  async findById(id: number): Promise<Review | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByUserIdOrderByCreatedAtDesc(userId: number): Promise<Review[]> {
    return await this.repository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' }
    });
  }

  async findByLanguage(language: Language): Promise<Review[]> {
    return await this.repository.find({ where: { language } });
  }

  async countByUserId(userId: number): Promise<number> {
    return await this.repository.count({ where: { user: { id: userId } } });
  }

  async findByUserIdWithFilters(
    filters: ReviewFilters,
    pagination: PaginationOptions
  ): Promise<{ reviews: Review[]; total: number }> {
    const queryBuilder = this.repository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where('user.id = :userId', { userId: filters.userId });

    if (filters.language) {
      queryBuilder.andWhere('review.language = :language', { language: filters.language });
    }

    if (filters.severity) {
      queryBuilder.andWhere('review.severity = :severity', { severity: filters.severity });
    }

    queryBuilder.orderBy('review.createdAt', 'DESC');

    const total = await queryBuilder.getCount();
    
    const reviews = await queryBuilder
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit)
      .getMany();

    return { reviews, total };
  }

  async save(review: Review): Promise<Review> {
    return await this.repository.save(review);
  }

  async findAll(): Promise<Review[]> {
    return await this.repository.find();
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
