import { CorsOptions } from 'cors';

export const corsConfig: CorsOptions = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['*'],
  credentials: true,
  maxAge: 3600
};
