import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HouseCardComponent } from './house-card.component';
import { HouseDetailModel, HouseStatus, HouseType } from '@oivan/houses/domain';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('HouseCardComponent', () => {
  let component: HouseCardComponent;
  let fixture: ComponentFixture<HouseCardComponent>;

  const mockHouse = new HouseDetailModel({
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
  }, false);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseCardComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HouseCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('house', mockHouse);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display house number', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.card-title')?.textContent).toContain('A-01-H-001');
  });

  it('should display house type and model', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.card-subtitle')?.textContent).toContain(HouseType.VILLA);
    expect(compiled.querySelector('.card-subtitle')?.textContent).toContain('Model A');
  });

  it('should display block and land numbers', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Block A');
    expect(compiled.textContent).toContain('Land 01');
  });

  it('should display status badge with correct class for available', () => {
    const badge = fixture.nativeElement.querySelector('.badge');
    expect(badge?.textContent?.trim()).toBe(HouseStatus.AVAILABLE);
    expect(badge?.classList.contains('bg-success')).toBeTruthy();
  });

  it('should display status badge with warning class for booked', () => {
    const bookedHouse = new HouseDetailModel({
      ...mockHouse,
      status: HouseStatus.BOOKED
    }, false);
    fixture.componentRef.setInput('house', bookedHouse);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.badge');
    expect(badge?.classList.contains('bg-warning')).toBeTruthy();
  });

  it('should emit viewDetails when view button is clicked', () => {
    const viewDetailsSpy = vi.fn();
    component.viewDetails.subscribe(viewDetailsSpy);

    const viewButton = fixture.nativeElement.querySelector('button[color="primary"]');
    viewButton?.click();

    expect(viewDetailsSpy).toHaveBeenCalledWith(mockHouse);
  });

  it('should not show edit button by default', () => {
    const editButton = fixture.nativeElement.querySelector('button:not([color="primary"])');
    expect(editButton).toBeFalsy();
  });

  it('should show edit button when showEditButton is true', () => {
    fixture.componentRef.setInput('showEditButton', true);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.card-footer button');
    expect(buttons.length).toBe(2);
  });

  it('should emit edit when edit button is clicked', () => {
    fixture.componentRef.setInput('showEditButton', true);
    fixture.detectChanges();

    const editSpy = vi.fn();
    component.edit.subscribe(editSpy);

    const editButton = fixture.nativeElement.querySelectorAll('.card-footer button')[1];
    editButton?.click();

    expect(editSpy).toHaveBeenCalledWith(mockHouse);
  });
});
