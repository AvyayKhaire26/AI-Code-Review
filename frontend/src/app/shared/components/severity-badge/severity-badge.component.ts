import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Severity } from '../../../core/models/review.model';

@Component({
  selector: 'app-severity-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './severity-badge.component.html',
  styleUrl: './severity-badge.component.scss'
})
export class SeverityBadgeComponent {
  @Input() severity!: Severity;

  get badgeClass(): string {
    switch (this.severity) {
      case Severity.CRITICAL:
        return 'bg-red-100 text-red-800 border-red-200';
      case Severity.HIGH:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case Severity.MEDIUM:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case Severity.LOW:
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  get icon(): string {
    switch (this.severity) {
      case Severity.CRITICAL:
        return '🔴';
      case Severity.HIGH:
        return '🟠';
      case Severity.MEDIUM:
        return '🟡';
      case Severity.LOW:
        return '🟢';
      default:
        return '⚪';
    }
  }
}
