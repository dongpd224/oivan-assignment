import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HouseApiService } from '../house-api.service';
import { HouseCacheService } from '../house-cache.service';
import { HouseModel } from '@oivan/houses/domain';
import { ApiResponseModel, PaginationResponseModel } from '@oivan/shared/domain';
import * as HouseActions from './house.actions';

@Injectable()
export class HouseEffects {
  constructor(
    private actions$: Actions,
    private houseApiService: HouseApiService,
    private houseCacheService: HouseCacheService
  ) {}

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
            totalCount: cachedData.totalCount,
            totalPages: cachedData.totalPages,
            pagination,
            filter
          }));
        }

        return this.houseApiService.getHouses(pagination, filter).pipe(
          map((response: ApiResponseModel<PaginationResponseModel<HouseModel>>) => {
            if (response.isSuccess() && response.data) {
              const houses = response.data.data.map((houseData: any) => new HouseModel(houseData));
              
              // Cache the results
              this.houseCacheService.set(cacheKey, {
                houses,
                totalCount: response.data.total,
                totalPages: response.data.totalPages,
                timestamp: Date.now()
              });

              return HouseActions.loadHousesSuccess({
                houses,
                totalCount: response.data.total,
                totalPages: response.data.totalPages,
                pagination,
                filter
              });
            } else {
              throw new Error(response.error || 'Failed to load houses');
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
          map((response: ApiResponseModel<HouseModel>) => {
            if (response.isSuccess() && response.data) {
              const house = new HouseModel(response.data);
              
              // Cache the house
              this.houseCacheService.setHouse(id, house);

              return HouseActions.loadHouseByIdSuccess({ house });
            } else {
              throw new Error(response.error || 'Failed to load house');
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
          map((response: ApiResponseModel<HouseModel>) => {
            if (response.isSuccess() && response.data) {
              const newHouse = new HouseModel(response.data);
              
              // Clear cache to force refresh
              this.houseCacheService.clear();

              return HouseActions.createHouseSuccess({ house: newHouse });
            } else {
              throw new Error(response.error || 'Failed to create house');
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
          map((response: ApiResponseModel<HouseModel>) => {
            if (response.isSuccess() && response.data) {
              const updatedHouse = new HouseModel(response.data);
              
              // Update cache
              this.houseCacheService.setHouse(id, updatedHouse);
              this.houseCacheService.clear(); // Clear list cache to force refresh

              return HouseActions.updateHouseSuccess({ house: updatedHouse });
            } else {
              throw new Error(response.error || 'Failed to update house');
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
          map((response: ApiResponseModel<void>) => {
            if (response.isSuccess()) {
              // Clear cache
              this.houseCacheService.clear();
              this.houseCacheService.removeHouse(id);

              return HouseActions.deleteHouseSuccess({ id });
            } else {
              throw new Error(response.error || 'Failed to delete house');
            }
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