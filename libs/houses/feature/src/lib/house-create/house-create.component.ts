import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HouseFormComponent } from '../../../../ui/src';
import { HouseModel } from '../../../../domain/src';
import { HouseFacade } from '../house.facade';
import { LoadingSpinnerComponent, ErrorMessageComponent } from '../../../../../shared/ui/src';

@Component({
  selector: 'lib-houses-house-create',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    HouseFormComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent
  ],
  templateUrl: './house-create.component.html',
  styleUrl: './house-create.component.scss'
})
export class HouseCreateComponent implements OnInit {
  isSubmitting = false;
  isEditMode = false;
  houseId: string | null = null;
  existingHouse: HouseModel | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private houseFacade: HouseFacade
  ) {}

  ngOnInit() {
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      this.houseId = params['id'];
      this.isEditMode = !!this.houseId;
      
      if (this.isEditMode && this.houseId) {
        this.loadHouseForEdit(this.houseId);
      }
    });

    // Subscribe to facade observables
    this.houseFacade.loading$.subscribe(loading => {
      this.loading = loading;
    });

    this.houseFacade.error$.subscribe(error => {
      this.error = error;
    });

    this.houseFacade.selectedHouse$.subscribe(house => {
      if (this.isEditMode) {
        this.existingHouse = house;
      }
    });
  }

  loadHouseForEdit(houseId: string) {
    this.houseFacade.loadHouseById(houseId).subscribe({
      next: (house) => {
        // House is automatically set via facade subscription
      },
      error: (error) => {
        console.error('Failed to load house for editing:', error);
      }
    });
  }

  goBack() {
    if (this.isEditMode && this.houseId) {
      this.router.navigate(['/houses', this.houseId]);
    } else {
      this.router.navigate(['/houses']);
    }
  }

  async onCreateHouse(house: HouseModel) {
    this.isSubmitting = true;
    
    try {
      if (this.isEditMode && this.houseId) {
        // Update existing house
        await this.houseFacade.updateHouse(this.houseId, house).toPromise();
        this.router.navigate(['/houses', this.houseId]);
      } else {
        // Create new house
        const createdHouse = await this.houseFacade.createHouse(house).toPromise();
        this.router.navigate(['/houses', createdHouse?.id]);
      }
    } catch (error) {
      console.error('Failed to save house:', error);
      // Error is handled by facade and displayed via error message component
    } finally {
      this.isSubmitting = false;
    }
  }
}