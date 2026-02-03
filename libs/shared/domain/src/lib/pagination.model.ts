// Pagination Request Model
export enum PAGINATION_REQUEST_MAPPING_FIELD {
  page = 'page',
  limit = 'limit'
}

export interface PaginationRequestConvertToReqBody {
  [PAGINATION_REQUEST_MAPPING_FIELD.page]: number;
  [PAGINATION_REQUEST_MAPPING_FIELD.limit]: number;
}

export class PaginationRequestModel {
  page!: number;
  limit!: number;

  constructor(respObject: any, isFromBackend = true) {
    if (isFromBackend) {
      this.parseFromBackend(respObject);
    } else {
      this.page = respObject.page;
      this.limit = respObject.limit;
    }
  }

  private parseFromBackend(respObject: any) {
    this.page = respObject[PAGINATION_REQUEST_MAPPING_FIELD.page];
    this.limit = respObject[PAGINATION_REQUEST_MAPPING_FIELD.limit];
  }

  public convertToReqBody(): PaginationRequestConvertToReqBody {
    return {
      [PAGINATION_REQUEST_MAPPING_FIELD.page]: this.page,
      [PAGINATION_REQUEST_MAPPING_FIELD.limit]: this.limit
    };
  }

  public getOffset(): number {
    return (this.page - 1) * this.limit;
  }
}

// Pagination Response Model
export enum PAGINATION_RESPONSE_MAPPING_FIELD {
  data = 'data',
  total = 'total',
  page = 'page',
  limit = 'limit',
  totalPages = 'totalPages'
}

export interface PaginationResponseConvertToReqBody<T> {
  [PAGINATION_RESPONSE_MAPPING_FIELD.data]: T[];
  [PAGINATION_RESPONSE_MAPPING_FIELD.total]: number;
  [PAGINATION_RESPONSE_MAPPING_FIELD.page]: number;
  [PAGINATION_RESPONSE_MAPPING_FIELD.limit]: number;
  [PAGINATION_RESPONSE_MAPPING_FIELD.totalPages]: number;
}

export class PaginationResponseModel<T> {
  data!: T[];
  total!: number;
  page!: number;
  limit!: number;
  totalPages!: number;

  constructor(respObject: any, isFromBackend = true) {
    if (isFromBackend) {
      this.parseFromBackend(respObject);
    } else {
      this.data = respObject.data;
      this.total = respObject.total;
      this.page = respObject.page;
      this.limit = respObject.limit;
      this.totalPages = respObject.totalPages;
    }
  }

  private parseFromBackend(respObject: any) {
    this.data = respObject[PAGINATION_RESPONSE_MAPPING_FIELD.data];
    this.total = respObject[PAGINATION_RESPONSE_MAPPING_FIELD.total];
    this.page = respObject[PAGINATION_RESPONSE_MAPPING_FIELD.page];
    this.limit = respObject[PAGINATION_RESPONSE_MAPPING_FIELD.limit];
    this.totalPages = respObject[PAGINATION_RESPONSE_MAPPING_FIELD.totalPages];
  }

  public convertToReqBody(): PaginationResponseConvertToReqBody<T> {
    return {
      [PAGINATION_RESPONSE_MAPPING_FIELD.data]: this.data,
      [PAGINATION_RESPONSE_MAPPING_FIELD.total]: this.total,
      [PAGINATION_RESPONSE_MAPPING_FIELD.page]: this.page,
      [PAGINATION_RESPONSE_MAPPING_FIELD.limit]: this.limit,
      [PAGINATION_RESPONSE_MAPPING_FIELD.totalPages]: this.totalPages
    };
  }

  public hasNextPage(): boolean {
    return this.page < this.totalPages;
  }

  public hasPreviousPage(): boolean {
    return this.page > 1;
  }
}