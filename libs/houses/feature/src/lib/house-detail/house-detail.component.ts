import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { HouseModel, HouseStatus } from '../../../../domain/src';
import { LoadingSpinnerComponent, ErrorMessageComponent } from '../../../../../shared/ui/src';
import { HouseFacade } from '../house.facade';

@Component({
  selector: 'lib-houses-house-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    LoadingSpinnerComponent,
    ErrorMessageComponent
  ],
  templateUrl: './house-detail.component.html',
  styleUrl: './house-detail.component.scss'
})
export class HouseDetailComponent implements OnInit {
  house: HouseModel | null = null;
  loading = false;
  error: string | null = null;
  houseStatus = HouseStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private houseFacade: HouseFacade
  ) {}

  ngOnInit() {
    // Subscribe to facade observables
    this.houseFacade.selectedHouse$.subscribe(house => {
      this.house = house;
    });

    this.houseFacade.loading$.subscribe(loading => {
      this.loading = loading;
    });

    this.houseFacade.error$.subscribe(error => {
      this.error = error;
    });

    // Load house based on route parameter
    this.route.params.subscribe(params => {
      const houseId = params['id'];
      if (houseId) {
        this.loadHouse(houseId);
      }
    });
  }

  loadHouse(houseId?: string) {
    const id = houseId || this.route.snapshot.params['id'];
    if (id) {
      this.houseFacade.loadHouseById(id).subscribe({
        next: (house) => {
          // House is automatically set via facade subscription
        },
        error: (error) => {
          console.error('Failed to load house:', error);
        }
      });
    }
  }

  editHouse() {
    if (this.house) {
      this.router.navigate(['/houses', this.house.id, 'edit']);
    }
  }

  goBack() {
    this.router.navigate(['/houses']);
  }

  getMediaFileName(url: string): string {
    return url.split('/').pop() || url;
  }
}