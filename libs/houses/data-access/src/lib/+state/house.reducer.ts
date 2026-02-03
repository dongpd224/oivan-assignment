import { createReducer, on } from '@ngrx/store';
import { HouseModel, HouseFilterModel } from '@oivan/houses/domain';
import { PaginationRequestModel } from '@oivan/shared/domain';
import * as HouseActions from './house.actions';

export interface HouseState {
  houses: HouseModel[];
  selectedHouse: HouseModel | null;
  currentFilter: HouseFilterModel | null;
  currentPagination: PaginationRequestModel | null;
  totalCount: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

export const initialState: HouseState = {
  houses: [],
  selectedHouse: null,
  currentFilter: null,
  currentPagination: null,
  totalCount: 0,
  totalPages: 0,
  isLoading: false,
  error: null
};

export const houseReducer = createReducer(
  initialState,

  // Load Houses Actions
  on(HouseActions.loadHouses, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(HouseActions.loadHousesSuccess, (state, { houses, totalCount, totalPages, pagination, filter }) => ({
    ...state,
    houses,
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
    totalCount: 0,
    totalPages: 0
  }))
);