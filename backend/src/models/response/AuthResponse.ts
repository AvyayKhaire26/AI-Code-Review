export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  username: string;
  email: string;
  message?: string;
}
