import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HouseState } from './house.reducer';
import { HouseStatus, GroupedHouseModel } from '@oivan/houses/domain';

export const HOUSE_FEATURE_KEY = 'house';

export const selectHouseState = createFeatureSelector<HouseState>(HOUSE_FEATURE_KEY);

export const selectHouses = createSelector(
  selectHouseState,
  (state: HouseState) => state.houses
);

export const selectSelectedHouse = createSelector(
  selectHouseState,
  (state: HouseState) => state.selectedHouse
);

export const selectCurrentFilter = createSelector(
  selectHouseState,
  (state: HouseState) => state.currentFilter
);

export const selectCurrentPagination = createSelector(
  selectHouseState,
  (state: HouseState) => state.currentPagination
);

export const selectTotalCount = createSelector(
  selectHouseState,
  (state: HouseState) => state.totalCount
);

export const selectTotalPages = createSelector(
  selectHouseState,
  (state: HouseState) => state.totalPages
);

export const selectIsLoading = createSelector(
  selectHouseState,
  (state: HouseState) => state.isLoading
);

export const selectError = createSelector(
  selectHouseState,
  (state: HouseState) => state.error
);

// Computed selectors
export const selectFilteredHouses = createSelector(
  selectHouses,
  selectCurrentFilter,
  (houses, filter) => {
    if (!filter) return houses;
    
    return houses.filter(house => {
      if (filter.blockNumber && house.blockNumber !== filter.blockNumber) {
        return false;
      }
      if (filter.landNumber && house.landNumber !== filter.landNumber) {
        return false;
      }
      if (filter.houseType && house.houseType !== filter.houseType) {
        return false;
      }
      if (filter.status && house.status !== filter.status) {
        return false;
      }
      if (filter.priceRange) {
        if (filter.priceRange.min && house.price < filter.priceRange.min) {
          return false;
        }
        if (filter.priceRange.max && house.price > filter.priceRange.max) {
          return false;
        }
      }
      return true;
    });
  }
);

export const selectAvailableHouses = createSelector(
  selectHouses,
  (houses) => houses.filter(house => house.status === HouseStatus.AVAILABLE)
);

export const selectAvailableBlocks = createSelector(
  selectHouses,
  (houses) => [...new Set(houses.map(house => house.blockNumber))].sort()
);

export const selectAvailableLands = createSelector(
  selectHouses,
  (houses) => [...new Set(houses.map(house => house.landNumber))].sort()
);

// HouseModel Selectors
export const selectHouseModels = createSelector(
  selectHouseState,
  (state: HouseState) => state.houseModels
);

export const selectSelectedHouseModel = createSelector(
  selectHouseState,
  (state: HouseState) => state.selectedHouseModel
);

export const selectIsLoadingHouseModels = createSelector(
  selectHouseState,
  (state: HouseState) => state.isLoadingHouseModels
);

export const selectHouseModelError = createSelector(
  selectHouseState,
  (state: HouseState) => state.houseModelError
);

export const selectHouseModelsByType = (houseType: string) => createSelector(
  selectHouseModels,
  (houseModels) => houseModels.filter(model => model.houseType === houseType)
);

// Grouped Houses Selectors
export const selectGroupedHouses = createSelector(
  selectHouseState,
  (state: HouseState) => state.groupedHouses
);

export const selectFilteredGroupedHouses = createSelector(
  selectHouseState,
  (state: HouseState) => state.filteredGroupedHouses
);

export const selectNonEmptyGroupedHouses = createSelector(
  selectGroupedHouses,
  (groupedHouses: GroupedHouseModel[]) => 
    groupedHouses.filter(group => group.housesCount > 0)
);

export const selectNonEmptyFilteredGroupedHouses = createSelector(
  selectFilteredGroupedHouses,
  (filteredGroupedHouses: GroupedHouseModel[]) => 
    filteredGroupedHouses.filter(group => group.housesCount > 0)
);