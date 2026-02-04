import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReviewService } from '../../../core/services/review.service';
import { CodeReviewRequest, ReviewResponse, Language } from '../../../core/models/review.model';

@Component({
  selector: 'app-new-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-review.component.html',
  styleUrls: ['./new-review.component.scss']
})
export class NewReviewComponent implements OnInit {
  codeInput: string = '';
  selectedLanguage: Language = Language.JAVASCRIPT;
  customPrompt: string = '';
  isLoading: boolean = false;
  error: string = '';
  
  // Map language enum to display labels
  supportedLanguages = [
    { value: Language.JAVASCRIPT, label: 'JavaScript' },
    { value: Language.TYPESCRIPT, label: 'TypeScript' },
    { value: Language.PYTHON, label: 'Python' },
    { value: Language.JAVA, label: 'Java' },
    { value: Language.CPP, label: 'C++' },
    { value: Language.C, label: 'C' },
    { value: Language.GO, label: 'Go' },
    { value: Language.RUBY, label: 'Ruby' },
    { value: Language.SQL, label: 'SQL' },
    { value: Language.OTHER, label: 'Other' }
  ];

  constructor(
    private reviewService: ReviewService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSampleCode();
  }

  loadSampleCode(): void {
    const sampleCode = `function calculateSum(numbers) {
  var total = 0;
  for (var i = 0; i <= numbers.length; i++) {
    total = total + numbers[i];
  }
  return total;
}

// Test
console.log(calculateSum([1, 2, 3, 4, 5]));`;
    
    this.codeInput = sampleCode;
  }

  clearCode(): void {
    this.codeInput = '';
    this.customPrompt = '';
  }

  onFileUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.codeInput = e.target.result;
      };
      reader.readAsText(file);
    }
  }

  submitReview(): void {
    if (!this.codeInput.trim()) {
      this.error = 'Please enter some code to review';
      return;
    }

    this.isLoading = true;
    this.error = '';

    const reviewRequest: CodeReviewRequest = {
      codeSnippet: this.codeInput,
      language: this.selectedLanguage,
      customPrompt: this.customPrompt || undefined
    };

    this.reviewService.createReview(reviewRequest).subscribe({
      next: (response: ReviewResponse) => {
        this.isLoading = false;
        // Navigate to review result page
        this.router.navigate(['/review', response.id]);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.error = error.error?.message || 'Failed to submit review. Please try again.';
        console.error('Review submission error:', error);
      }
    });
  }
}
