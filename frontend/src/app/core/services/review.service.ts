import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CodeReviewRequest, ReviewResponse, Language, Severity } from '../models/review.model';
import { Page } from '../models/pagination.model';
import { UserStats } from '../models/stats.model';
import { ApiResponse } from '../models/api-response.model';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(
    private http: HttpClient,
    private env: EnvironmentService
  ) {}

  createReview(request: CodeReviewRequest): Observable<ReviewResponse> {
    return this.http.post<ReviewResponse>(`${this.env.apiUrl}/reviews`, request);
  }

  getReviewById(id: number): Observable<ReviewResponse> {
    return this.http.get<ReviewResponse>(`${this.env.apiUrl}/reviews/${id}`);
  }

  getMyReviews(): Observable<ReviewResponse[]> {
    return this.http.get<ReviewResponse[]>(`${this.env.apiUrl}/reviews/my-reviews`);
  }

  getReviewsPaginated(
    page: number = 0,
    size: number = 10,
    language?: Language,
    severity?: Severity
  ): Observable<Page<ReviewResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (language) {
      params = params.set('language', language);
    }

    if (severity) {
      params = params.set('severity', severity);
    }

    return this.http.get<Page<ReviewResponse>>(`${this.env.apiUrl}/reviews`, { params });
  }

  searchReviews(searchTerm: string, page: number = 0, size: number = 10): Observable<Page<ReviewResponse>> {
    const params = new HttpParams()
      .set('q', searchTerm)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<ReviewResponse>>(`${this.env.apiUrl}/reviews/search`, { params });
  }

  getUserStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.env.apiUrl}/reviews/stats`);
  }

  deleteReview(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.env.apiUrl}/reviews/${id}`);
  }
}
