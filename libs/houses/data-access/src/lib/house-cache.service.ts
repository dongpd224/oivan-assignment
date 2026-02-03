import { Injectable } from '@angular/core';
import { HouseModel, HouseFilterModel } from '../../../domain/src';
import { PaginationRequestModel } from '../../../../../shared/domain/src';

interface CachedHouseData {
  houses: HouseModel[];
  totalCount: number;
  totalPages: number;
  timestamp: number;
}

interface CacheEntry {
  data: CachedHouseData;
  expiry: number;
}

interface HouseCacheEntry {
  house: HouseModel;
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

  getHouse(id: string): HouseModel | null {
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

  setHouse(id: string, house: HouseModel): void {
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

  getCacheStats(): {
    listCacheSize: number;
    houseCacheSize: number;
    oldestEntry: number | null;
    newestEntry: number | null;
  } {
    let oldestTimestamp: number | null = null;
    let newestTimestamp: number | null = null;
    
    // Check list cache timestamps
    for (const entry of this.cache.values()) {
      const timestamp = entry.data.timestamp;
      if (oldestTimestamp === null || timestamp < oldestTimestamp) {
        oldestTimestamp = timestamp;
      }
      if (newestTimestamp === null || timestamp > newestTimestamp) {
        newestTimestamp = timestamp;
      }
    }
    
    return {
      listCacheSize: this.cache.size,
      houseCacheSize: this.houseCache.size,
      oldestEntry: oldestTimestamp,
      newestEntry: newestTimestamp
    };
  }

  isCacheValid(key: string): boolean {
    const entry = this.cache.get(key);
    return entry ? Date.now() <= entry.expiry : false;
  }

  isHouseCacheValid(id: string): boolean {
    const entry = this.houseCache.get(id);
    return entry ? Date.now() <= entry.expiry : false;
  }

  getFilteredCacheKeys(filterPattern: string): string[] {
    return Array.from(this.cache.keys()).filter(key => 
      key.includes(filterPattern)
    );
  }

  invalidateFilteredCache(filterPattern: string): void {
    const keysToRemove = this.getFilteredCacheKeys(filterPattern);
    keysToRemove.forEach(key => this.cache.delete(key));
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now();
    
    // Clean up list cache
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
    
    // Clean up house cache
    for (const [id, entry] of this.houseCache.entries()) {
      if (now > entry.expiry) {
        this.houseCache.delete(id);
      }
    }
  }
}