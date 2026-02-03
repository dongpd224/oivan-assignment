import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthUserModel } from '@oivan/auth/domain';

@Component({
  selector: 'lib-auth-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  user = input<AuthUserModel | null>(null);
  compact = input<boolean>(false);
  
  editProfile = output<void>();
  logout = output<void>();

  onEditProfile(): void {
    this.editProfile.emit();
  }

  onLogout(): void {
    this.logout.emit();
  }
}