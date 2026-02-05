// Login Credentials Model
export enum LOGIN_CREDENTIALS_MAPPING_FIELD {
  email = 'username',
  password = 'password',
}

export interface LoginCredentialsConvertToReqBody {
  data: {
    type: 'auth';
    attributes: {
      [LOGIN_CREDENTIALS_MAPPING_FIELD.email]: string;
      [LOGIN_CREDENTIALS_MAPPING_FIELD.password]: string;
    };
  };
}

export class LoginCredentialsModel {
  email!: string;
  password!: string;

  constructor(respObject: any, isFromBackend = true) {
    if (isFromBackend) {
      this.parseFromBackend(respObject);
    } else {
      this.email = respObject.email;
      this.password = respObject.password;
    }
  }

  private parseFromBackend(respObject: any) {
    this.email = respObject[LOGIN_CREDENTIALS_MAPPING_FIELD.email];
    this.password = respObject[LOGIN_CREDENTIALS_MAPPING_FIELD.password];
  }

  public convertToReqBody(): LoginCredentialsConvertToReqBody {
    return {
      data: {
        type: 'auth',
        attributes: {
          [LOGIN_CREDENTIALS_MAPPING_FIELD.email]: this.email,
          [LOGIN_CREDENTIALS_MAPPING_FIELD.password]: this.password,
        },
      },
    };
  }
}