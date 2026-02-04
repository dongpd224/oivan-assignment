import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HouseApiService } from '../services/house-api.service';
import { HouseCacheService } from '../services/house-cache.service';
import { HouseDetailModel, HouseModelModel, HousesAndModelsResponse } from '@oivan/houses/domain';
import { ApiResponseModel } from '@oivan/shared/domain';
import { groupHousesByModel } from '../utils/house-grouping.util';
import * as HouseActions from './house.actions';

@Injectable()
export class HouseEffects {
  private actions$ = inject(Actions);
  private houseApiService = inject(HouseApiService);
  private houseCacheService = inject(HouseCacheService);

  loadHouses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HouseActions.loadHouses),
      switchMap(({ pagination, filter }) => {
        // Check cache first
        const cacheKey = this.houseCacheService.generateCacheKey(pagination, filter);
        const cachedData = this.houseCacheService.get(cacheKey);
        
        if (cachedData) {
          return of(HouseActions.loadHousesSuccess({
            houses: cachedData.houses,
            groupedHouses: cachedData.groupedHouses || [],
            totalCount: cachedData.totalCount,
            totalPages: cachedData.totalPages,
            pagination,
            filter
          }));
        }

        return this.houseApiService.getHousesAndModels().pipe(
          map((response: HousesAndModelsResponse) => {
            const { models, houses } = response;
            if (houses.data) {
              const convertedHouses = houses?.data.map((houseData: any) => new HouseDetailModel(houseData));
              const convertedModels = models?.data?.map((modelData: any) => new HouseModelModel(modelData)) || [];
              
              // Group houses by model
              const groupedHouses = groupHousesByModel(convertedHouses, convertedModels);
              
              // Cache the results
              this.houseCacheService.set(cacheKey, {
                houses: convertedHouses,
                groupedHouses,
                totalCount: houses.meta.record_count,
                totalPages: Math.ceil(houses.meta.record_count / 10),
                timestamp: Date.now()
              });

              return HouseActions.loadHousesSuccess({
                houses: convertedHouses,
                groupedHouses,
                totalCount: houses.meta.record_count,
                totalPages: Math.ceil(houses.meta.record_count / 10),
                pagination,
                filter
              });
            } else {
              throw new Error('Failed to load houses');
            }
          }),
          catchError((error) =>
            of(HouseActions.loadHousesFailure({ 
              error: error.message || 'Failed to load houses' 
            }))
          )
        );
      })
    )
  );

  loadHouseById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HouseActions.loadHouseById),
      switchMap(({ id }) => {
        // Check cache first
        const cachedHouse = this.houseCacheService.getHouse(id);
        if (cachedHouse) {
          return of(HouseActions.loadHouseByIdSuccess({ house: cachedHouse }));
        }

        return this.houseApiService.getHouseById(id).pipe(
          map((response: ApiResponseModel<HouseDetailModel>) => {
            if (response.data) {
              const house = new HouseDetailModel(response.data);
              
              // Cache the house
              this.houseCacheService.setHouse(id, house);

              return HouseActions.loadHouseByIdSuccess({ house });
            } else {
              throw new Error('Failed to load house');
            }
          }),
          catchError((error) =>
            of(HouseActions.loadHouseByIdFailure({ 
              error: error.message || 'Failed to load house' 
            }))
          )
        );
      })
    )
  );

  createHouse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HouseActions.createHouse),
      switchMap(({ house }) =>
        this.houseApiService.createHouse(house).pipe(
          map((response: ApiResponseModel<HouseDetailModel>) => {
            if (response.data) {
              const newHouse = new HouseDetailModel(response.data);
              
              // Clear cache to force refresh
              this.houseCacheService.clear();

              return HouseActions.createHouseSuccess({ house: newHouse });
            } else {
              throw new Error('Failed to create house');
            }
          }),
          catchError((error) =>
            of(HouseActions.createHouseFailure({ 
              error: error.message || 'Failed to create house' 
            }))
          )
        )
      )
    )
  );

  updateHouse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HouseActions.updateHouse),
      switchMap(({ id, house }) =>
        this.houseApiService.updateHouse(id, house).pipe(
          map((response: ApiResponseModel<HouseDetailModel>) => {
            if (response.data) {
              const updatedHouse = new HouseDetailModel(response.data);
              
              // Update cache
              this.houseCacheService.setHouse(id, updatedHouse);
              this.houseCacheService.clear(); // Clear list cache to force refresh

              return HouseActions.updateHouseSuccess({ house: updatedHouse });
            } else {
              throw new Error('Failed to update house');
            }
          }),
          catchError((error) =>
            of(HouseActions.updateHouseFailure({ 
              error: error.message || 'Failed to update house' 
            }))
          )
        )
      )
    )
  );

  deleteHouse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HouseActions.deleteHouse),
      switchMap(({ id }) =>
        this.houseApiService.deleteHouse(id).pipe(
          map(() => {
            // Clear cache
            this.houseCacheService.clear();
            this.houseCacheService.removeHouse(id);

            return HouseActions.deleteHouseSuccess({ id });
          }),
          catchError((error) =>
            of(HouseActions.deleteHouseFailure({ 
              error: error.message || 'Failed to delete house' 
            }))
          )
        )
      )
    )
  );

  clearCache$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HouseActions.clearCache),
      tap(() => {
        this.houseCacheService.clear();
      })
    ),
    { dispatch: false }
  );
}