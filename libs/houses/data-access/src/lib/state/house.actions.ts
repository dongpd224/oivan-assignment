import { createAction, props } from '@ngrx/store';
import { HouseDetailModel, HouseFilterModel, HouseModelModel, GroupedHouseModel } from '@oivan/houses/domain';
import { PaginationRequestModel } from '@oivan/shared/domain';

// Load Houses Actions
export const loadHouses = createAction(
  '[House] Load Houses',
  props<{ pagination?: PaginationRequestModel; filter?: HouseFilterModel }>()
);

export const loadHousesSuccess = createAction(
  '[House] Load Houses Success',
  props<{ 
    houses: HouseDetailModel[]; 
    groupedHouses: GroupedHouseModel[];
    totalCount: number; 
    totalPages: number;
    pagination?: PaginationRequestModel;
    filter?: HouseFilterModel;
  }>()
);

export const loadHousesFailure = createAction(
  '[House] Load Houses Failure',
  props<{ error: string }>()
);

// Load House by ID Actions
export const loadHouseById = createAction(
  '[House] Load House By ID',
  props<{ id: string }>()
);

export const loadHouseByIdSuccess = createAction(
  '[House] Load House By ID Success',
  props<{ house: HouseDetailModel }>()
);

export const loadHouseByIdFailure = createAction(
  '[House] Load House By ID Failure',
  props<{ error: string }>()
);

// Create House Actions
export const createHouse = createAction(
  '[House] Create House',
  props<{ house: HouseDetailModel }>()
);

export const createHouseSuccess = createAction(
  '[House] Create House Success',
  props<{ house: HouseDetailModel }>()
);

export const createHouseFailure = createAction(
  '[House] Create House Failure',
  props<{ error: string }>()
);

// Update House Actions
export const updateHouse = createAction(
  '[House] Update House',
  props<{ id: string; house: HouseDetailModel }>()
);

export const updateHouseSuccess = createAction(
  '[House] Update House Success',
  props<{ house: HouseDetailModel }>()
);

export const updateHouseFailure = createAction(
  '[House] Update House Failure',
  props<{ error: string }>()
);

// Delete House Actions
export const deleteHouse = createAction(
  '[House] Delete House',
  props<{ id: string }>()
);

export const deleteHouseSuccess = createAction(
  '[House] Delete House Success',
  props<{ id: string }>()
);

export const deleteHouseFailure = createAction(
  '[House] Delete House Failure',
  props<{ error: string }>()
);

// Filter and Selection Actions
export const setFilter = createAction(
  '[House] Set Filter',
  props<{ filter: HouseFilterModel | null }>()
);

export const setPagination = createAction(
  '[House] Set Pagination',
  props<{ pagination: PaginationRequestModel | null }>()
);

export const setSelectedHouse = createAction(
  '[House] Set Selected House',
  props<{ house: HouseDetailModel | null }>()
);

export const clearError = createAction('[House] Clear Error');

export const clearCache = createAction('[House] Clear Cache');

// Load House Models Actions
export const loadHouseModels = createAction('[HouseModel] Load House Models');

export const loadHouseModelsSuccess = createAction(
  '[HouseModel] Load House Models Success',
  props<{ houseModels: HouseModelModel[] }>()
);

export const loadHouseModelsFailure = createAction(
  '[HouseModel] Load House Models Failure',
  props<{ error: string }>()
);

// Load House Model by ID Actions
export const loadHouseModelById = createAction(
  '[HouseModel] Load House Model By ID',
  props<{ id: string }>()
);

export const loadHouseModelByIdSuccess = createAction(
  '[HouseModel] Load House Model By ID Success',
  props<{ houseModel: HouseModelModel }>()
);

export const loadHouseModelByIdFailure = createAction(
  '[HouseModel] Load House Model By ID Failure',
  props<{ error: string }>()
);

export const setSelectedHouseModel = createAction(
  '[HouseModel] Set Selected House Model',
  props<{ houseModel: HouseModelModel | null }>()
);

export const clearHouseModelCache = createAction('[HouseModel] Clear Cache');