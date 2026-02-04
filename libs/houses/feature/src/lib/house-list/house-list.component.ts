import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { HouseDetailModel, HouseFilterModel, GroupedHouseModel } from '@oivan/houses/domain';
import { HouseTableComponent, HouseFilterComponent } from '@oivan/houses/ui';
import { HouseFacade } from '@oivan/houses/data-access';
import { AuthFacade } from '@oivan/auth/data-access';
import { LoadingSpinnerComponent, ErrorMessageComponent } from '@oivan/shared/ui';

@Component({
  selector: 'lib-houses-house-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatExpansionModule,
    HouseTableComponent,
    HouseFilterComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent
  ],
  templateUrl: './house-list.component.html',
  styleUrl: './house-list.component.scss'
})
export class HouseListComponent implements OnInit {
  private router = inject(Router);
  private houseFacade = inject(HouseFacade);
  private authFacade = inject(AuthFacade);

  houses = signal<HouseDetailModel[]>([]);
  groupedHouses = this.houseFacade.nonEmptyGroupedHousesSignal;
  loading = this.houseFacade.isLoadingSignal;
  error = this.houseFacade.errorSignal
  currentFilter = signal<HouseFilterModel | undefined>(undefined);
  availableBlocks = signal<string[]>([]);
  availableLands = signal<string[]>([]);
  isAuthenticated = this.authFacade.isAuthenticatedSignal

  housesCount = this.houseFacade.totalCountSignal;

  ngOnInit() {
    this.houseFacade.houses$.subscribe(houses => {
      this.houses.set(houses);
      this.updateAvailableOptions();
    });

    this.houseFacade.currentFilter$.subscribe(filter => {
      this.currentFilter.set(filter ?? undefined);
    });

    this.loadHouses();
  }

  private updateAvailableOptions() {
    this.houseFacade.availableBlocks$.subscribe(blocks => {
      this.availableBlocks.set(blocks);
    });
    this.houseFacade.availableLands$.subscribe(lands => {
      this.availableLands.set(lands);
    });
  }

  loadHouses() {
    this.houseFacade.loadHouses(undefined, this.currentFilter() || undefined);
  }

  onFilterChange(filter: HouseFilterModel) {
    this.houseFacade.loadHouses(undefined, filter);
  }

  onFilterClear() {
    this.houseFacade.setFilter(null);
    this.houseFacade.loadHouses();
  }

  onViewDetails(house: HouseDetailModel) {
    if (this.isAuthenticated()) {
      this.router.navigate(['/houses', house.id]);
    } else {
      console.log('View details for:', house.getFullHouseNumber());
    }
  }

  onEditHouse(house: HouseDetailModel) {
    if (this.isAuthenticated()) {
      this.router.navigate(['/houses', house.id, 'edit']);
    }
  }

  createHouse() {
    if (this.isAuthenticated()) {
      this.router.navigate(['/houses/create']);
    }
  }
}
