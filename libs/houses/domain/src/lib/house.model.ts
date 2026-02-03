// House Model
export enum HOUSE_MAPPING_FIELD {
  id = 'id',
  houseNumber = 'houseNumber',
  blockNumber = 'blockNumber',
  landNumber = 'landNumber',
  houseType = 'houseType',
  houseModel = 'houseModel',
  price = 'price',
  status = 'status',
  media = 'media',
  description = 'description',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt'
}

export interface HouseConvertToReqBody {
  [HOUSE_MAPPING_FIELD.id]: string;
  [HOUSE_MAPPING_FIELD.houseNumber]: string;
  [HOUSE_MAPPING_FIELD.blockNumber]: string;
  [HOUSE_MAPPING_FIELD.landNumber]: string;
  [HOUSE_MAPPING_FIELD.houseType]: HouseType;
  [HOUSE_MAPPING_FIELD.houseModel]: string;
  [HOUSE_MAPPING_FIELD.price]: number;
  [HOUSE_MAPPING_FIELD.status]: HouseStatus;
  [HOUSE_MAPPING_FIELD.media]?: string[];
  [HOUSE_MAPPING_FIELD.description]?: string;
}

export enum HouseType {
  APARTMENT = 'Apartment',
  TOWNHOUSE = 'Townhouse',
  VILLA = 'Villa'
}

export enum HouseStatus {
  AVAILABLE = 'Available',
  BOOKED = 'Booked'
}

export class HouseModel {
  id!: string;
  houseNumber!: string;
  blockNumber!: string;
  landNumber!: string;
  houseType!: HouseType;
  houseModel!: string;
  price!: number;
  status!: HouseStatus;
  media?: string[];
  description?: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(respObject: any, isFromBackend = true) {
    if (isFromBackend) {
      this.parseFromBackend(respObject);
    } else {
      this.id = respObject.id;
      this.houseNumber = respObject.houseNumber;
      this.blockNumber = respObject.blockNumber;
      this.landNumber = respObject.landNumber;
      this.houseType = respObject.houseType;
      this.houseModel = respObject.houseModel;
      this.price = respObject.price;
      this.status = respObject.status;
      this.media = respObject.media;
      this.description = respObject.description;
      this.createdAt = respObject.createdAt;
      this.updatedAt = respObject.updatedAt;
    }
  }

  private parseFromBackend(respObject: any) {
    this.id = respObject[HOUSE_MAPPING_FIELD.id];
    this.houseNumber = respObject[HOUSE_MAPPING_FIELD.houseNumber];
    this.blockNumber = respObject[HOUSE_MAPPING_FIELD.blockNumber];
    this.landNumber = respObject[HOUSE_MAPPING_FIELD.landNumber];
    this.houseType = respObject[HOUSE_MAPPING_FIELD.houseType];
    this.houseModel = respObject[HOUSE_MAPPING_FIELD.houseModel];
    this.price = respObject[HOUSE_MAPPING_FIELD.price];
    this.status = respObject[HOUSE_MAPPING_FIELD.status];
    this.media = respObject[HOUSE_MAPPING_FIELD.media];
    this.description = respObject[HOUSE_MAPPING_FIELD.description];
    this.createdAt = new Date(respObject[HOUSE_MAPPING_FIELD.createdAt]);
    this.updatedAt = new Date(respObject[HOUSE_MAPPING_FIELD.updatedAt]);
  }

  public convertToReqBody(): HouseConvertToReqBody {
    return {
      [HOUSE_MAPPING_FIELD.id]: this.id,
      [HOUSE_MAPPING_FIELD.houseNumber]: this.houseNumber,
      [HOUSE_MAPPING_FIELD.blockNumber]: this.blockNumber,
      [HOUSE_MAPPING_FIELD.landNumber]: this.landNumber,
      [HOUSE_MAPPING_FIELD.houseType]: this.houseType,
      [HOUSE_MAPPING_FIELD.houseModel]: this.houseModel,
      [HOUSE_MAPPING_FIELD.price]: this.price,
      [HOUSE_MAPPING_FIELD.status]: this.status,
      [HOUSE_MAPPING_FIELD.media]: this.media,
      [HOUSE_MAPPING_FIELD.description]: this.description
    };
  }

  public getFormattedPrice(): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(this.price);
  }

  public getFullHouseNumber(): string {
    return `${this.blockNumber}-${this.landNumber}-${this.houseNumber.split('-').pop()}`;
  }

  public isAvailable(): boolean {
    return this.status === HouseStatus.AVAILABLE;
  }
}