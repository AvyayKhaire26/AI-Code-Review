import { injectable, inject } from 'inversify';
import { IUserService } from '../interfaces/IUserService';
import { UserRepository } from '../repositories/User.repository';
import { LoginRequest } from '../models/request/LoginRequest';
import { RegisterRequest } from '../models/request/RegisterRequest';
import { AuthResponse } from '../models/response/AuthResponse';
import { User, Role } from '../entities/User.entity';
import { PasswordUtil } from '../utils/password.util';
import { JWTUtil } from '../utils/jwt.util';
import { TYPES } from '../types/inversify.types';
import { 
  UserAlreadyExistsException, 
  InvalidCredentialsException 
} from '../exceptions/CustomErrors';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository
  ) {}

  async registerUser(request: RegisterRequest): Promise<AuthResponse> {
    // Check if username already exists
    if (await this.userRepository.existsByUsername(request.username)) {
      throw new UserAlreadyExistsException(`Username already exists: ${request.username}`);
    }

    // Check if email already exists
    if (await this.userRepository.existsByEmail(request.email)) {
      throw new UserAlreadyExistsException(`Email already exists: ${request.email}`);
    }

    // Create new user
    const user = new User();
    user.username = request.username;
    user.email = request.email;
    user.password = await PasswordUtil.hash(request.password); // Hash password
    user.fullName = request.fullName;
    user.role = Role.USER;
    user.enabled = true;

    // Save user
    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const token = JWTUtil.generateToken(savedUser.username, savedUser.id);

    // Return response
    return {
      token,
      type: 'Bearer',
      userId: savedUser.id,
      username: savedUser.username,
      email: savedUser.email,
      message: 'User registered successfully'
    };
  }

  async loginUser(request: LoginRequest): Promise<AuthResponse> {
    // Find user by username
    const user = await this.userRepository.findByUsername(request.username);
    if (!user) {
      throw new InvalidCredentialsException('Invalid username or password');
    }

    // Verify password
    const isPasswordValid = await PasswordUtil.compare(request.password, user.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsException('Invalid username or password');
    }

    // Check if user is enabled
    if (!user.enabled) {
      throw new InvalidCredentialsException('Account is disabled');
    }

    // Generate JWT token
    const token = JWTUtil.generateToken(user.username, user.id);

    // Return response
    return {
      token,
      type: 'Bearer',
      userId: user.id,
      username: user.username,
      email: user.email,
      message: 'Login successful'
    };
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findByUsername(username);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async existsByUsername(username: string): Promise<boolean> {
    return await this.userRepository.existsByUsername(username);
  }

  async existsByEmail(email: string): Promise<boolean> {
    return await this.userRepository.existsByEmail(email);
  }
}
