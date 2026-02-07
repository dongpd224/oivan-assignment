import { beforeEach, describe, expect, it } from 'vitest';
import { HouseFilterModel, HOUSE_FILTER_MAPPING_FIELD } from './house-filter.model';
import { HouseType, HouseStatus } from './house.model';

describe('HouseFilterModel', () => {
  const mockBackendResponse = {
    blockNumber: 'A',
    landNumber: '01',
    minPrice: 500000000,
    maxPrice: 1000000000,
    houseType: HouseType.VILLA,
    status: HouseStatus.AVAILABLE,
    sortBy: 'price',
    sortOrder: 'desc'
  };

  const mockFrontendData = {
    blockNumber: 'A',
    landNumber: '01',
    priceRange: { min: 500000000, max: 1000000000 },
    houseType: HouseType.VILLA,
    status: HouseStatus.AVAILABLE,
    sortBy: 'price' as const,
    sortOrder: 'desc' as const
  };

  describe('constructor', () => {
    it('should parse from backend response correctly', () => {
      const filter = new HouseFilterModel(mockBackendResponse, true);

      expect(filter.blockNumber).toBe('A');
      expect(filter.landNumber).toBe('01');
      expect(filter.priceRange?.min).toBe(500000000);
      expect(filter.priceRange?.max).toBe(1000000000);
      expect(filter.houseType).toBe(HouseType.VILLA);
      expect(filter.status).toBe(HouseStatus.AVAILABLE);
      expect(filter.sortBy).toBe('price');
      expect(filter.sortOrder).toBe('desc');
    });

    it('should parse from frontend data correctly', () => {
      const filter = new HouseFilterModel(mockFrontendData, false);

      expect(filter.blockNumber).toBe('A');
      expect(filter.landNumber).toBe('01');
      expect(filter.priceRange?.min).toBe(500000000);
      expect(filter.priceRange?.max).toBe(1000000000);
      expect(filter.houseType).toBe(HouseType.VILLA);
      expect(filter.status).toBe(HouseStatus.AVAILABLE);
      expect(filter.sortBy).toBe('price');
      expect(filter.sortOrder).toBe('desc');
    });

    it('should handle partial data', () => {
      const partialData = { blockNumber: 'B' };
      const filter = new HouseFilterModel(partialData, false);

      expect(filter.blockNumber).toBe('B');
      expect(filter.landNumber).toBeUndefined();
      expect(filter.priceRange).toBeUndefined();
    });
  });

  describe('convertToReqBody', () => {
    it('should convert to request body format', () => {
      const filter = new HouseFilterModel(mockFrontendData, false);
      const reqBody = filter.convertToReqBody();

      expect(reqBody[HOUSE_FILTER_MAPPING_FIELD.blockNumber]).toBe('A');
      expect(reqBody[HOUSE_FILTER_MAPPING_FIELD.landNumber]).toBe('01');
      expect(reqBody[HOUSE_FILTER_MAPPING_FIELD.minPrice]).toBe(500000000);
      expect(reqBody[HOUSE_FILTER_MAPPING_FIELD.maxPrice]).toBe(1000000000);
      expect(reqBody[HOUSE_FILTER_MAPPING_FIELD.houseType]).toBe(HouseType.VILLA);
      expect(reqBody[HOUSE_FILTER_MAPPING_FIELD.status]).toBe(HouseStatus.AVAILABLE);
      expect(reqBody[HOUSE_FILTER_MAPPING_FIELD.sortBy]).toBe('price');
      expect(reqBody[HOUSE_FILTER_MAPPING_FIELD.sortOrder]).toBe('desc');
    });

    it('should handle undefined price range', () => {
      const dataWithoutPrice = { blockNumber: 'A' };
      const filter = new HouseFilterModel(dataWithoutPrice, false);
      const reqBody = filter.convertToReqBody();

      expect(reqBody[HOUSE_FILTER_MAPPING_FIELD.minPrice]).toBeUndefined();
      expect(reqBody[HOUSE_FILTER_MAPPING_FIELD.maxPrice]).toBeUndefined();
    });
  });
});
