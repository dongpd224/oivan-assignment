import { beforeEach, describe, expect, it } from 'vitest';
import { HouseDetailModel, HouseStatus, HouseType, HOUSE_MAPPING_FIELD, HOUSE_ATTRIBUTES_MAPPING_FIELD } from './house.model';

describe('HouseDetailModel', () => {
  const mockBackendResponse = {
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
  };

  const mockFrontendData = {
    id: '1',
    type: 'houses',
    links: { self: 'http://example.com/houses/1' },
    houseNumber: 'H-001',
    price: 1000000000,
    blockNumber: 'A',
    landNumber: '01',
    houseType: HouseType.VILLA,
    model: 'Model A',
    status: HouseStatus.AVAILABLE
  };

  describe('constructor', () => {
    it('should parse from backend response correctly', () => {
      const house = new HouseDetailModel(mockBackendResponse, true);

      expect(house.id).toBe('1');
      expect(house.type).toBe('houses');
      expect(house.links.self).toBe('http://example.com/houses/1');
      expect(house.houseNumber).toBe('H-001');
      expect(house.price).toBe(1000000000);
      expect(house.blockNumber).toBe('A');
      expect(house.landNumber).toBe('01');
      expect(house.houseType).toBe(HouseType.VILLA);
      expect(house.model).toBe('Model A');
      expect(house.status).toBe(HouseStatus.AVAILABLE);
    });

    it('should parse from frontend data correctly', () => {
      const house = new HouseDetailModel(mockFrontendData, false);

      expect(house.id).toBe('1');
      expect(house.houseNumber).toBe('H-001');
      expect(house.price).toBe(1000000000);
      expect(house.blockNumber).toBe('A');
      expect(house.landNumber).toBe('01');
      expect(house.houseType).toBe(HouseType.VILLA);
      expect(house.model).toBe('Model A');
      expect(house.status).toBe(HouseStatus.AVAILABLE);
    });
  });

  describe('convertToReqBody', () => {
    it('should convert to request body format', () => {
      const house = new HouseDetailModel(mockFrontendData, false);
      const reqBody = house.convertToReqBody();

      expect(reqBody[HOUSE_MAPPING_FIELD.id]).toBe('1');
      expect(reqBody[HOUSE_MAPPING_FIELD.type]).toBe('houses');
      expect(reqBody[HOUSE_MAPPING_FIELD.attributes][HOUSE_ATTRIBUTES_MAPPING_FIELD.houseNumber]).toBe('H-001');
      expect(reqBody[HOUSE_MAPPING_FIELD.attributes][HOUSE_ATTRIBUTES_MAPPING_FIELD.price]).toBe(1000000000);
      expect(reqBody[HOUSE_MAPPING_FIELD.attributes][HOUSE_ATTRIBUTES_MAPPING_FIELD.blockNumber]).toBe('A');
      expect(reqBody[HOUSE_MAPPING_FIELD.attributes][HOUSE_ATTRIBUTES_MAPPING_FIELD.landNumber]).toBe('01');
      expect(reqBody[HOUSE_MAPPING_FIELD.attributes][HOUSE_ATTRIBUTES_MAPPING_FIELD.houseType]).toBe(HouseType.VILLA);
      expect(reqBody[HOUSE_MAPPING_FIELD.attributes][HOUSE_ATTRIBUTES_MAPPING_FIELD.model]).toBe('Model A');
      expect(reqBody[HOUSE_MAPPING_FIELD.attributes][HOUSE_ATTRIBUTES_MAPPING_FIELD.status]).toBe(HouseStatus.AVAILABLE);
    });

    it('should not include id when not set', () => {
      const dataWithoutId = { ...mockFrontendData, id: undefined };
      const house = new HouseDetailModel(dataWithoutId, false);
      const reqBody = house.convertToReqBody();

      expect(reqBody[HOUSE_MAPPING_FIELD.id]).toBeUndefined();
    });
  });

  describe('getFullHouseNumber', () => {
    it('should return formatted house number', () => {
      const house = new HouseDetailModel(mockFrontendData, false);
      expect(house.getFullHouseNumber()).toBe('A-01-H-001');
    });
  });

  describe('isAvailable', () => {
    it('should return true when status is AVAILABLE', () => {
      const house = new HouseDetailModel(mockFrontendData, false);
      expect(house.isAvailable()).toBeTruthy();
    });

    it('should return false when status is BOOKED', () => {
      const bookedData = { ...mockFrontendData, status: HouseStatus.BOOKED };
      const house = new HouseDetailModel(bookedData, false);
      expect(house.isAvailable()).toBeFalsy();
    });
  });
});

describe('HouseType enum', () => {
  it('should have correct values', () => {
    expect(HouseType.APARTMENT).toBe('apartment');
    expect(HouseType.TOWNHOUSE).toBe('townhouse');
    expect(HouseType.VILLA).toBe('villa');
  });
});

describe('HouseStatus enum', () => {
  it('should have correct values', () => {
    expect(HouseStatus.AVAILABLE).toBe('available');
    expect(HouseStatus.BOOKED).toBe('booked');
  });
});
