// API Response Model
export enum API_RESPONSE_MAPPING_FIELD {
  success = 'success',
  data = 'data',
  error = 'error',
  message = 'message'
}

export interface ApiResponseConvertToReqBody<T> {
  [API_RESPONSE_MAPPING_FIELD.success]: boolean;
  [API_RESPONSE_MAPPING_FIELD.data]?: T;
  [API_RESPONSE_MAPPING_FIELD.error]?: string;
  [API_RESPONSE_MAPPING_FIELD.message]?: string;
}

export class ApiResponseModel<T> {
  success!: boolean;
  data?: T;
  error?: string;
  message?: string;

  constructor(respObject: any, isFromBackend = true) {
    if (isFromBackend) {
      this.parseFromBackend(respObject);
    } else {
      this.success = respObject.success;
      this.data = respObject.data;
      this.error = respObject.error;
      this.message = respObject.message;
    }
  }

  private parseFromBackend(respObject: any) {
    this.success = respObject[API_RESPONSE_MAPPING_FIELD.success];
    this.data = respObject[API_RESPONSE_MAPPING_FIELD.data];
    this.error = respObject[API_RESPONSE_MAPPING_FIELD.error];
    this.message = respObject[API_RESPONSE_MAPPING_FIELD.message];
  }

  public convertToReqBody(): ApiResponseConvertToReqBody<T> {
    return {
      [API_RESPONSE_MAPPING_FIELD.success]: this.success,
      [API_RESPONSE_MAPPING_FIELD.data]: this.data,
      [API_RESPONSE_MAPPING_FIELD.error]: this.error,
      [API_RESPONSE_MAPPING_FIELD.message]: this.message
    };
  }

  public isSuccess(): boolean {
    return this.success && !this.error;
  }

  public isError(): boolean {
    return !this.success || !!this.error;
  }
}