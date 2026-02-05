import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lib-header-user-display',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './header-user-display.component.html',
  styleUrl: './header-user-display.component.scss'
})
export class HeaderUserDisplayComponent {
  username = input<string>('Admin');
  logoutClick = output<void>();

  onLogout(): void {
    this.logoutClick.emit();
  }
}
