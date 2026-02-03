// Base Entity Model
export enum BASE_ENTITY_MAPPING_FIELD {
  id = 'id',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt'
}

export interface BaseEntityConvertToReqBody {
  [BASE_ENTITY_MAPPING_FIELD.id]: string;
}

export class BaseEntityModel {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(respObject: any, isFromBackend = true) {
    if (isFromBackend) {
      this.parseFromBackend(respObject);
    } else {
      this.id = respObject.id;
      this.createdAt = respObject.createdAt;
      this.updatedAt = respObject.updatedAt;
    }
  }

  private parseFromBackend(respObject: any) {
    this.id = respObject[BASE_ENTITY_MAPPING_FIELD.id];
    this.createdAt = new Date(respObject[BASE_ENTITY_MAPPING_FIELD.createdAt]);
    this.updatedAt = new Date(respObject[BASE_ENTITY_MAPPING_FIELD.updatedAt]);
  }

  public convertToReqBody(): BaseEntityConvertToReqBody {
    return {
      [BASE_ENTITY_MAPPING_FIELD.id]: this.id
    };
  }
}