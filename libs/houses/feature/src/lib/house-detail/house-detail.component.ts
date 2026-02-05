import { Component, DestroyRef, inject, OnInit, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { HouseDetailModel, HouseModelModel, HouseStatus } from '@oivan/houses/domain';
import { LoadingSpinnerComponent, ErrorMessageComponent } from '@oivan/shared/ui';
import { HouseFormComponent } from '@oivan/houses/ui';
import { HouseFacade } from '@oivan/houses/data-access';
import { combineLatest } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

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
    ErrorMessageComponent,
    HouseFormComponent
  ],
  templateUrl: './house-detail.component.html',
  styleUrl: './house-detail.component.scss'
})
export class HouseDetailComponent implements OnInit {
  private houseFacade = inject(HouseFacade);
  private destroyRef = inject(DestroyRef)

  house: Signal<HouseDetailModel | null> = this.houseFacade.selectedHouseSignal;
  houseModels: Signal<HouseModelModel[] | null> = this.houseFacade.houseModelsSignal;
  houses: Signal<HouseDetailModel[]> = this.houseFacade.housesSignal;
  loading = this.houseFacade.isLoadingSignal;
  error = this.houseFacade.errorSignal
  houseStatus = HouseStatus;
  
  // Mode flags
  isCreateMode = false;
  isEditMode = false;
  isSubmitting = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    // Load house models for the form dropdown
    this.houseFacade.loadHouseModels();

    // Determine mode based on route
    this.route.url.subscribe(segments => {
      const path = segments.map(s => s.path).join('/');
      this.isCreateMode = path === 'create';
      this.isEditMode = path.endsWith('edit');
    });

    // Load house based on route parameter
    this.route.params.subscribe(params => {
      const houseId = params['id'];
      if (houseId) {
        this.loadHouse(houseId);
      }
    });
  }

  get isFormMode(): boolean {
    return this.isCreateMode || this.isEditMode;
  }

  get pageTitle(): string {
    if (this.isCreateMode) return 'Create New House';
    if (this.isEditMode) return 'Edit House';
    return 'House Details';
  }

  loadHouse(houseId?: string) {
    const id = houseId || this.route.snapshot.params['id'];
    if (id) {
      // We don't have api get by id 
      // this.houseFacade.loadHouseById(id);
    }
  }

  editHouse() {
    if (this.house()) {
      this.router.navigate(['/houses', this.house()?.id, 'edit']);
    }
  }

  goBack() {
    this.houseFacade.clearSelectedHouse();
    this.router.navigate(['/houses']);
  }

  getMediaFileName(url: string): string {
    return url.split('/').pop() || url;
  }

  openImage(url: string) {
    window.open(url, '_blank');
  }

  onFormSubmit(house: HouseDetailModel) {
    this.isSubmitting.set(true);
    const houseId = this.house()?.id;
    if (this.isEditMode && houseId) {
      this.houseFacade.updateHouse(houseId, house);
      // Subscribe to selectedHouse$ to navigate after update
      combineLatest([this.houseFacade.selectedHouse$, this.houseFacade.isLoading$]).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(updated => {
        if (updated[0] && !updated[1]) {
          this.isSubmitting.set(false);
        }
      });
    } else {
      this.houseFacade.createHouse(house);
      // Subscribe to selectedHouse$ to navigate after creation
      combineLatest([this.houseFacade.totalCount$, this.houseFacade.isLoading$]).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
        if (res[0] && !res[1]) {
          this.isSubmitting.set(false);
          this.router.navigate(['/houses']);
        }
      });
    }
  }

  onFormCancel() {
    const houseId = this.house()?.id;
    if (this.isEditMode && houseId) {
      this.router.navigate(['/houses', houseId]);
    } else {
      this.router.navigate(['/houses']);
    }
  }
}