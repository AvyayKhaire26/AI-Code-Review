import { Language } from '../../entities/Review.entity';

export interface CodeReviewRequest {
  codeSnippet: string;
  language: Language;
  customPrompt?: string;
}
