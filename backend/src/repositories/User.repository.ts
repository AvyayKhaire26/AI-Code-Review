import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database.config';
import { User } from '../entities/User.entity';

@injectable()
export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findById(id: number): Promise<User | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.repository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async existsByUsername(username: string): Promise<boolean> {
    return await this.repository.exists({ where: { username } });
  }

  async existsByEmail(email: string): Promise<boolean> {
    return await this.repository.exists({ where: { email } });
  }

  async save(user: User): Promise<User> {
    return await this.repository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
