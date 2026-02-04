import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReviewService } from '../../core/services/review.service';
import { AuthService } from '../../core/services/auth.service';
import { UserStats } from '../../core/models/stats.model';
import { ReviewResponse } from '../../core/models/review.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SeverityBadgeComponent } from '../../shared/components/severity-badge/severity-badge.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    NavbarComponent, 
    SeverityBadgeComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats: UserStats | null = null;
  recentReviews: ReviewResponse[] = [];
  isLoading = true;
  errorMessage = '';
  currentUser: any = null;

  constructor(
    private reviewService: ReviewService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    // Load user statistics
    this.reviewService.getUserStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.errorMessage = 'Failed to load statistics';
        this.isLoading = false;
      }
    });

    // Load recent reviews
    this.reviewService.getReviewsPaginated(0, 5).subscribe({
      next: (page) => {
        this.recentReviews = page.content;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.errorMessage = 'Failed to load recent reviews';
        this.isLoading = false;
      }
    });
  }

  navigateToNewReview(): void {
    this.router.navigate(['/review/new']);
  }

  navigateToReview(id: number): void {
    this.router.navigate(['/review', id]);
  }

  getTimeSince(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  }

  viewReview(reviewId: number): void {
    this.router.navigate(['/review', reviewId]);
  }
}
