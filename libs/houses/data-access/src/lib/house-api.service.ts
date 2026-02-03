import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HouseModel, HouseFilterModel } from '../../../domain/src';
import { ApiResponseModel, PaginationResponseModel, PaginationRequestModel } from '../../../../../shared/domain/src';

@Injectable({
  providedIn: 'root'
})
export class HouseApiService {
  private readonly baseUrl = '/api/houses';

  constructor(private http: HttpClient) {}

  getHouses(
    pagination?: PaginationRequestModel, 
    filter?: HouseFilterModel
  ): Observable<ApiResponseModel<PaginationResponseModel<HouseModel>>> {
    let params = new HttpParams();
    
    if (pagination) {
      const paginationParams = pagination.convertToReqBody();
      params = params.set('page', paginationParams.page.toString());
      params = params.set('limit', paginationParams.limit.toString());
    }
    
    if (filter) {
      const filterParams = filter.convertToReqBody();
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponseModel<PaginationResponseModel<HouseModel>>>(
      this.baseUrl, 
      { params }
    );
  }

  getHouseById(id: string): Observable<ApiResponseModel<HouseModel>> {
    return this.http.get<ApiResponseModel<HouseModel>>(`${this.baseUrl}/${id}`);
  }

  createHouse(house: HouseModel): Observable<ApiResponseModel<HouseModel>> {
    return this.http.post<ApiResponseModel<HouseModel>>(
      this.baseUrl, 
      house.convertToReqBody()
    );
  }

  updateHouse(id: string, house: HouseModel): Observable<ApiResponseModel<HouseModel>> {
    return this.http.put<ApiResponseModel<HouseModel>>(
      `${this.baseUrl}/${id}`, 
      house.convertToReqBody()
    );
  }

  deleteHouse(id: string): Observable<ApiResponseModel<void>> {
    return this.http.delete<ApiResponseModel<void>>(`${this.baseUrl}/${id}`);
  }
}