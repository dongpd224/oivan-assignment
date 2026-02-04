import { createReducer, on } from '@ngrx/store';
import { HouseDetailModel, HouseFilterModel, HouseModelModel, GroupedHouseModel } from '@oivan/houses/domain';
import { PaginationRequestModel } from '@oivan/shared/domain';
import * as HouseActions from './house.actions';

export interface HouseState {
  houses: HouseDetailModel[];
  groupedHouses: GroupedHouseModel[];
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

  on(HouseActions.loadHousesSuccess, (state, { houses, groupedHouses, totalCount, totalPages, pagination, filter }) => ({
    ...state,
    houses,
    groupedHouses,
    totalCount,
    totalPages,
    currentPagination: pagination || null,
    currentFilter: filter || null,
    isLoading: false,
    error: null
  })),

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

  on(HouseActions.createHouseSuccess, (state, { house }) => ({
    ...state,
    houses: [house, ...state.houses],
    selectedHouse: house,
    totalCount: state.totalCount + 1,
    isLoading: false,
    error: null
  })),

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

  on(HouseActions.updateHouseSuccess, (state, { house }) => ({
    ...state,
    houses: state.houses.map(h => h.id === house.id ? house : h),
    selectedHouse: state.selectedHouse?.id === house.id ? house : state.selectedHouse,
    isLoading: false,
    error: null
  })),

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

  on(HouseActions.deleteHouseSuccess, (state, { id }) => ({
    ...state,
    houses: state.houses.filter(h => h.id !== id),
    selectedHouse: state.selectedHouse?.id === id ? null : state.selectedHouse,
    totalCount: Math.max(0, state.totalCount - 1),
    isLoading: false,
    error: null
  })),

  on(HouseActions.deleteHouseFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Filter and Selection Actions
  on(HouseActions.setFilter, (state, { filter }) => ({
    ...state,
    currentFilter: filter
  })),

  on(HouseActions.setPagination, (state, { pagination }) => ({
    ...state,
    currentPagination: pagination
  })),

  on(HouseActions.setSelectedHouse, (state, { house }) => ({
    ...state,
    selectedHouse: house
  })),

  on(HouseActions.clearError, (state) => ({
    ...state,
    error: null
  })),

  on(HouseActions.clearCache, (state) => ({
    ...state,
    houses: [],
    groupedHouses: [],
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