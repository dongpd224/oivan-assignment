import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HouseDetailModel, HouseModelModel, HousesAndModelsResponse } from '@oivan/houses/domain';
import { ApiResponseModel } from '@oivan/shared/domain';
import { concatMap, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HouseApiService {
  private readonly baseUrl = 'api/houses';
  private readonly modelUrl = 'api/house_models';

  constructor(private http: HttpClient) {}

  getHousesAndModels(): Observable<HousesAndModelsResponse> {
    return this.getModels().pipe(
      concatMap(models => 
        this.getHouses().pipe(
          map(houses => ({ models, houses }))
        )
      )
    );
  }

  getHouses(): Observable<ApiResponseModel<HouseDetailModel[]>> {
    return this.http.get<ApiResponseModel<HouseDetailModel[]>>(
      this.baseUrl, 
    );
  }

  getModels(): Observable<ApiResponseModel<HouseModelModel[]>> {
    return this.http.get<ApiResponseModel<HouseModelModel[]>>(
      this.modelUrl, 
    );
  }

  getHouseById(id: string): Observable<ApiResponseModel<HouseDetailModel>> {
    return this.http.get<ApiResponseModel<HouseDetailModel>>(`${this.baseUrl}/${id}`);
  }

  createHouse(house: HouseDetailModel): Observable<ApiResponseModel<HouseDetailModel>> {
    return this.http.post<ApiResponseModel<HouseDetailModel>>(
      this.baseUrl, 
      house.convertToReqBody()
    );
  }

  updateHouse(id: string, house: HouseDetailModel): Observable<ApiResponseModel<HouseDetailModel>> {
    return this.http.put<ApiResponseModel<HouseDetailModel>>(
      `${this.baseUrl}/${id}`, 
      house.convertToReqBody()
    );
  }

  deleteHouse(id: string): Observable<ApiResponseModel<void>> {
    return this.http.delete<ApiResponseModel<void>>(`${this.baseUrl}/${id}`);
  }
}
