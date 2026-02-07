import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HouseFormComponent } from './house-form.component';
import { HouseDetailModel, HouseStatus, HouseType, HouseModelModel } from '@oivan/houses/domain';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

describe('HouseFormComponent', () => {
  let component: HouseFormComponent;
  let fixture: ComponentFixture<HouseFormComponent>;

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

  const mockHouseModels: HouseModelModel[] = [
    { model: 'Model A', id: '1' } as HouseModelModel,
    { model: 'Model B', id: '2' } as HouseModelModel
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseFormComponent, NoopAnimationsModule, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HouseFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values in create mode', () => {
    fixture.detectChanges();
    expect(component.houseForm.get('houseNumber')?.value).toBe('');
    expect(component.houseForm.get('blockNumber')?.value).toBe('');
    expect(component.houseForm.get('price')?.value).toBe(0);
    expect(component.isEditMode).toBeFalsy();
  });

  it('should populate form with house data in edit mode', () => {
    fixture.componentRef.setInput('house', mockHouse);
    fixture.componentRef.setInput('houseModels', mockHouseModels);
    fixture.detectChanges();

    expect(component.houseForm.get('houseNumber')?.value).toBe('H-001');
    expect(component.houseForm.get('blockNumber')?.value).toBe('A');
    expect(component.houseForm.get('landNumber')?.value).toBe('01');
    expect(component.houseForm.get('houseType')?.value).toBe(HouseType.VILLA);
    expect(component.houseForm.get('model')?.value).toBe('Model A');
    expect(component.houseForm.get('price')?.value).toBe(1000000000);
    expect(component.houseForm.get('status')?.value).toBe(HouseStatus.AVAILABLE);
    expect(component.isEditMode).toBeTruthy();
  });

  it('should have required validators on all fields', () => {
    fixture.detectChanges();
    
    expect(component.houseForm.get('houseNumber')?.hasError('required')).toBeTruthy();
    expect(component.houseForm.get('blockNumber')?.hasError('required')).toBeTruthy();
    expect(component.houseForm.get('landNumber')?.hasError('required')).toBeTruthy();
    expect(component.houseForm.get('houseType')?.hasError('required')).toBeTruthy();
    expect(component.houseForm.get('model')?.hasError('required')).toBeTruthy();
  });

  it('should have min validator on price field', () => {
    fixture.detectChanges();
    component.houseForm.patchValue({ price: 0 });
    
    expect(component.houseForm.get('price')?.hasError('min')).toBeTruthy();
  });

  it('should emit formSubmit with house data when form is valid', () => {
    fixture.componentRef.setInput('houseModels', mockHouseModels);
    fixture.detectChanges();

    const submitSpy = vi.fn();
    component.formSubmit.subscribe(submitSpy);

    component.houseForm.patchValue({
      houseNumber: 'H-002',
      blockNumber: 'B',
      landNumber: '02',
      houseType: HouseType.TOWNHOUSE,
      model: 'Model B',
      price: 500000000,
      status: HouseStatus.AVAILABLE
    });

    component.onSubmit();

    expect(submitSpy).toHaveBeenCalled();
    const emittedHouse = submitSpy.mock.calls[0][0];
    expect(emittedHouse.houseNumber).toBe('H-002');
    expect(emittedHouse.blockNumber).toBe('B');
  });

  it('should not emit formSubmit when form is invalid', () => {
    fixture.detectChanges();
    const submitSpy = vi.fn();
    component.formSubmit.subscribe(submitSpy);

    component.onSubmit();

    expect(submitSpy).not.toHaveBeenCalled();
  });

  it('should emit formCancel when cancel is clicked', () => {
    fixture.detectChanges();
    const cancelSpy = vi.fn();
    component.formCancel.subscribe(cancelSpy);

    component.onCancel();

    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should detect duplicate house numbers', async () => {
    const existingHouses = [
      new HouseDetailModel({ id: '2', houseNumber: 'H-002' }, false)
    ];
    fixture.componentRef.setInput('houses', existingHouses);
    fixture.detectChanges();

    component.houseForm.get('houseNumber')?.setValue('H-002');
    
    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 350));
    fixture.detectChanges();

    expect(component.houseForm.get('houseNumber')?.hasError('duplicate')).toBeTruthy();
  });

  it('should not flag duplicate for same house in edit mode', async () => {
    const existingHouses = [mockHouse];
    fixture.componentRef.setInput('house', mockHouse);
    fixture.componentRef.setInput('houses', existingHouses);
    fixture.detectChanges();

    component.houseForm.get('houseNumber')?.setValue('H-001');
    
    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 350));
    fixture.detectChanges();

    expect(component.houseForm.get('houseNumber')?.hasError('duplicate')).toBeFalsy();
  });

  it('should add media to list', () => {
    fixture.detectChanges();
    component.addMedia('http://example.com/image.jpg');
    
    expect(component.mediaList).toContain('http://example.com/image.jpg');
  });

  it('should not add duplicate media', () => {
    fixture.detectChanges();
    component.addMedia('http://example.com/image.jpg');
    component.addMedia('http://example.com/image.jpg');
    
    expect(component.mediaList.length).toBe(1);
  });

  it('should remove media from list', () => {
    fixture.detectChanges();
    component.addMedia('http://example.com/image1.jpg');
    component.addMedia('http://example.com/image2.jpg');
    component.removeMedia(0);
    
    expect(component.mediaList.length).toBe(1);
    expect(component.mediaList[0]).toBe('http://example.com/image2.jpg');
  });

  it('should disable submit button when submitting', () => {
    fixture.componentRef.setInput('isSubmitting', true);
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[color="primary"]');
    expect(submitButton?.disabled).toBeTruthy();
  });

  it('should show correct button text based on mode', () => {
    fixture.detectChanges();
    let submitButton = fixture.nativeElement.querySelector('button[color="primary"]');
    expect(submitButton?.textContent).toContain('Create House');

    fixture.componentRef.setInput('house', mockHouse);
    fixture.detectChanges();
    submitButton = fixture.nativeElement.querySelector('button[color="primary"]');
    expect(submitButton?.textContent).toContain('Update House');
  });
});
