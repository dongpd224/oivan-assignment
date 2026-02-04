import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HouseDetailModel, HouseFilterModel, HouseModelModel } from '@oivan/houses/domain';
import { PaginationRequestModel } from '@oivan/shared/domain';
import * as HouseActions from './house.actions';
import * as HouseSelectors from './house.selectors';

@Injectable({
  providedIn: 'root'
})
export class HouseFacade {
  private store = inject(Store);

  // Selectors
  houses$ = this.store.select(HouseSelectors.selectHouses);
  totalCountSignal = this.store.selectSignal(HouseSelectors.selectTotalCount);
  selectedHouse$ = this.store.select(HouseSelectors.selectSelectedHouse);
  selectedHouseSignal = this.store.selectSignal(HouseSelectors.selectSelectedHouse);
  currentFilter$ = this.store.select(HouseSelectors.selectCurrentFilter);
  currentPagination$ = this.store.select(HouseSelectors.selectCurrentPagination);
  totalCount$ = this.store.select(HouseSelectors.selectTotalCount);
  totalPages$ = this.store.select(HouseSelectors.selectTotalPages);
  isLoading$ = this.store.select(HouseSelectors.selectIsLoading);
  isLoadingSignal = this.store.selectSignal(HouseSelectors.selectIsLoading);
  error$ = this.store.select(HouseSelectors.selectError);
  errorSignal = this.store.selectSignal(HouseSelectors.selectError);
  
  // Computed selectors
  filteredHouses$ = this.store.select(HouseSelectors.selectFilteredHouses);
  availableHouses$ = this.store.select(HouseSelectors.selectAvailableHouses);
  availableBlocks$ = this.store.select(HouseSelectors.selectAvailableBlocks);
  availableLands$ = this.store.select(HouseSelectors.selectAvailableLands);

  // Grouped Houses selectors
  groupedHouses$ = this.store.select(HouseSelectors.selectGroupedHouses);
  groupedHousesSignal = this.store.selectSignal(HouseSelectors.selectGroupedHouses);
  nonEmptyGroupedHouses$ = this.store.select(HouseSelectors.selectNonEmptyGroupedHouses);
  nonEmptyGroupedHousesSignal = this.store.selectSignal(HouseSelectors.selectNonEmptyGroupedHouses);

  // Actions
  loadHouses(pagination?: PaginationRequestModel, filter?: HouseFilterModel): void {
    this.store.dispatch(HouseActions.loadHouses({ pagination, filter }));
  }

  loadHouseById(id: string): void {
    this.store.dispatch(HouseActions.loadHouseById({ id }));
  }

  createHouse(house: HouseDetailModel): void {
    this.store.dispatch(HouseActions.createHouse({ house }));
  }

  updateHouse(id: string, house: HouseDetailModel): void {
    this.store.dispatch(HouseActions.updateHouse({ id, house }));
  }

  deleteHouse(id: string): void {
    this.store.dispatch(HouseActions.deleteHouse({ id }));
  }

  setFilter(filter: HouseFilterModel | null): void {
    this.store.dispatch(HouseActions.setFilter({ filter }));
  }

  setPagination(pagination: PaginationRequestModel | null): void {
    this.store.dispatch(HouseActions.setPagination({ pagination }));
  }

  setSelectedHouse(house: HouseDetailModel | null): void {
    this.store.dispatch(HouseActions.setSelectedHouse({ house }));
  }

  clearError(): void {
    this.store.dispatch(HouseActions.clearError());
  }

  clearCache(): void {
    this.store.dispatch(HouseActions.clearCache());
  }

  // HouseModel Selectors
  houseModels$ = this.store.select(HouseSelectors.selectHouseModels);
  selectedHouseModel$ = this.store.select(HouseSelectors.selectSelectedHouseModel);
  isLoadingHouseModels$ = this.store.select(HouseSelectors.selectIsLoadingHouseModels);
  isLoadingHouseModelsSignal = this.store.selectSignal(HouseSelectors.selectIsLoadingHouseModels);
  houseModelError$ = this.store.select(HouseSelectors.selectHouseModelError);
  houseModelErrorSignal = this.store.selectSignal(HouseSelectors.selectHouseModelError);

  // HouseModel Actions
  loadHouseModels(): void {
    this.store.dispatch(HouseActions.loadHouseModels());
  }

  loadHouseModelById(id: string): void {
    this.store.dispatch(HouseActions.loadHouseModelById({ id }));
  }

  setSelectedHouseModel(houseModel: HouseModelModel | null): void {
    this.store.dispatch(HouseActions.setSelectedHouseModel({ houseModel }));
  }

  clearHouseModelCache(): void {
    this.store.dispatch(HouseActions.clearHouseModelCache());
  }

  getHouseModelsByType(houseType: string) {
    return this.store.select(HouseSelectors.selectHouseModelsByType(houseType));
  }
}