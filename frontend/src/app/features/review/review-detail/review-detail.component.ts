import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReviewService } from '../../../core/services/review.service';
import { ReviewResponse, Language, Severity } from '../../../core/models/review.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SeverityBadgeComponent } from '../../../shared/components/severity-badge/severity-badge.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-review-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    SeverityBadgeComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './review-detail.component.html',
  styleUrls: ['./review-detail.component.scss']
})
export class ReviewDetailComponent implements OnInit {
  review: ReviewResponse | null = null;
  isLoading = true;
  errorMessage = '';
  isDeleting = false;
  showDeleteConfirm = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    const reviewId = this.route.snapshot.paramMap.get('id');
    if (reviewId) {
      this.loadReview(+reviewId);
    } else {
      this.errorMessage = 'Invalid review ID';
      this.isLoading = false;
    }
  }

  loadReview(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.reviewService.getReviewById(id).subscribe({
      next: (review) => {
        this.review = review;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading review:', error);
        this.errorMessage = error.error?.message || 'Failed to load review';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  confirmDelete(): void {
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  deleteReview(): void {
    if (!this.review) return;

    this.isDeleting = true;
    this.reviewService.deleteReview(this.review.id).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error deleting review:', error);
        this.errorMessage = 'Failed to delete review';
        this.isDeleting = false;
        this.showDeleteConfirm = false;
      }
    });
  }

  getTimeSince(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  copyCode(): void {
    if (this.review?.codeSnippet) {
      navigator.clipboard.writeText(this.review.codeSnippet).then(() => {
        alert('Code copied to clipboard!');
      });
    }
  }

  getSeverityColor(severity: Severity): string {
    switch (severity) {
      case Severity.CRITICAL:
        return '#dc2626';
      case Severity.HIGH:
        return '#ea580c';
      case Severity.MEDIUM:
        return '#ca8a04';
      case Severity.LOW:
        return '#16a34a';
      default:
        return '#6b7280';
    }
  }
}
