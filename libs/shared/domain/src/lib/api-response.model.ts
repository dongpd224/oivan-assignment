// API Response Model
export enum API_RESPONSE_MAPPING_FIELD {
  data = 'data',
  meta = 'meta'
}

export interface IMetaData {
  record_count: number
}

export interface ApiResponseConvertToReqBody<T> {
  [API_RESPONSE_MAPPING_FIELD.meta]: IMetaData;
  [API_RESPONSE_MAPPING_FIELD.data]?: T;
}

export class ApiResponseModel<T> {
  data?: T;
  meta!: IMetaData

  constructor(respObject: any, isFromBackend = true) {
    if (isFromBackend) {
      this.parseFromBackend(respObject);
    } else {
      this.data = respObject.data;
      this.meta = respObject.meta;
    }
  }

  private parseFromBackend(respObject: any) {
    this.data = respObject[API_RESPONSE_MAPPING_FIELD.data];
    this.meta = respObject[API_RESPONSE_MAPPING_FIELD.meta];
  }

  public convertToReqBody(): ApiResponseConvertToReqBody<T> {
    return {
      [API_RESPONSE_MAPPING_FIELD.data]: this.data,
      [API_RESPONSE_MAPPING_FIELD.meta]: this.meta
    };
  }
}