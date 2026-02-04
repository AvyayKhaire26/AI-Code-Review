import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss'
})
export class LoadingSpinnerComponent {
  @Input() message: string = 'Loading...';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  get spinnerSize(): string {
    switch (this.size) {
      case 'small': return 'w-6 h-6';
      case 'medium': return 'w-12 h-12';
      case 'large': return 'w-16 h-16';
      default: return 'w-12 h-12';
    }
  }
}
