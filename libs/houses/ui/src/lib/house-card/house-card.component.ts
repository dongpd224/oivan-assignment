import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { HouseModel, HouseStatus } from  '../../../../domain/src';

@Component({
  selector: 'lib-houses-house-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './house-card.component.html',
  styleUrl: './house-card.component.scss'
})
export class HouseCardComponent {
  house = input.required<HouseModel>();
  showEditButton = input<boolean>(false);
  
  viewDetails = output<HouseModel>();
  edit = output<HouseModel>();

  houseStatus = HouseStatus;

  onViewDetails() {
    this.viewDetails.emit(this.house());
  }

  onEdit() {
    this.edit.emit(this.house());
  }
}