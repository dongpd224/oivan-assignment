import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginCredentialsModel, AuthTokenModel } from '@oivan/auth/domain';
import { ApiResponseModel } from '@oivan/shared';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly baseUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  login(credentials: LoginCredentialsModel): Observable<ApiResponseModel<AuthTokenModel>> {
    const body = credentials.convertToReqBody();
    return this.http.post<ApiResponseModel<AuthTokenModel>>(
      `${this.baseUrl}`, 
      body
    );
  }

  logout(): Observable<ApiResponseModel<void>> {
    return this.http.post<ApiResponseModel<void>>(`${this.baseUrl}/logout`, {});
  }
}
