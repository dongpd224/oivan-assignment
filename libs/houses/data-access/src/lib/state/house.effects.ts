import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HouseApiService } from '../services/house-api.service';
import { HouseDetailModel, HouseModelModel, HousesAndModelsResponse } from '@oivan/houses/domain';
import { ApiResponseModel } from '@oivan/shared/domain';
import { groupHousesByModel } from '../utils/house-grouping.util';
import * as HouseActions from './house.actions';
import { selectHouses, selectHouseModels, selectGroupedHouses, selectTotalCount, selectTotalPages, selectSelectedHouse, selectCurrentFilter } from './house.selectors';

interface ApiError {
  title: string;
  detail: string;
  code: string;
  source: { pointer: string };
  status: string;
}

interface ApiErrorResponse {
  errors: ApiError[];
}

@Injectable()
export class HouseEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private houseApiService = inject(HouseApiService);
  private snackBar = inject(MatSnackBar);

  /**
   * Extracts error details from API error response
   * API returns errors in format: { errors: [{ detail: "field - message" }] }
   */
  private extractErrorMessage(error: any): string {
    if (error?.error?.errors && Array.isArray(error.error.errors)) {
      const errorDetails = (error.error as ApiErrorResponse).errors
        .map((e: ApiError) => e.detail)
        .join('\n');
      return errorDetails || 'An error occurred';
    }
    return error?.message || 'An error occurred';
  }

  private showErrorToast(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 8000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  loadHouses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HouseActions.loadHouses),
      withLatestFrom(
        this.store.select(selectHouses),
        this.store.select(selectHouseModels),
        this.store.select(selectGroupedHouses),
        this.store.select(selectTotalCount),
        this.store.select(selectTotalPages),
        this.store.select(selectCurrentFilter)
      ),
      switchMap(([_, houses, houseModels, groupedHouses, totalCount, totalPages, currentFilter]) => {
        // Return from state if data already exists
        if (houses.length > 0) {
          return of(HouseActions.loadHousesSuccess({
            houses,
            houseModels,
            groupedHouses,
            totalCount,
            totalPages,
            filter: currentFilter ?? undefined,
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

              return HouseActions.loadHousesSuccess({
                houses: convertedHouses,
                houseModels: convertedModels,
                groupedHouses,
                totalCount: houses.meta.record_count,
                totalPages: Math.ceil(houses.meta.record_count / 10)
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
      withLatestFrom(this.store.select(selectHouses), this.store.select(selectSelectedHouse)),
      switchMap(([{ id }, houses, selectedHouse]) => {
        // Check if already selected
        if (selectedHouse?.id === id) {
          return of(HouseActions.loadHouseByIdSuccess({ house: selectedHouse }));
        }
        
        // Check if exists in houses list
        const cachedHouse = houses.find(h => h.id === id);
        if (cachedHouse) {
          return of(HouseActions.loadHouseByIdSuccess({ house: cachedHouse }));
        }

        return this.houseApiService.getHouseById(id).pipe(
          map((response: ApiResponseModel<HouseDetailModel>) => {
            if (response.data) {
              const house = new HouseDetailModel(response.data);
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
              
              return HouseActions.createHouseSuccess({ house: newHouse });
            } else {
              throw new Error('Failed to create house');
            }
          }),
          catchError((error) => {
            const errorMessage = this.extractErrorMessage(error);
            this.showErrorToast(errorMessage);
            return of(HouseActions.createHouseFailure({ error: errorMessage }));
          })
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
              
              return HouseActions.updateHouseSuccess({ house: updatedHouse });
            } else {
              throw new Error('Failed to update house');
            }
          }),
          catchError((error) => {
            const errorMessage = this.extractErrorMessage(error);
            this.showErrorToast(errorMessage);
            return of(HouseActions.updateHouseFailure({ error: errorMessage }));
          })
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
}