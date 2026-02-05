import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { HouseDetailModel, HouseFilterModel } from '@oivan/houses/domain';
import { HouseTableComponent, HouseFilterComponent, YoutubeEmbedComponent } from '@oivan/houses/ui';
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
    YoutubeEmbedComponent,
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

  houses = this.houseFacade.housesSignal
  groupedHouses = this.houseFacade.nonEmptyFilteredGroupedHousesSignal;
  loading = this.houseFacade.isLoadingSignal;
  error = this.houseFacade.errorSignal
  currentFilter = this.houseFacade.currentFilterSignal;
  availableBlocks = this.houseFacade.availableBlocksSignal
  availableLands = this.houseFacade.availableLandsSignal
  isAuthenticated = this.authFacade.isAuthenticatedSignal

  housesCount = this.houseFacade.totalCountSignal;


  ngOnInit() {
    this.loadHouses();
  }


  loadHouses() {
    this.houseFacade.loadHouses(undefined, this.currentFilter() || undefined);
  }

  onFilterChange(filter: HouseFilterModel) {
    this.houseFacade.applyFilter(filter);
  }

  onFilterClear() {
    this.houseFacade.applyFilter(null);
  }

  onViewDetails(house: HouseDetailModel) {
    if (this.isAuthenticated()) {
      this.houseFacade.setSelectedHouse(house);
      this.router.navigate(['/houses', house.id]);
    }
  }

  onEditHouse(house: HouseDetailModel) {
    if (this.isAuthenticated()) {
      this.houseFacade.setSelectedHouse(house);
      this.router.navigate(['/houses', house.id, 'edit']);
    }
  }

  createHouse() {
    if (this.isAuthenticated()) {
      this.router.navigate(['/houses/create']);
    }
  }
}
