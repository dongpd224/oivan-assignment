import { ApiResponseModel } from '@oivan/shared';
import { HouseDetailModel } from './house.model';
import { HouseModelModel } from './house-model.model';

export interface HousesAndModelsResponse {
  models: ApiResponseModel<HouseModelModel[]>;
  houses: ApiResponseModel<HouseDetailModel[]>;
}