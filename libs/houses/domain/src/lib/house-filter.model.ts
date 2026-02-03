import { HouseType, HouseStatus } from './house.model';

// House Filter Model
export enum HOUSE_FILTER_MAPPING_FIELD {
  blockNumber = 'blockNumber',
  landNumber = 'landNumber',
  minPrice = 'minPrice',
  maxPrice = 'maxPrice',
  houseType = 'houseType',
  status = 'status',
  sortBy = 'sortBy',
  sortOrder = 'sortOrder'
}

export interface HouseFilterConvertToReqBody {
  [HOUSE_FILTER_MAPPING_FIELD.blockNumber]?: string;
  [HOUSE_FILTER_MAPPING_FIELD.landNumber]?: string;
  [HOUSE_FILTER_MAPPING_FIELD.minPrice]?: number;
  [HOUSE_FILTER_MAPPING_FIELD.maxPrice]?: number;
  [HOUSE_FILTER_MAPPING_FIELD.houseType]?: HouseType;
  [HOUSE_FILTER_MAPPING_FIELD.status]?: HouseStatus;
  [HOUSE_FILTER_MAPPING_FIELD.sortBy]?: string;
  [HOUSE_FILTER_MAPPING_FIELD.sortOrder]?: string;
}

export class HouseFilterModel {
  blockNumber?: string;
  landNumber?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  houseType?: HouseType;
  status?: HouseStatus;
  sortBy?: 'houseNumber' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';

  constructor(respObject: any, isFromBackend = true) {
    if (isFromBackend) {
      this.parseFromBackend(respObject);
    } else {
      this.blockNumber = respObject.blockNumber;
      this.landNumber = respObject.landNumber;
      this.priceRange = respObject.priceRange;
      this.houseType = respObject.houseType;
      this.status = respObject.status;
      this.sortBy = respObject.sortBy;
      this.sortOrder = respObject.sortOrder;
    }
  }

  private parseFromBackend(respObject: any) {
    this.blockNumber = respObject[HOUSE_FILTER_MAPPING_FIELD.blockNumber];
    this.landNumber = respObject[HOUSE_FILTER_MAPPING_FIELD.landNumber];
    this.priceRange = {
      min: respObject[HOUSE_FILTER_MAPPING_FIELD.minPrice],
      max: respObject[HOUSE_FILTER_MAPPING_FIELD.maxPrice]
    };
    this.houseType = respObject[HOUSE_FILTER_MAPPING_FIELD.houseType];
    this.status = respObject[HOUSE_FILTER_MAPPING_FIELD.status];
    this.sortBy = respObject[HOUSE_FILTER_MAPPING_FIELD.sortBy];
    this.sortOrder = respObject[HOUSE_FILTER_MAPPING_FIELD.sortOrder];
  }

  public convertToReqBody(): HouseFilterConvertToReqBody {
    return {
      [HOUSE_FILTER_MAPPING_FIELD.blockNumber]: this.blockNumber,
      [HOUSE_FILTER_MAPPING_FIELD.landNumber]: this.landNumber,
      [HOUSE_FILTER_MAPPING_FIELD.minPrice]: this.priceRange?.min,
      [HOUSE_FILTER_MAPPING_FIELD.maxPrice]: this.priceRange?.max,
      [HOUSE_FILTER_MAPPING_FIELD.houseType]: this.houseType,
      [HOUSE_FILTER_MAPPING_FIELD.status]: this.status,
      [HOUSE_FILTER_MAPPING_FIELD.sortBy]: this.sortBy,
      [HOUSE_FILTER_MAPPING_FIELD.sortOrder]: this.sortOrder
    };
  }
}