import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HouseFilterComponent } from './house-filter.component';
import { HouseFilterModel, HouseStatus, HouseType } from '@oivan/houses/domain';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('HouseFilterComponent', () => {
  let component: HouseFilterComponent;
  let fixture: ComponentFixture<HouseFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseFilterComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HouseFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.filterForm.get('sortBy')?.value).toBe('houseNumber');
    expect(component.filterForm.get('sortOrder')?.value).toBe('asc');
    expect(component.filterForm.get('blockNumber')?.value).toBeNull();
    expect(component.filterForm.get('minPrice')?.value).toBeNull();
  });

  it('should populate block options from input', () => {
    fixture.componentRef.setInput('availableBlocks', ['A', 'B', 'C']);
    fixture.detectChanges();

    expect(component.blockOptions().length).toBe(3);
    expect(component.blockOptions()[0].value).toBe('A');
    expect(component.blockOptions()[0].label).toBe('Block A');
  });

  it('should populate land options from input', () => {
    fixture.componentRef.setInput('availableLands', ['01', '02', '03']);
    fixture.detectChanges();

    expect(component.landOptions().length).toBe(3);
    expect(component.landOptions()[0].value).toBe('01');
    expect(component.landOptions()[0].label).toBe('Land 01');
  });

  it('should filter block options based on input', () => {
    fixture.componentRef.setInput('availableBlocks', ['A', 'B', 'AB']);
    fixture.detectChanges();

    component.onBlockInput({ target: { value: 'A' } } as unknown as Event);
    
    expect(component.filteredBlockOptions().length).toBe(2);
  });

  it('should emit filterChange when apply is clicked', () => {
    const filterChangeSpy = vi.fn();
    component.filterChange.subscribe(filterChangeSpy);

    component.filterForm.patchValue({
      blockNumber: 'A',
      minPrice: 500000000
    });
    component.applyFilter();

    expect(filterChangeSpy).toHaveBeenCalled();
    const emittedFilter = filterChangeSpy.mock.calls[0][0];
    expect(emittedFilter.blockNumber).toBe('A');
    expect(emittedFilter.priceRange?.min).toBe(500000000);
  });

  it('should emit filterClear when clear is clicked', () => {
    const filterClearSpy = vi.fn();
    component.filterClear.subscribe(filterClearSpy);

    component.filterForm.patchValue({ blockNumber: 'A' });
    component.clearFilter();

    expect(filterClearSpy).toHaveBeenCalled();
    expect(component.filterForm.get('blockNumber')?.value).toBeNull();
    expect(component.hasActiveFilters).toBeFalsy();
  });

  it('should apply price preset', () => {
    const preset = { label: 'Under 500M', min: 0, max: 500000000 };
    component.applyPricePreset(preset);

    expect(component.filterForm.get('minPrice')?.value).toBe(0);
    expect(component.filterForm.get('maxPrice')?.value).toBe(500000000);
  });

  it('should track hasChanges when form values change', () => {
    expect(component.hasChanges).toBeFalsy();
    
    component.filterForm.patchValue({ blockNumber: 'A' });
    
    expect(component.hasChanges).toBeTruthy();
  });

  it('should track hasActiveFilters correctly', () => {
    expect(component.hasActiveFilters).toBeFalsy();
    
    component.filterForm.patchValue({ blockNumber: 'A' });
    
    expect(component.hasActiveFilters).toBeTruthy();
  });

  it('should load initial filter if provided', () => {
    const initialFilter = new HouseFilterModel({
      blockNumber: 'B',
      landNumber: '02',
      priceRange: { min: 100000000, max: 500000000 },
      sortBy: 'price',
      sortOrder: 'desc'
    }, false);

    fixture.componentRef.setInput('initialFilter', initialFilter);
    component.ngOnInit();

    expect(component.filterForm.get('blockNumber')?.value).toBe('B');
    expect(component.filterForm.get('landNumber')?.value).toBe('02');
    expect(component.filterForm.get('minPrice')?.value).toBe(100000000);
    expect(component.filterForm.get('maxPrice')?.value).toBe(500000000);
    expect(component.filterForm.get('sortBy')?.value).toBe('price');
    expect(component.filterForm.get('sortOrder')?.value).toBe('desc');
  });

  it('should not show create button by default', () => {
    const createButton = fixture.nativeElement.querySelector('button[color="accent"]');
    expect(createButton).toBeFalsy();
  });

  it('should show create button when showCreateButton is true', () => {
    fixture.componentRef.setInput('showCreateButton', true);
    fixture.detectChanges();

    const createButton = fixture.nativeElement.querySelector('button[color="accent"]');
    expect(createButton).toBeTruthy();
  });

  it('should emit createHouse when create button is clicked', () => {
    fixture.componentRef.setInput('showCreateButton', true);
    fixture.detectChanges();

    const createHouseSpy = vi.fn();
    component.createHouse.subscribe(createHouseSpy);

    const createButton = fixture.nativeElement.querySelector('button[color="accent"]');
    createButton?.click();

    expect(createHouseSpy).toHaveBeenCalled();
  });

  it('should have correct house type options', () => {
    expect(component.houseTypeOptions().length).toBe(Object.values(HouseType).length);
  });

  it('should have correct status options', () => {
    expect(component.statusOptions().length).toBe(Object.values(HouseStatus).length);
  });

  it('should display block function correctly', () => {
    fixture.componentRef.setInput('availableBlocks', ['A', 'B']);
    fixture.detectChanges();

    expect(component.displayBlockFn('A')).toBe('Block A');
    expect(component.displayBlockFn('')).toBe('');
    expect(component.displayBlockFn('Unknown')).toBe('Unknown');
  });

  it('should display land function correctly', () => {
    fixture.componentRef.setInput('availableLands', ['01', '02']);
    fixture.detectChanges();

    expect(component.displayLandFn('01')).toBe('Land 01');
    expect(component.displayLandFn('')).toBe('');
    expect(component.displayLandFn('Unknown')).toBe('Unknown');
  });
});
