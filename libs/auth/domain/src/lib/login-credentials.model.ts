// Login Credentials Model
export enum LOGIN_CREDENTIALS_MAPPING_FIELD {
  email = 'email',
  password = 'password',
  rememberMe = 'rememberMe'
}

export interface LoginCredentialsConvertToReqBody {
  [LOGIN_CREDENTIALS_MAPPING_FIELD.email]: string;
  [LOGIN_CREDENTIALS_MAPPING_FIELD.password]: string;
  [LOGIN_CREDENTIALS_MAPPING_FIELD.rememberMe]?: boolean;
}

export class LoginCredentialsModel {
  email!: string;
  password!: string;
  rememberMe?: boolean;

  constructor(respObject: any, isFromBackend = true) {
    if (isFromBackend) {
      this.parseFromBackend(respObject);
    } else {
      this.email = respObject.email;
      this.password = respObject.password;
      this.rememberMe = respObject.rememberMe;
    }
  }

  private parseFromBackend(respObject: any) {
    this.email = respObject[LOGIN_CREDENTIALS_MAPPING_FIELD.email];
    this.password = respObject[LOGIN_CREDENTIALS_MAPPING_FIELD.password];
    this.rememberMe = respObject[LOGIN_CREDENTIALS_MAPPING_FIELD.rememberMe];
  }

  public convertToReqBody(): LoginCredentialsConvertToReqBody {
    return {
      [LOGIN_CREDENTIALS_MAPPING_FIELD.email]: this.email,
      [LOGIN_CREDENTIALS_MAPPING_FIELD.password]: this.password,
      [LOGIN_CREDENTIALS_MAPPING_FIELD.rememberMe]: this.rememberMe
    };
  }
}