// House Model
export enum HOUSE_MAPPING_FIELD {
  id = 'id',
  type = 'type',
  links = 'links',
  attributes = 'attributes'
}

export enum HOUSE_ATTRIBUTES_MAPPING_FIELD {
  houseNumber = 'house_number',
  price = 'price',
  blockNumber = 'block_number',
  landNumber = 'land_number',
  houseType = 'house_type',
  model = 'model',
  status = 'status'
}

export interface HouseLinks {
  self: string;
}

export interface HouseAttributesConvertToReqBody {
  [HOUSE_ATTRIBUTES_MAPPING_FIELD.houseNumber]: string;
  [HOUSE_ATTRIBUTES_MAPPING_FIELD.price]: number;
  [HOUSE_ATTRIBUTES_MAPPING_FIELD.blockNumber]: string;
  [HOUSE_ATTRIBUTES_MAPPING_FIELD.landNumber]: string;
  [HOUSE_ATTRIBUTES_MAPPING_FIELD.houseType]: string;
  [HOUSE_ATTRIBUTES_MAPPING_FIELD.model]: string;
  [HOUSE_ATTRIBUTES_MAPPING_FIELD.status]: string;
}

export interface HouseConvertToReqBody {
  [HOUSE_MAPPING_FIELD.id]?: string;
  [HOUSE_MAPPING_FIELD.type]: string;
  [HOUSE_MAPPING_FIELD.links]: HouseLinks;
  [HOUSE_MAPPING_FIELD.attributes]: HouseAttributesConvertToReqBody;
}

export enum HouseType {
  APARTMENT = 'apartment',
  TOWNHOUSE = 'townhouse',
  VILLA = 'villa'
}

export enum HouseStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked'
}

export class HouseDetailModel {
  id?: string;
  type!: string;
  links!: HouseLinks;
  houseNumber!: string;
  price!: number;
  blockNumber!: string;
  landNumber!: string;
  houseType!: string;
  model!: string;
  status!: string;

  constructor(respObject: any, isFromBackend = true) {
    if (isFromBackend) {
      this.parseFromBackend(respObject);
    } else {
      this.id = respObject.id;
      this.type = respObject.type;
      this.links = respObject.links;
      this.houseNumber = respObject.houseNumber;
      this.price = respObject.price;
      this.blockNumber = respObject.blockNumber;
      this.landNumber = respObject.landNumber;
      this.houseType = respObject.houseType;
      this.model = respObject.model;
      this.status = respObject.status;
    }
  }

  private parseFromBackend(respObject: any) {
    this.id = respObject[HOUSE_MAPPING_FIELD.id];
    this.type = respObject[HOUSE_MAPPING_FIELD.type];
    this.links = respObject[HOUSE_MAPPING_FIELD.links];

    const attributes = respObject[HOUSE_MAPPING_FIELD.attributes];
    if (attributes) {
      this.houseNumber = attributes[HOUSE_ATTRIBUTES_MAPPING_FIELD.houseNumber];
      this.price = attributes[HOUSE_ATTRIBUTES_MAPPING_FIELD.price];
      this.blockNumber = attributes[HOUSE_ATTRIBUTES_MAPPING_FIELD.blockNumber];
      this.landNumber = attributes[HOUSE_ATTRIBUTES_MAPPING_FIELD.landNumber];
      this.houseType = attributes[HOUSE_ATTRIBUTES_MAPPING_FIELD.houseType];
      this.model = attributes[HOUSE_ATTRIBUTES_MAPPING_FIELD.model];
      this.status = attributes[HOUSE_ATTRIBUTES_MAPPING_FIELD.status];
    }
  }

  public convertToReqBody(): HouseConvertToReqBody {
    const body:HouseConvertToReqBody = {} as HouseConvertToReqBody
    if(this.id) {
      body[HOUSE_MAPPING_FIELD.id] = this.id;
    }
    body[HOUSE_MAPPING_FIELD.type] = this.type ?? "houses",
    body[HOUSE_MAPPING_FIELD.links] = this.links,
    body[HOUSE_MAPPING_FIELD.attributes] = {
      [HOUSE_ATTRIBUTES_MAPPING_FIELD.houseNumber]: this.houseNumber,
      [HOUSE_ATTRIBUTES_MAPPING_FIELD.price]: this.price,
      [HOUSE_ATTRIBUTES_MAPPING_FIELD.blockNumber]: this.blockNumber,
      [HOUSE_ATTRIBUTES_MAPPING_FIELD.landNumber]: this.landNumber,
      [HOUSE_ATTRIBUTES_MAPPING_FIELD.houseType]: this.houseType,
      [HOUSE_ATTRIBUTES_MAPPING_FIELD.model]: this.model,
      [HOUSE_ATTRIBUTES_MAPPING_FIELD.status]: this.status
    }
    return body;
  }

  public getFullHouseNumber(): string {
    return `${this.blockNumber}-${this.landNumber}-${this.houseNumber}`;
  }

  public isAvailable(): boolean {
    return this.status === HouseStatus.AVAILABLE;
  }
}
