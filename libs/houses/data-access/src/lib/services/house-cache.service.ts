import { Injectable } from '@angular/core';
import { HouseDetailModel, HouseFilterModel, GroupedHouseModel } from '@oivan/houses/domain';
import { PaginationRequestModel } from '@oivan/shared/domain';

interface CachedHouseData {
  houses: HouseDetailModel[];
  groupedHouses?: GroupedHouseModel[];
  totalCount: number;
  totalPages: number;
  timestamp: number;
}

interface CacheEntry {
  data: CachedHouseData;
  expiry: number;
}

interface HouseCacheEntry {
  house: HouseDetailModel;
  expiry: number;
}

@Injectable({
  providedIn: 'root'
})
export class HouseCacheService {
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly HOUSE_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for individual houses
  private readonly cache = new Map<string, CacheEntry>();
  private readonly houseCache = new Map<string, HouseCacheEntry>();

  constructor() {
    // Clean up expired cache entries periodically
    setInterval(() => this.cleanupExpiredEntries(), 60 * 1000); // Every minute
  }

  generateCacheKey(pagination?: PaginationRequestModel, filter?: HouseFilterModel): string {
    const parts: string[] = ['houses'];
    
    if (pagination) {
      const paginationData = pagination.convertToReqBody();
      parts.push(`page:${paginationData.page}`);
      parts.push(`limit:${paginationData.limit}`);
    }
    
    if (filter) {
      const filterData = filter.convertToReqBody();
      Object.entries(filterData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          parts.push(`${key}:${value}`);
        }
      });
    }
    
    return parts.join('|');
  }


  get(key: string): CachedHouseData | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  set(key: string, data: CachedHouseData): void {
    const entry: CacheEntry = {
      data: {
        ...data,
        timestamp: Date.now()
      },
      expiry: Date.now() + this.CACHE_DURATION
    };
    
    this.cache.set(key, entry);
  }

  getHouse(id: string): HouseDetailModel | null {
    const entry = this.houseCache.get(id);
    
    if (!entry) {
      return null;
    }
    
    if (Date.now() > entry.expiry) {
      this.houseCache.delete(id);
      return null;
    }
    
    return entry.house;
  }

  setHouse(id: string, house: HouseDetailModel): void {
    const entry: HouseCacheEntry = {
      house,
      expiry: Date.now() + this.HOUSE_CACHE_DURATION
    };
    
    this.houseCache.set(id, entry);
  }

  removeHouse(id: string): void {
    this.houseCache.delete(id);
  }

  clear(): void {
    this.cache.clear();
  }

  clearHouseCache(): void {
    this.houseCache.clear();
  }

  clearAll(): void {
    this.clear();
    this.clearHouseCache();
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
    
    for (const [id, entry] of this.houseCache.entries()) {
      if (now > entry.expiry) {
        this.houseCache.delete(id);
      }
    }
  }
}
