import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: number;
  username?: string;
}

export class AuthMiddleware {
  static authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'No token provided' });
        return;
      }

      const token = authHeader.substring(7);
      const secret = process.env.JWT_SECRET || 'your-secret-key';

      const decoded = jwt.verify(token, secret) as { userId: number; username: string };
      
      req.userId = decoded.userId;
      req.username = decoded.username;

      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
}
