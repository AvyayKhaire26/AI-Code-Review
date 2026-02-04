import { Language } from '../entities/Review.entity';

export interface IGeminiService {
  /**
   * Analyze code using Gemini AI
   */
  analyzeCode(
    codeSnippet: string,
    language: Language,
    customPrompt?: string
  ): Promise<string>;
}
