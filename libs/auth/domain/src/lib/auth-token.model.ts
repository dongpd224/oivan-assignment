// Auth Token Model
export enum AUTH_TOKEN_MAPPING_FIELD {
  accessToken = 'token',
  refreshToken = 'refreshToken',
  expiresIn = 'expiresIn',
  tokenType = 'tokenType',
  attributes = 'attributes',
}

export interface AuthTokenConvertToReqBody {
  [AUTH_TOKEN_MAPPING_FIELD.accessToken]: string;
  [AUTH_TOKEN_MAPPING_FIELD.refreshToken]: string;
  [AUTH_TOKEN_MAPPING_FIELD.expiresIn]: number;
  [AUTH_TOKEN_MAPPING_FIELD.tokenType]: string;
}

export class AuthTokenModel {
  accessToken!: string;
  refreshToken!: string;
  expiresIn!: number;
  tokenType!: string;

  constructor(respObject: any, isFromBackend = true) {
    if (isFromBackend) {
      this.parseFromBackend(respObject);
    } else {
      this.accessToken = respObject.accessToken;
      this.refreshToken = respObject.refreshToken;
      this.expiresIn = respObject.expiresIn;
      this.tokenType = respObject.tokenType;
    }
  }

  private parseFromBackend(respObject: any) {
    this.accessToken = respObject[AUTH_TOKEN_MAPPING_FIELD.attributes]?.[AUTH_TOKEN_MAPPING_FIELD.accessToken];
    this.refreshToken = respObject[AUTH_TOKEN_MAPPING_FIELD.refreshToken];
    this.expiresIn = respObject[AUTH_TOKEN_MAPPING_FIELD.expiresIn];
    this.tokenType = respObject[AUTH_TOKEN_MAPPING_FIELD.tokenType];
  }

  public convertToReqBody(): AuthTokenConvertToReqBody {
    return {
      [AUTH_TOKEN_MAPPING_FIELD.accessToken]: this.accessToken,
      [AUTH_TOKEN_MAPPING_FIELD.refreshToken]: this.refreshToken,
      [AUTH_TOKEN_MAPPING_FIELD.expiresIn]: this.expiresIn,
      [AUTH_TOKEN_MAPPING_FIELD.tokenType]: this.tokenType
    };
  }

  public isExpired(): boolean {
    return Date.now() >= this.expiresIn * 1000;
  }
}