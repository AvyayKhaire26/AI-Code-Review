import { injectable } from 'inversify';
import { IGeminiService } from '../interfaces/IGeminiService';
import { Language } from '../entities/Review.entity';
import { GoogleGenerativeAI } from '@google/generative-ai';

@injectable()
export class GeminiService implements IGeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async analyzeCode(
    codeSnippet: string,
    language: Language,
    customPrompt?: string
  ): Promise<string> {
    try {
      // Build the prompt
      const prompt = this.buildPrompt(codeSnippet, language, customPrompt);

      // Call Gemini API
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text;
    } catch (error: any) {
      throw new Error(`Failed to analyze code with Gemini: ${error.message}`);
    }
  }

  private buildPrompt(codeSnippet: string, language: Language, customPrompt?: string): string {
    const languageName = language.toLowerCase();

    if (customPrompt && customPrompt.trim()) {
      // User provided custom prompt
      return `You are an expert code reviewer. Analyze the following ${languageName} code and answer this question: ${customPrompt}\n\nCode:\n${codeSnippet}`;
    } else {
      // Default comprehensive review
      return `You are an expert code reviewer. Analyze the following ${languageName} code and provide a comprehensive review.\n\n` +
        `Focus on:\n` +
        `1. BUGS: Logic errors, edge cases, potential crashes\n` +
        `2. SECURITY: Vulnerabilities, injection risks, unsafe operations\n` +
        `3. PERFORMANCE: Inefficiencies, optimization opportunities\n` +
        `4. BEST PRACTICES: Code quality, naming, design patterns\n` +
        `5. IMPROVEMENTS: Suggested refactored code\n\n` +
        `Code:\n${codeSnippet}\n\n` +
        `Provide specific, actionable feedback with code examples where applicable.`;
    }
  }
}
