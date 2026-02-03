import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, combineLatest } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { HouseModel, HouseFilterModel } from '../../../domain/src';
import { HouseApiService } from './house-api.service';
import { HouseCacheService } from './house-cache.service';
import { ApiResponseModel, PaginationResponseModel, PaginationRequestModel } from '../../../../../shared/domain/src';

export interface HouseState {
  houses: HouseModel[];
  selectedHouse: HouseModel | null;
  currentFilter: HouseFilterModel | null;
  currentPagination: PaginationRequestModel | null;
  totalCount: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class HouseStore {
  private readonly initialState: HouseState = {
    houses: [],
    selectedHouse: null,
    currentFilter: null,
    currentPagination: null,
    totalCount: 0,
    totalPages: 0,
    isLoading: false,
    error: null
  };

  private readonly state$ = new BehaviorSubject<HouseState>(this.initialState);

  constructor(
    private houseApiService: HouseApiService,
    private houseCacheService: HouseCacheService
  ) {}

  // Selectors
  get state(): Observable<HouseState> {
    return this.state$.asObservable();
  }

  get houses$(): Observable<HouseModel[]> {
    return this.state$.pipe(map(state => state.houses));
  }

  get selectedHouse$(): Observable<HouseModel | null> {
    return this.state$.pipe(map(state => state.selectedHouse));
  }

  get currentFilter$(): Observable<HouseFilterModel | null> {
    return this.state$.pipe(map(state => state.currentFilter));
  }

  get currentPagination$(): Observable<PaginationRequestModel | null> {
    return this.state$.pipe(map(state => state.currentPagination));
  }

  get totalCount$(): Observable<number> {
    return this.state$.pipe(map(state => state.totalCount));
  }

  get totalPages$(): Observable<number> {
    return this.state$.pipe(map(state => state.totalPages));
  }

  get isLoading$(): Observable<boolean> {
    return this.state$.pipe(map(state => state.isLoading));
  }

  get error$(): Observable<string | null> {
    return this.state$.pipe(map(state => state.error));
  }

  // Computed selectors
  get filteredHouses$(): Observable<HouseModel[]> {
    return combineLatest([this.houses$, this.currentFilter$]).pipe(
      map(([houses, filter]) => {
        if (!filter) return houses;
        return this.applyClientSideFilter(houses, filter);
      })
    );
  }

  get availableHouses$(): Observable<HouseModel[]> {
    return this.houses$.pipe(
      map(houses => houses.filter(house => house.isAvailable()))
    );
  }

  // Actions
  loadHouses(pagination?: PaginationRequestModel, filter?: HouseFilterModel): Observable<HouseModel[]> {
    this.updateState({ isLoading: true, error: null });

    // Check cache first
    const cacheKey = this.houseCacheService.generateCacheKey(pagination, filter);
    const cachedData = this.houseCacheService.get(cacheKey);
    
    if (cachedData) {
      this.updateState({
        houses: cachedData.houses,
        totalCount: cachedData.totalCount,
        totalPages: cachedData.totalPages,
        currentPagination: pagination || null,
        currentFilter: filter || null,
        isLoading: false
      });
      return this.houses$;
    }

    return this.houseApiService.getHouses(pagination, filter).pipe(
      tap((response: ApiResponseModel<PaginationResponseModel<HouseModel>>) => {
        if (response.isSuccess() && response.data) {
          const houses = response.data.data.map(houseData => new HouseModel(houseData));
          
          // Cache the results
          this.houseCacheService.set(cacheKey, {
            houses,
            totalCount: response.data.total,
            totalPages: response.data.totalPages,
            timestamp: Date.now()
          });

          this.updateState({
            houses,
            totalCount: response.data.total,
            totalPages: response.data.totalPages,
            currentPagination: pagination || null,
            currentFilter: filter || null,
            isLoading: false,
            error: null
          });
        }
      }),
      map((response: ApiResponseModel<PaginationResponseModel<HouseModel>>) => {
        if (response.isError()) {
          throw new Error(response.error || 'Failed to load houses');
        }
        return response.data!.data.map(houseData => new HouseModel(houseData));
      }),
      catchError(error => {
        this.updateState({ 
          isLoading: false, 
          error: error.message || 'Failed to load houses' 
        });
        return throwError(() => error);
      })
    );
  }

  loadHouseById(id: string): Observable<HouseModel> {
    this.updateState({ isLoading: true, error: null });

    // Check cache first
    const cachedHouse = this.houseCacheService.getHouse(id);
    if (cachedHouse) {
      this.updateState({
        selectedHouse: cachedHouse,
        isLoading: false
      });
      return this.selectedHouse$.pipe(
        map(house => house!)
      );
    }

    return this.houseApiService.getHouseById(id).pipe(
      tap((response: ApiResponseModel<HouseModel>) => {
        if (response.isSuccess() && response.data) {
          const house = new HouseModel(response.data);
          
          // Cache the house
          this.houseCacheService.setHouse(id, house);

          this.updateState({
            selectedHouse: house,
            isLoading: false,
            error: null
          });
        }
      }),
      map((response: ApiResponseModel<HouseModel>) => {
        if (response.isError()) {
          throw new Error(response.error || 'Failed to load house');
        }
        return new HouseModel(response.data!);
      }),
      catchError(error => {
        this.updateState({ 
          isLoading: false, 
          error: error.message || 'Failed to load house' 
        });
        return throwError(() => error);
      })
    );
  }

  createHouse(house: HouseModel): Observable<HouseModel> {
    this.updateState({ isLoading: true, error: null });

    return this.houseApiService.createHouse(house).pipe(
      tap((response: ApiResponseModel<HouseModel>) => {
        if (response.isSuccess() && response.data) {
          const newHouse = new HouseModel(response.data);
          const currentHouses = this.state$.value.houses;
          
          // Clear cache to force refresh
          this.houseCacheService.clear();

          this.updateState({
            houses: [newHouse, ...currentHouses],
            selectedHouse: newHouse,
            totalCount: this.state$.value.totalCount + 1,
            isLoading: false,
            error: null
          });
        }
      }),
      map((response: ApiResponseModel<HouseModel>) => {
        if (response.isError()) {
          throw new Error(response.error || 'Failed to create house');
        }
        return new HouseModel(response.data!);
      }),
      catchError(error => {
        this.updateState({ 
          isLoading: false, 
          error: error.message || 'Failed to create house' 
        });
        return throwError(() => error);
      })
    );
  }

  updateHouse(id: string, house: HouseModel): Observable<HouseModel> {
    this.updateState({ isLoading: true, error: null });

    return this.houseApiService.updateHouse(id, house).pipe(
      tap((response: ApiResponseModel<HouseModel>) => {
        if (response.isSuccess() && response.data) {
          const updatedHouse = new HouseModel(response.data);
          const currentHouses = this.state$.value.houses;
          const updatedHouses = currentHouses.map(h => 
            h.id === id ? updatedHouse : h
          );
          
          // Update cache
          this.houseCacheService.setHouse(id, updatedHouse);
          this.houseCacheService.clear(); // Clear list cache to force refresh

          this.updateState({
            houses: updatedHouses,
            selectedHouse: this.state$.value.selectedHouse?.id === id ? updatedHouse : this.state$.value.selectedHouse,
            isLoading: false,
            error: null
          });
        }
      }),
      map((response: ApiResponseModel<HouseModel>) => {
        if (response.isError()) {
          throw new Error(response.error || 'Failed to update house');
        }
        return new HouseModel(response.data!);
      }),
      catchError(error => {
        this.updateState({ 
          isLoading: false, 
          error: error.message || 'Failed to update house' 
        });
        return throwError(() => error);
      })
    );
  }

  deleteHouse(id: string): Observable<void> {
    this.updateState({ isLoading: true, error: null });

    return this.houseApiService.deleteHouse(id).pipe(
      tap((response: ApiResponseModel<void>) => {
        if (response.isSuccess()) {
          const currentHouses = this.state$.value.houses;
          const filteredHouses = currentHouses.filter(h => h.id !== id);
          
          // Clear cache
          this.houseCacheService.clear();
          this.houseCacheService.removeHouse(id);

          this.updateState({
            houses: filteredHouses,
            selectedHouse: this.state$.value.selectedHouse?.id === id ? null : this.state$.value.selectedHouse,
            totalCount: Math.max(0, this.state$.value.totalCount - 1),
            isLoading: false,
            error: null
          });
        }
      }),
      map((response: ApiResponseModel<void>) => {
        if (response.isError()) {
          throw new Error(response.error || 'Failed to delete house');
        }
        return void 0;
      }),
      catchError(error => {
        this.updateState({ 
          isLoading: false, 
          error: error.message || 'Failed to delete house' 
        });
        return throwError(() => error);
      })
    );
  }

  setFilter(filter: HouseFilterModel | null): void {
    this.updateState({ currentFilter: filter });
  }

  setPagination(pagination: PaginationRequestModel | null): void {
    this.updateState({ currentPagination: pagination });
  }

  setSelectedHouse(house: HouseModel | null): void {
    this.updateState({ selectedHouse: house });
  }

  clearError(): void {
    this.updateState({ error: null });
  }

  clearCache(): void {
    this.houseCacheService.clear();
  }

  private updateState(partialState: Partial<HouseState>): void {
    const currentState = this.state$.value;
    this.state$.next({ ...currentState, ...partialState });
  }

  private applyClientSideFilter(houses: HouseModel[], filter: HouseFilterModel): HouseModel[] {
    return houses.filter(house => {
      if (filter.blockNumber && house.blockNumber !== filter.blockNumber) {
        return false;
      }
      if (filter.landNumber && house.landNumber !== filter.landNumber) {
        return false;
      }
      if (filter.houseType && house.houseType !== filter.houseType) {
        return false;
      }
      if (filter.status && house.status !== filter.status) {
        return false;
      }
      if (filter.priceRange) {
        if (filter.priceRange.min && house.price < filter.priceRange.min) {
          return false;
        }
        if (filter.priceRange.max && house.price > filter.priceRange.max) {
          return false;
        }
      }
      return true;
    });
  }
}