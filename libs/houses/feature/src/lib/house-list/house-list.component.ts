import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HouseModel, HouseFilterModel } from '../../../../domain/src';
import { HouseCardComponent, HouseTableComponent, HouseFilterComponent } from '../../../../ui/src';
import { HouseFacade } from '../house.facade';
import { AuthFacade } from '../../../../../auth/feature/src';

@Component({
  selector: 'lib-houses-house-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    HouseCardComponent,
    HouseTableComponent,
    HouseFilterComponent
  ],
  templateUrl: './house-list.component.html',
  styleUrl: './house-list.component.scss'
})
export class HouseListComponent implements OnInit {
  houses: HouseModel[] = [];
  loading = false;
  error: string | null = null;
  currentFilter: HouseFilterModel | null = null;
  availableBlocks: string[] = [];
  availableLands: string[] = [];
  isAuthenticated = false;

  constructor(
    private router: Router,
    private houseFacade: HouseFacade,
    private authFacade: AuthFacade
  ) {}

  ngOnInit() {
    // Subscribe to authentication status
    this.authFacade.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });

    // Subscribe to houses data
    this.houseFacade.houses$.subscribe(houses => {
      this.houses = houses;
      this.updateAvailableOptions();
    });

    // Subscribe to loading state
    this.houseFacade.loading$.subscribe(loading => {
      this.loading = loading;
    });

    // Subscribe to error state
    this.houseFacade.error$.subscribe(error => {
      this.error = error;
    });

    // Subscribe to current filter
    this.houseFacade.currentFilter$.subscribe(filter => {
      this.currentFilter = filter;
    });

    // Initial load
    this.loadHouses();
  }

  private updateAvailableOptions() {
    this.availableBlocks = this.houseFacade.getAvailableBlocks();
    this.availableLands = this.houseFacade.getAvailableLands();
  }

  loadHouses() {
    this.houseFacade.loadHouses(this.currentFilter || undefined);
  }

  onFilterChange(filter: HouseFilterModel) {
    this.houseFacade.loadHouses(filter);
  }

  onFilterClear() {
    this.houseFacade.clearFilter();
  }

  onViewDetails(house: HouseModel) {
    if (this.isAuthenticated) {
      this.router.navigate(['/houses', house.id]);
    } else {
      // For non-authenticated users, show basic info or redirect to login
      console.log('View details for:', house.getFullHouseNumber());
      // Could show a modal with basic info or redirect to login
    }
  }

  onEditHouse(house: HouseModel) {
    if (this.isAuthenticated) {
      this.router.navigate(['/houses', house.id, 'edit']);
    }
  }

  createHouse() {
    if (this.isAuthenticated) {
      this.router.navigate(['/houses/create']);
    }
  }
}