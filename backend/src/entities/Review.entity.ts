import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './User.entity';

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

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reviews, { lazy: true, nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'code_snippet', type: 'text', nullable: false })
  codeSnippet: string;

  @Column({ type: 'enum', enum: Language, nullable: false })
  language: Language;

  @Column({ name: 'custom_prompt', type: 'text', nullable: true })
  customPrompt?: string | null;  // ✅ Fixed

  @Column({ name: 'ai_response', type: 'text', nullable: false })
  aiResponse: string;  // ✅ NOT optional

  @Column({ name: 'review_summary', type: 'text', nullable: true })
  reviewSummary?: string | null;  // ✅ Fixed

  @Column({ type: 'enum', enum: Severity, nullable: true })
  severity?: Severity | null;  // ✅ Fixed

  @Column({ name: 'bugs_found', default: 0 })
  bugsFound: number;

  @Column({ name: 'suggestions_count', default: 0 })
  suggestionsCount: number;

  @Column({ name: 'processing_time_ms', type: 'bigint', nullable: true })
  processingTimeMs?: number | null;
  
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'user_rating', type: 'int', nullable: true })
  userRating?: number | null;
}
