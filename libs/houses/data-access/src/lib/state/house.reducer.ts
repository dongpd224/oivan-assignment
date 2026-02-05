import { createReducer, on } from '@ngrx/store';
import { HouseDetailModel, HouseFilterModel, HouseModelModel, GroupedHouseModel } from '@oivan/houses/domain';
import { PaginationRequestModel } from '@oivan/shared/domain';
import * as HouseActions from './house.actions';

// Helper function to update house in groupedHouses
function updateHouseInGroups(groups: GroupedHouseModel[], updatedHouse: HouseDetailModel): GroupedHouseModel[] {
  return groups.map(group => {
    const updatedHouses = group.houses.map(h => h.id === updatedHouse.id ? updatedHouse : h);
    return new GroupedHouseModel(group.model, updatedHouses);
  });
}

// Helper function to filter houses based on HouseFilterModel
function filterHouse(house: HouseDetailModel, filter: HouseFilterModel | null): boolean {
  if (!filter) return true;
  
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
}

// Helper function to apply filter to groupedHouses
function applyFilterToGroups(groups: GroupedHouseModel[], filter: HouseFilterModel | null): GroupedHouseModel[] {
  return groups.map(group => {
    const filteredHouses = group.houses.filter(house => filterHouse(house, filter));
    return new GroupedHouseModel(group.model, filteredHouses);
  }).filter(group => group.housesCount > 0);
}

// Helper function to add a new house to the appropriate group
function addHouseToGroups(groups: GroupedHouseModel[], newHouse: HouseDetailModel, houseModels: HouseModelModel[]): GroupedHouseModel[] {
  const existingGroup = groups.find(g => g.model.model === newHouse.model);
  
  if (existingGroup) {
    // Add house to existing group
    return groups.map(group => {
      if (group.model.model === newHouse.model) {
        return new GroupedHouseModel(group.model, [newHouse, ...group.houses]);
      }
      return group;
    });
  } else {
    // Create new group if model exists in houseModels
    const model = houseModels.find(m => m.model === newHouse.model);
    if (model) {
      return [...groups, new GroupedHouseModel(model, [newHouse])];
    }
    return groups;
  }
}

// Helper function to remove a house from groups
function removeHouseFromGroups(groups: GroupedHouseModel[], houseId: string): GroupedHouseModel[] {
  return groups.map(group => {
    const filteredHouses = group.houses.filter(h => h.id !== houseId);
    return new GroupedHouseModel(group.model, filteredHouses);
  }).filter(group => group.housesCount > 0);
}

export interface HouseState {
  houses: HouseDetailModel[];
  groupedHouses: GroupedHouseModel[];
  filteredGroupedHouses: GroupedHouseModel[];
  selectedHouse: HouseDetailModel | null;
  currentFilter: HouseFilterModel | null;
  currentPagination: PaginationRequestModel | null;
  totalCount: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  // HouseModel state
  houseModels: HouseModelModel[];
  selectedHouseModel: HouseModelModel | null;
  isLoadingHouseModels: boolean;
  houseModelError: string | null;
}

export const initialState: HouseState = {
  houses: [],
  groupedHouses: [],
  filteredGroupedHouses: [],
  selectedHouse: null,
  currentFilter: null,
  currentPagination: null,
  totalCount: 0,
  totalPages: 0,
  isLoading: false,
  error: null,
  // HouseModel initial state
  houseModels: [],
  selectedHouseModel: null,
  isLoadingHouseModels: false,
  houseModelError: null
};

export const houseReducer = createReducer(
  initialState,

  // Load Houses Actions
  on(HouseActions.loadHouses, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(HouseActions.loadHousesSuccess, (state, { houses, houseModels, groupedHouses, totalCount, totalPages, pagination, filter }) => {
    const newFilter = filter || null;
    return {
      ...state,
      houses,
      houseModels,
      groupedHouses,
      filteredGroupedHouses: applyFilterToGroups(groupedHouses, newFilter),
      totalCount,
      totalPages,
      currentPagination: pagination || null,
      currentFilter: newFilter,
      isLoading: false,
      error: null
    };
  }),

  on(HouseActions.loadHousesFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Load House by ID Actions
  on(HouseActions.loadHouseById, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(HouseActions.loadHouseByIdSuccess, (state, { house }) => ({
    ...state,
    selectedHouse: house,
    isLoading: false,
    error: null
  })),

  on(HouseActions.loadHouseByIdFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Create House Actions
  on(HouseActions.createHouse, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(HouseActions.createHouseSuccess, (state, { house }) => {
    const updatedGroupedHouses = addHouseToGroups(state.groupedHouses, house, state.houseModels);
    return {
      ...state,
      houses: [house, ...state.houses],
      groupedHouses: updatedGroupedHouses,
      filteredGroupedHouses: applyFilterToGroups(updatedGroupedHouses, state.currentFilter),
      totalCount: state.totalCount + 1,
      isLoading: false,
      error: null
    };
  }),

  on(HouseActions.createHouseFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Update House Actions
  on(HouseActions.updateHouse, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(HouseActions.updateHouseSuccess, (state, { house }) => {
    const updatedGroupedHouses = updateHouseInGroups(state.groupedHouses, house);
    return {
      ...state,
      houses: state.houses.map(h => h.id === house.id ? house : h),
      groupedHouses: updatedGroupedHouses,
      filteredGroupedHouses: applyFilterToGroups(updatedGroupedHouses, state.currentFilter),
      selectedHouse: state.selectedHouse?.id === house.id ? house : state.selectedHouse,
      isLoading: false,
      error: null
    };
  }),

  on(HouseActions.updateHouseFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Delete House Actions
  on(HouseActions.deleteHouse, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(HouseActions.deleteHouseSuccess, (state, { id }) => {
    const updatedGroupedHouses = removeHouseFromGroups(state.groupedHouses, id);
    return {
      ...state,
      houses: state.houses.filter(h => h.id !== id),
      groupedHouses: updatedGroupedHouses,
      filteredGroupedHouses: applyFilterToGroups(updatedGroupedHouses, state.currentFilter),
      selectedHouse: state.selectedHouse?.id === id ? null : state.selectedHouse,
      totalCount: Math.max(0, state.totalCount - 1),
      isLoading: false,
      error: null
    };
  }),

  on(HouseActions.deleteHouseFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Filter and Selection Actions
  on(HouseActions.setFilter, (state, { filter }) => ({
    ...state,
    currentFilter: filter,
    filteredGroupedHouses: applyFilterToGroups(state.groupedHouses, filter)
  })),

  on(HouseActions.applyFilter, (state, { filter }) => ({
    ...state,
    currentFilter: filter,
    filteredGroupedHouses: applyFilterToGroups(state.groupedHouses, filter)
  })),

  on(HouseActions.setPagination, (state, { pagination }) => ({
    ...state,
    currentPagination: pagination
  })),

  on(HouseActions.setSelectedHouse, (state, { house }) => ({
    ...state,
    selectedHouse: house
  })),

  on(HouseActions.clearSelectedHouse, (state) => ({
    ...state,
    selectedHouse: null
  })),

  on(HouseActions.clearError, (state) => ({
    ...state,
    error: null
  })),

  on(HouseActions.clearCache, (state) => ({
    ...state,
    houses: [],
    groupedHouses: [],
    filteredGroupedHouses: [],
    totalCount: 0,
    totalPages: 0
  })),

  // Load House Models Actions
  on(HouseActions.loadHouseModels, (state) => ({
    ...state,
    isLoadingHouseModels: true,
    houseModelError: null
  })),

  on(HouseActions.loadHouseModelsSuccess, (state, { houseModels }) => ({
    ...state,
    houseModels,
    isLoadingHouseModels: false,
    houseModelError: null
  })),

  on(HouseActions.loadHouseModelsFailure, (state, { error }) => ({
    ...state,
    isLoadingHouseModels: false,
    houseModelError: error
  })),

  // Load House Model by ID Actions
  on(HouseActions.loadHouseModelById, (state) => ({
    ...state,
    isLoadingHouseModels: true,
    houseModelError: null
  })),

  on(HouseActions.loadHouseModelByIdSuccess, (state, { houseModel }) => ({
    ...state,
    selectedHouseModel: houseModel,
    isLoadingHouseModels: false,
    houseModelError: null
  })),

  on(HouseActions.loadHouseModelByIdFailure, (state, { error }) => ({
    ...state,
    isLoadingHouseModels: false,
    houseModelError: error
  })),

  on(HouseActions.setSelectedHouseModel, (state, { houseModel }) => ({
    ...state,
    selectedHouseModel: houseModel
  })),

  on(HouseActions.clearHouseModelCache, (state) => ({
    ...state,
    houseModels: [],
    selectedHouseModel: null
  }))
);