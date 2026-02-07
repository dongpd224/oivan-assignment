import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { HouseApiService } from './house-api.service';
import { HouseDetailModel, HouseStatus, HouseType } from '@oivan/houses/domain';

describe('HouseApiService', () => {
  let service: HouseApiService;
  let httpMock: HttpTestingController;

  const mockHouseResponse = {
    data: [
      {
        id: '1',
        type: 'houses',
        links: { self: 'http://example.com/houses/1' },
        attributes: {
          house_number: 'H-001',
          price: 1000000000,
          block_number: 'A',
          land_number: '01',
          house_type: HouseType.VILLA,
          model: 'Model A',
          status: HouseStatus.AVAILABLE
        }
      }
    ],
    meta: { record_count: 1 }
  };

  const mockModelsResponse = {
    data: [
      { id: '1', model: 'Model A' },
      { id: '2', model: 'Model B' }
    ],
    meta: { record_count: 2 }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HouseApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(HouseApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getHouses', () => {
    it('should fetch houses', () => {
      service.getHouses().subscribe(response => {
        expect(response.data).toBeTruthy();
        expect(response.meta.record_count).toBe(1);
      });

      const req = httpMock.expectOne('api/houses');
      expect(req.request.method).toBe('GET');
      req.flush(mockHouseResponse);
    });
  });

  describe('getModels', () => {
    it('should fetch house models', () => {
      service.getModels().subscribe(response => {
        expect(response.data).toBeTruthy();
        expect(response.meta.record_count).toBe(2);
      });

      const req = httpMock.expectOne('api/house_models');
      expect(req.request.method).toBe('GET');
      req.flush(mockModelsResponse);
    });
  });

  describe('getHousesAndModels', () => {
    it('should fetch both houses and models', () => {
      service.getHousesAndModels().subscribe(response => {
        expect(response.houses).toBeTruthy();
        expect(response.models).toBeTruthy();
      });

      const modelsReq = httpMock.expectOne('api/house_models');
      modelsReq.flush(mockModelsResponse);

      const housesReq = httpMock.expectOne('api/houses');
      housesReq.flush(mockHouseResponse);
    });
  });

  describe('getHouseById', () => {
    it('should fetch a single house by id', () => {
      service.getHouseById('1').subscribe(response => {
        expect(response.data).toBeTruthy();
      });

      const req = httpMock.expectOne('api/houses/1');
      expect(req.request.method).toBe('GET');
      req.flush({ data: mockHouseResponse.data[0], meta: { record_count: 1 } });
    });
  });

  describe('createHouse', () => {
    it('should create a new house', () => {
      const newHouse = new HouseDetailModel({
        houseNumber: 'H-002',
        blockNumber: 'B',
        landNumber: '02',
        houseType: HouseType.TOWNHOUSE,
        model: 'Model B',
        price: 500000000,
        status: HouseStatus.AVAILABLE
      }, false);

      service.createHouse(newHouse).subscribe(response => {
        expect(response.data).toBeTruthy();
      });

      const req = httpMock.expectOne('api/houses');
      expect(req.request.method).toBe('POST');
      expect(req.request.body.attributes.house_number).toBe('H-002');
      req.flush({ data: { id: '2', ...newHouse }, meta: { record_count: 1 } });
    });
  });

  describe('updateHouse', () => {
    it('should update an existing house', () => {
      const updatedHouse = new HouseDetailModel({
        id: '1',
        houseNumber: 'H-001',
        blockNumber: 'A',
        landNumber: '01',
        houseType: HouseType.VILLA,
        model: 'Model A',
        price: 1200000000,
        status: HouseStatus.BOOKED
      }, false);

      service.updateHouse('1', updatedHouse).subscribe(response => {
        expect(response.data).toBeTruthy();
      });

      const req = httpMock.expectOne('api/houses/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.attributes.price).toBe(1200000000);
      req.flush({ data: updatedHouse, meta: { record_count: 1 } });
    });
  });

  describe('deleteHouse', () => {
    it('should delete a house', () => {
      service.deleteHouse('1').subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne('api/houses/1');
      expect(req.request.method).toBe('DELETE');
      req.flush({ data: null, meta: { record_count: 0 } });
    });
  });
});
