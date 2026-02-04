export interface Review {
  id: number;
  codeSnippet: string;
  language: Language;
  customPrompt: string | null;
  aiResponse: string;
  reviewSummary: string;
  severity: Severity;
  bugsFound: number;
  suggestionsCount: number;
  processingTimeMs: number;
  createdAt: Date;
  userRating: number | null;
}

export interface CodeReviewRequest {
  codeSnippet: string;
  language: Language;
  customPrompt?: string;
}

export interface ReviewResponse {
  id: number;
  codeSnippet: string;
  language: Language;
  customPrompt: string | null;
  aiResponse: string;
  reviewSummary: string;
  severity: Severity;
  bugsFound: number;
  suggestionsCount: number;
  processingTimeMs: number;
  createdAt: string;
  userRating: number | null;
}

export enum Language {
  PYTHON = 'PYTHON',
  JAVA = 'JAVA',
  JAVASCRIPT = 'JAVASCRIPT',
  TYPESCRIPT = 'TYPESCRIPT',
  CPP = 'CPP',
  C = 'C',
  GO = 'GO',
  RUBY = 'RUBY',
  SQL = 'SQL',
  OTHER = 'OTHER'
}

export enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}
