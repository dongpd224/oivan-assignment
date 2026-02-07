import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HouseListComponent } from './house-list.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { HouseFacade } from '@oivan/houses/data-access';
import { AuthFacade } from '@oivan/auth/data-access';
import { HouseDetailModel, HouseFilterModel, HouseStatus, HouseType } from '@oivan/houses/domain';

describe('HouseListComponent', () => {
  let component: HouseListComponent;
  let fixture: ComponentFixture<HouseListComponent>;
  let mockHouseFacade: Partial<HouseFacade>;
  let mockAuthFacade: Partial<AuthFacade>;
  let router: Router;

  const mockHouses: HouseDetailModel[] = [
    new HouseDetailModel({
      id: '1',
      houseNumber: 'H-001',
      blockNumber: 'A',
      landNumber: '01',
      houseType: HouseType.VILLA,
      model: 'Model A',
      price: 1000000000,
      status: HouseStatus.AVAILABLE
    }, false)
  ];

  beforeEach(async () => {
    mockHouseFacade = {
      housesSignal: signal(mockHouses),
      nonEmptyFilteredGroupedHousesSignal: signal([]),
      isLoadingSignal: signal(false),
      errorSignal: signal(null),
      currentFilterSignal: signal(null),
      availableBlocksSignal: signal(['A', 'B']),
      availableLandsSignal: signal(['01', '02']),
      totalCountSignal: signal(1),
      loadHouses: vi.fn(),
      applyFilter: vi.fn(),
      setSelectedHouse: vi.fn()
    };

    mockAuthFacade = {
      isAuthenticatedSignal: signal(true)
    };

    await TestBed.configureTestingModule({
      imports: [HouseListComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: HouseFacade, useValue: mockHouseFacade },
        { provide: AuthFacade, useValue: mockAuthFacade }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HouseListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load houses on init', () => {
    expect(mockHouseFacade.loadHouses).toHaveBeenCalled();
  });

  it('should apply filter when filter changes', () => {
    const filter = new HouseFilterModel({ blockNumber: 'A' }, false);
    component.onFilterChange(filter);
    expect(mockHouseFacade.applyFilter).toHaveBeenCalledWith(filter);
  });

  it('should clear filter when filter is cleared', () => {
    component.onFilterClear();
    expect(mockHouseFacade.applyFilter).toHaveBeenCalledWith(null);
  });

  it('should navigate to house details when authenticated', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.onViewDetails(mockHouses[0]);
    
    expect(mockHouseFacade.setSelectedHouse).toHaveBeenCalledWith(mockHouses[0]);
    expect(navigateSpy).toHaveBeenCalledWith(['/houses', '1']);
  });

  it('should navigate to edit house when authenticated', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.onEditHouse(mockHouses[0]);
    
    expect(mockHouseFacade.setSelectedHouse).toHaveBeenCalledWith(mockHouses[0]);
    expect(navigateSpy).toHaveBeenCalledWith(['/houses', '1', 'edit']);
  });

  it('should navigate to create house when authenticated', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.createHouse();
    
    expect(navigateSpy).toHaveBeenCalledWith(['/houses/create']);
  });

  it('should not navigate when not authenticated', () => {
    (mockAuthFacade.isAuthenticatedSignal as any) = signal(false);
    fixture = TestBed.createComponent(HouseListComponent);
    component = fixture.componentInstance;
    
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.onViewDetails(mockHouses[0]);
    
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should display houses from facade', () => {
    expect(component.houses()).toEqual(mockHouses);
  });

  it('should display loading state', () => {
    expect(component.loading()).toBeFalsy();
  });

  it('should display available blocks', () => {
    expect(component.availableBlocks()).toEqual(['A', 'B']);
  });

  it('should display available lands', () => {
    expect(component.availableLands()).toEqual(['01', '02']);
  });
});
