import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { HouseModel, HouseFilterModel } from '../../../domain/src';
import { PaginationRequestModel } from '../../../../shared/domain/src';
import * as HouseActions from '../../../data-access/src/lib/+state/house.actions';
import * as HouseSelectors from '../../../data-access/src/lib/+state/house.selectors';

@Injectable({
  providedIn: 'root'
})
export class HouseFacade {
  constructor(private store: Store) {}

  // Expose store selectors
  get houses$(): Observable<HouseModel[]> {
    return this.store.select(HouseSelectors.selectHouses);
  }

  get selectedHouse$(): Observable<HouseModel | null> {
    return this.store.select(HouseSelectors.selectSelectedHouse);
  }

  get currentFilter$(): Observable<HouseFilterModel | null> {
    return this.store.select(HouseSelectors.selectCurrentFilter);
  }

  get currentPagination$(): Observable<PaginationRequestModel | null> {
    return this.store.select(HouseSelectors.selectCurrentPagination);
  }

  get totalCount$(): Observable<number> {
    return this.store.select(HouseSelectors.selectTotalCount);
  }

  get totalPages$(): Observable<number> {
    return this.store.select(HouseSelectors.selectTotalPages);
  }

  get loading$(): Observable<boolean> {
    return this.store.select(HouseSelectors.selectIsLoading);
  }

  get error$(): Observable<string | null> {
    return this.store.select(HouseSelectors.selectError);
  }

  get filteredHouses$(): Observable<HouseModel[]> {
    return this.store.select(HouseSelectors.selectFilteredHouses);
  }

  get availableHouses$(): Observable<HouseModel[]> {
    return this.store.select(HouseSelectors.selectAvailableHouses);
  }

  get availableBlocks$(): Observable<string[]> {
    return this.store.select(HouseSelectors.selectAvailableBlocks);
  }

  get availableLands$(): Observable<string[]> {
    return this.store.select(HouseSelectors.selectAvailableLands);
  }

  // House loading operations
  loadHouses(filter?: HouseFilterModel, pagination?: PaginationRequestModel): Observable<HouseModel[]> {
    this.store.dispatch(HouseActions.loadHouses({ pagination, filter }));
    return this.houses$;
  }

  loadHouseById(id: string): Observable<HouseModel> {
    this.store.dispatch(HouseActions.loadHouseById({ id }));
    return this.selectedHouse$ as Observable<HouseModel>;
  }

  // House CRUD operations
  createHouse(house: HouseModel): Observable<HouseModel> {
    this.store.dispatch(HouseActions.createHouse({ house }));
    return this.selectedHouse$ as Observable<HouseModel>;
  }

  updateHouse(id: string, house: HouseModel): Observable<HouseModel> {
    this.store.dispatch(HouseActions.updateHouse({ id, house }));
    return this.selectedHouse$ as Observable<HouseModel>;
  }

  deleteHouse(id: string): Observable<void> {
    this.store.dispatch(HouseActions.deleteHouse({ id }));
    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }

  // Filter and pagination operations
  setFilter(filter: HouseFilterModel | null): void {
    this.store.dispatch(HouseActions.setFilter({ filter }));
  }

  setPagination(pagination: PaginationRequestModel | null): void {
    this.store.dispatch(HouseActions.setPagination({ pagination }));
  }

  setSelectedHouse(house: HouseModel | null): void {
    this.store.dispatch(HouseActions.setSelectedHouse({ house }));
  }

  // Utility operations
  clearError(): void {
    this.store.dispatch(HouseActions.clearError());
  }

  clearFilter(): void {
    this.store.dispatch(HouseActions.setFilter({ filter: null }));
    this.loadHouses();
  }

  clearCache(): void {
    this.store.dispatch(HouseActions.clearCache());
  }

  // Helper methods for UI components
  getAvailableBlocks(): string[] {
    let blocks: string[] = [];
    this.availableBlocks$.subscribe(availableBlocks => {
      blocks = availableBlocks;
    }).unsubscribe();
    return blocks;
  }

  getAvailableLands(): string[] {
    let lands: string[] = [];
    this.availableLands$.subscribe(availableLands => {
      lands = availableLands;
    }).unsubscribe();
    return lands;
  }

  // Convenience methods for common operations
  refreshHouses(): void {
    this.store.dispatch(HouseActions.clearCache());
    this.loadHouses();
  }

  searchHouses(searchTerm: string): Observable<HouseModel[]> {
    return new Observable(observer => {
      this.houses$.subscribe(houses => {
        const filtered = houses.filter(house => 
          house.houseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          house.houseModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
          house.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          house.blockNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          house.landNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
        observer.next(filtered);
      });
    });
  }
}