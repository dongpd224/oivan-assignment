import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lib-shared-error-message',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss'
})
export class ErrorMessageComponent {
  type = input<'error' | 'warning' | 'info'>('error');
  title = input<string>();
  message = input<string>('');
  showRetry = input<boolean>(false);
  retry = output<void>();

  getIcon(): string {
    switch (this.type()) {
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'error';
    }
  }

  onRetry(): void {
    this.retry.emit();
  }
}