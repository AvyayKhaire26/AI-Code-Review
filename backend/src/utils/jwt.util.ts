import jwt from 'jsonwebtoken';

export class JWTUtil {
  private static readonly SECRET: string = process.env.JWT_SECRET || 'your-secret-key';

  static generateToken(username: string, userId: number): string {
    if(!this.SECRET) {
        throw new Error("JwT secret is not set");
    }
    const payload = {
        username,
        userId
    }  
    const token = jwt.sign(payload, this.SECRET, {
        expiresIn: '24h',
        algorithm: 'HS256'
    });
    return token;
  }


  static verifyToken(token: string): { username: string; userId: number } {
    return jwt.verify(token, this.SECRET) as { username: string; userId: number };
  }
}
