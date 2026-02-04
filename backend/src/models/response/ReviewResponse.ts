import { Language, Severity } from '../../entities/Review.entity';

export interface ReviewResponse {
  id: number;
  codeSnippet: string;
  language: Language;
  customPrompt?: string | null;
  aiResponse: string;
  reviewSummary?: string | null;
  severity?: Severity | null;
  bugsFound: number;
  suggestionsCount: number;
  processingTimeMs?: number | null;
  createdAt: Date;
  userRating?: number | null;
}
