import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HouseTableComponent } from './house-table.component';
import { HouseDetailModel, HouseStatus, HouseType } from '@oivan/houses/domain';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';

describe('HouseTableComponent', () => {
  let component: HouseTableComponent;
  let fixture: ComponentFixture<HouseTableComponent>;

  const mockHouses: HouseDetailModel[] = [
    new HouseDetailModel({
      id: '1',
      houseNumber: 'H-001',
      blockNumber: 'A',
      landNumber: '01',
      houseType: HouseType.VILLA,
      model: 'Model A',
      price: 1000000000,
      status: HouseStatus.AVAILABLE,
      type: 'houses',
      links: { self: 'http://example.com/houses/1' }
    }, false),
    new HouseDetailModel({
      id: '2',
      houseNumber: 'H-002',
      blockNumber: 'B',
      landNumber: '02',
      houseType: HouseType.TOWNHOUSE,
      model: 'Model B',
      price: 500000000,
      status: HouseStatus.BOOKED,
      type: 'houses',
      links: { self: 'http://example.com/houses/2' }
    }, false)
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseTableComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HouseTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display houses in table', () => {
    fixture.componentRef.setInput('houses', mockHouses);
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tr.mat-mdc-row');
    expect(rows.length).toBe(2);
  });

  it('should display correct columns without edit actions', () => {
    fixture.componentRef.setInput('houses', mockHouses);
    fixture.detectChanges();

    expect(component.displayedColumns()).toEqual(['houseNumber', 'blockNumber', 'landNumber', 'price', 'status']);
  });

  it('should display actions column when showEditActions is true', () => {
    fixture.componentRef.setInput('houses', mockHouses);
    fixture.componentRef.setInput('showEditActions', true);
    fixture.detectChanges();

    expect(component.displayedColumns()).toContain('actions');
  });

  it('should display house number in table', () => {
    fixture.componentRef.setInput('houses', mockHouses);
    fixture.detectChanges();

    const cells = fixture.nativeElement.querySelectorAll('td.mat-mdc-cell');
    expect(cells[0]?.textContent).toContain('H-001');
  });

  it('should display status badge with correct class', () => {
    fixture.componentRef.setInput('houses', mockHouses);
    fixture.detectChanges();

    const badges = fixture.nativeElement.querySelectorAll('.badge');
    expect(badges[0]?.classList.contains('bg-success')).toBeTruthy();
    expect(badges[1]?.classList.contains('bg-warning')).toBeTruthy();
  });

  it('should show "No houses found" when empty', () => {
    fixture.componentRef.setInput('houses', []);
    fixture.detectChanges();

    const noDataRow = fixture.nativeElement.querySelector('.mat-mdc-no-data-row');
    expect(noDataRow?.textContent).toContain('No houses found');
  });

  it('should emit sortChange when sort is triggered', () => {
    fixture.componentRef.setInput('houses', mockHouses);
    fixture.detectChanges();

    const sortChangeSpy = vi.fn();
    component.sortChange.subscribe(sortChangeSpy);

    const sort: Sort = { active: 'price', direction: 'asc' };
    component.onSortChange(sort);

    expect(sortChangeSpy).toHaveBeenCalledWith(sort);
  });

  it('should emit pageChange when pagination changes', () => {
    fixture.componentRef.setInput('houses', mockHouses);
    fixture.componentRef.setInput('showPagination', true);
    fixture.detectChanges();

    const pageChangeSpy = vi.fn();
    component.pageChange.subscribe(pageChangeSpy);

    const pageEvent: PageEvent = { pageIndex: 1, pageSize: 10, length: 20 };
    component.onPageChange(pageEvent);

    expect(pageChangeSpy).toHaveBeenCalledWith(pageEvent);
  });

  it('should emit edit when edit button is clicked', () => {
    fixture.componentRef.setInput('houses', mockHouses);
    fixture.componentRef.setInput('showEditActions', true);
    fixture.detectChanges();

    const editSpy = vi.fn();
    component.edit.subscribe(editSpy);

    const editButton = fixture.nativeElement.querySelector('button[title="Edit House"]');
    editButton?.click();

    expect(editSpy).toHaveBeenCalledWith(mockHouses[0]);
  });

  it('should show pagination when showPagination is true and has houses', () => {
    fixture.componentRef.setInput('houses', mockHouses);
    fixture.componentRef.setInput('showPagination', true);
    fixture.detectChanges();

    const paginator = fixture.nativeElement.querySelector('mat-paginator');
    expect(paginator).toBeTruthy();
  });

  it('should not show pagination when showPagination is false', () => {
    fixture.componentRef.setInput('houses', mockHouses);
    fixture.componentRef.setInput('showPagination', false);
    fixture.detectChanges();

    const paginator = fixture.nativeElement.querySelector('mat-paginator');
    expect(paginator).toBeFalsy();
  });

  it('should use custom page size', () => {
    fixture.componentRef.setInput('houses', mockHouses);
    fixture.componentRef.setInput('showPagination', true);
    fixture.componentRef.setInput('pageSize', 25);
    fixture.detectChanges();

    expect(component.pageSize()).toBe(25);
  });

  it('should display total items count', () => {
    fixture.componentRef.setInput('houses', mockHouses);
    fixture.componentRef.setInput('showPagination', true);
    fixture.componentRef.setInput('totalItems', 100);
    fixture.detectChanges();

    const totalText = fixture.nativeElement.querySelector('.text-muted');
    expect(totalText?.textContent).toContain('100');
  });

  it('should update data source when houses input changes', () => {
    fixture.componentRef.setInput('houses', mockHouses);
    fixture.detectChanges();

    expect(component.dataSource.data.length).toBe(2);

    const newHouses = [mockHouses[0]];
    fixture.componentRef.setInput('houses', newHouses);
    fixture.detectChanges();

    expect(component.dataSource.data.length).toBe(1);
  });
});
