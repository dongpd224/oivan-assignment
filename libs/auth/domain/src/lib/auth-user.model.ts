// Auth User Model
export enum AUTH_USER_MAPPING_FIELD {
  id = 'id',
  email = 'email',
  firstName = 'firstName',
  lastName = 'lastName',
  roles = 'roles',
  isActive = 'isActive',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt'
}

export interface AuthUserConvertToReqBody {
  [AUTH_USER_MAPPING_FIELD.id]: string;
  [AUTH_USER_MAPPING_FIELD.email]: string;
  [AUTH_USER_MAPPING_FIELD.firstName]: string;
  [AUTH_USER_MAPPING_FIELD.lastName]: string;
  [AUTH_USER_MAPPING_FIELD.roles]: string[];
  [AUTH_USER_MAPPING_FIELD.isActive]: boolean;
}

export class AuthUserModel {
  id!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  roles!: string[];
  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(respObject: any, isFromBackend = true) {
    if (isFromBackend) {
      this.parseFromBackend(respObject);
    } else {
      this.id = respObject.id;
      this.email = respObject.email;
      this.firstName = respObject.firstName;
      this.lastName = respObject.lastName;
      this.roles = respObject.roles;
      this.isActive = respObject.isActive;
      this.createdAt = respObject.createdAt;
      this.updatedAt = respObject.updatedAt;
    }
  }

  private parseFromBackend(respObject: any) {
    this.id = respObject[AUTH_USER_MAPPING_FIELD.id];
    this.email = respObject[AUTH_USER_MAPPING_FIELD.email];
    this.firstName = respObject[AUTH_USER_MAPPING_FIELD.firstName];
    this.lastName = respObject[AUTH_USER_MAPPING_FIELD.lastName];
    this.roles = respObject[AUTH_USER_MAPPING_FIELD.roles];
    this.isActive = respObject[AUTH_USER_MAPPING_FIELD.isActive];
    this.createdAt = new Date(respObject[AUTH_USER_MAPPING_FIELD.createdAt]);
    this.updatedAt = new Date(respObject[AUTH_USER_MAPPING_FIELD.updatedAt]);
  }

  public convertToReqBody(): AuthUserConvertToReqBody {
    return {
      [AUTH_USER_MAPPING_FIELD.id]: this.id,
      [AUTH_USER_MAPPING_FIELD.email]: this.email,
      [AUTH_USER_MAPPING_FIELD.firstName]: this.firstName,
      [AUTH_USER_MAPPING_FIELD.lastName]: this.lastName,
      [AUTH_USER_MAPPING_FIELD.roles]: this.roles,
      [AUTH_USER_MAPPING_FIELD.isActive]: this.isActive
    };
  }

  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}