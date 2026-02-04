import { Request, Response } from 'express';
import { container } from '../config/inversify.config';
import { IUserService } from '../interfaces/IUserService';
import { TYPES } from '../types/inversify.types';
import { LoginRequest } from '../models/request/LoginRequest';
import { RegisterRequest } from '../models/request/RegisterRequest';
import { logger } from '../utils/logger.util';

const userService = container.get<IUserService>(TYPES.IUserService);

export async function register(req: Request, res: Response): Promise<void> {
  logger.info('Inside AuthController: register');
  
  const request: RegisterRequest = req.body;
  const response = await userService.registerUser(request);
  
  logger.info(`AuthController: User registered successfully - ${request.username}`);
  res.status(201).json(response);
}

export async function login(req: Request, res: Response): Promise<void> {
  logger.info('Inside AuthController: login');
  
  const request: LoginRequest = req.body;
  const response = await userService.loginUser(request);
  
  logger.info(`AuthController: User logged in successfully - ${request.username}`);
  res.status(200).json(response);
}

export async function health(req: Request, res: Response): Promise<void> {
  logger.info('Inside AuthController: health');
  
  res.status(200).json({
    success: true,
    message: 'Auth service is running'
  });
  
  logger.info('AuthController: Health check completed');
}
