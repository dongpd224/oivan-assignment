import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HouseDetailComponent } from './house-detail.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';
import { of, Subject } from 'rxjs';
import { HouseFacade } from '@oivan/houses/data-access';
import { HouseDetailModel, HouseStatus, HouseType, HouseModelModel } from '@oivan/houses/domain';

describe('HouseDetailComponent', () => {
  let component: HouseDetailComponent;
  let fixture: ComponentFixture<HouseDetailComponent>;
  let mockHouseFacade: Partial<HouseFacade>;
  let router: Router;
  let urlSubject: Subject<any>;
  let paramsSubject: Subject<any>;

  const mockHouse = new HouseDetailModel({
    id: '1',
    houseNumber: 'H-001',
    blockNumber: 'A',
    landNumber: '01',
    houseType: HouseType.VILLA,
    model: 'Model A',
    price: 1000000000,
    status: HouseStatus.AVAILABLE
  }, false);

  const mockHouseModels: HouseModelModel[] = [
    { model: 'Model A', id: '1' } as HouseModelModel,
    { model: 'Model B', id: '2' } as HouseModelModel
  ];

  beforeEach(async () => {
    urlSubject = new Subject();
    paramsSubject = new Subject();

    mockHouseFacade = {
      selectedHouseSignal: signal(mockHouse),
      houseModelsSignal: signal(mockHouseModels),
      housesSignal: signal([mockHouse]),
      isLoadingSignal: signal(false),
      errorSignal: signal(null),
      selectedHouse$: of(mockHouse),
      isLoading$: of(false),
      totalCount$: of(1),
      loadHouseModels: vi.fn(),
      updateHouse: vi.fn(),
      createHouse: vi.fn(),
      clearSelectedHouse: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [HouseDetailComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: HouseFacade, useValue: mockHouseFacade },
        {
          provide: ActivatedRoute,
          useValue: {
            url: urlSubject.asObservable(),
            params: paramsSubject.asObservable(),
            snapshot: { params: { id: '1' } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HouseDetailComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load house models on init', () => {
    expect(mockHouseFacade.loadHouseModels).toHaveBeenCalled();
  });

  it('should set create mode when URL is create', () => {
    urlSubject.next([{ path: 'create' }]);
    expect(component.isCreateMode).toBeTruthy();
  });

  it('should set edit mode when URL ends with edit', () => {
    urlSubject.next([{ path: '1' }, { path: 'edit' }]);
    expect(component.isEditMode).toBeTruthy();
  });

  it('should return correct page title for create mode', () => {
    component.isCreateMode = true;
    expect(component.pageTitle).toBe('Create New House');
  });

  it('should return correct page title for edit mode', () => {
    component.isEditMode = true;
    expect(component.pageTitle).toBe('Edit House');
  });

  it('should return correct page title for view mode', () => {
    component.isCreateMode = false;
    component.isEditMode = false;
    expect(component.pageTitle).toBe('House Details');
  });

  it('should navigate to edit when editHouse is called', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.editHouse();
    expect(navigateSpy).toHaveBeenCalledWith(['/houses', '1', 'edit']);
  });

  it('should navigate back and clear selected house', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.goBack();
    expect(mockHouseFacade.clearSelectedHouse).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/houses']);
  });

  it('should extract media file name from URL', () => {
    const fileName = component.getMediaFileName('http://example.com/images/photo.jpg');
    expect(fileName).toBe('photo.jpg');
  });

  it('should return full URL if no file name after split', () => {
    const fileName = component.getMediaFileName('http://example.com/');
    // pop() returns '' which is falsy, so || url returns the full URL
    expect(fileName).toBe('http://example.com/');
  });

  it('should open image in new window', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    component.openImage('http://example.com/image.jpg');
    expect(openSpy).toHaveBeenCalledWith('http://example.com/image.jpg', '_blank');
  });

  it('should call updateHouse when submitting in edit mode', () => {
    component.isEditMode = true;
    component.onFormSubmit(mockHouse);
    expect(mockHouseFacade.updateHouse).toHaveBeenCalledWith('1', mockHouse);
  });

  it('should call createHouse when submitting in create mode', () => {
    component.isCreateMode = true;
    component.isEditMode = false;
    component.onFormSubmit(mockHouse);
    expect(mockHouseFacade.createHouse).toHaveBeenCalledWith(mockHouse);
  });

  it('should navigate to house detail on cancel in edit mode', () => {
    component.isEditMode = true;
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.onFormCancel();
    expect(navigateSpy).toHaveBeenCalledWith(['/houses', '1']);
  });

  it('should navigate to houses list on cancel in create mode', () => {
    component.isEditMode = false;
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.onFormCancel();
    expect(navigateSpy).toHaveBeenCalledWith(['/houses']);
  });

  it('should return true for isFormMode when in create mode', () => {
    component.isCreateMode = true;
    expect(component.isFormMode).toBeTruthy();
  });

  it('should return true for isFormMode when in edit mode', () => {
    component.isEditMode = true;
    expect(component.isFormMode).toBeTruthy();
  });

  it('should return false for isFormMode when in view mode', () => {
    component.isCreateMode = false;
    component.isEditMode = false;
    expect(component.isFormMode).toBeFalsy();
  });
});
