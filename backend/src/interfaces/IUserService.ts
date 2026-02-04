import { LoginRequest } from '../models/request/LoginRequest';
import { RegisterRequest } from '../models/request/RegisterRequest';
import { AuthResponse } from '../models/response/AuthResponse';
import { User } from '../entities/User.entity';

export interface IUserService {
  /**
   * Register a new user
   */
  registerUser(request: RegisterRequest): Promise<AuthResponse>;

  /**
   * Authenticate user and generate JWT
   */
  loginUser(request: LoginRequest): Promise<AuthResponse>;

  /**
   * Find user by username
   */
  findByUsername(username: string): Promise<User | null>;

  /**
   * Find user by email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Check if username already exists
   */
  existsByUsername(username: string): Promise<boolean>;

  /**
   * Check if email already exists
   */
  existsByEmail(email: string): Promise<boolean>;
}
