# Design Document: House Model Grouping

## Overview

Tính năng này mở rộng hệ thống quản lý houses hiện tại để nhóm các houses theo model tương ứng. Khi API trả về danh sách houses và models, hệ thống sẽ tự động nhóm houses dựa trên việc so sánh `house.model` với `model.model`. Giao diện sẽ hiển thị các nhóm này trong Mat-Accordion, mỗi expansion panel chứa thông tin media của model và bảng danh sách houses.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        House List Component                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    House Filter Component                    ││
│  └─────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                      Mat-Accordion                           ││
│  │  ┌─────────────────────────────────────────────────────────┐││
│  │  │ Mat-Expansion-Panel (Model 1)                           │││
│  │  │  ├─ Header: Model Name                                  │││
│  │  │  └─ Content:                                            │││
│  │  │      ├─ Model Media Section (title, banner, video, desc)│││
│  │  │      └─ House Table Component                           │││
│  │  └─────────────────────────────────────────────────────────┘││
│  │  ┌─────────────────────────────────────────────────────────┐││
│  │  │ Mat-Expansion-Panel (Model 2)                           │││
│  │  │  └─ ...                                                 │││
│  │  └─────────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
API Response (houses + models)
        │
        ▼
┌───────────────────┐
│   House Effect    │
│  (loadHouses$)    │
│   - Parse data    │
│   - Group houses  │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  loadHousesSuccess│
│  Action with:     │
│  - houses[]       │
│  - groupedHouses[]│
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│   House Reducer   │
│  - Update state   │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  House Selectors  │
│  - selectGrouped  │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│   House Facade    │
│  - groupedHouses$ │
│  - groupedSignal  │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ House List Comp   │
│  - Mat-Accordion  │
└───────────────────┘
```

## Components and Interfaces

### 1. GroupedHouseModel (Domain Model)

```typescript
// libs/houses/domain/src/lib/grouped-house-model.model.ts

import { HouseModelModel } from './house-model.model';
import { HouseDetailModel } from './house.model';

export class GroupedHouseModel {
  model: HouseModelModel;
  houses: HouseDetailModel[];

  constructor(model: HouseModelModel, houses: HouseDetailModel[] = []) {
    this.model = model;
    this.houses = houses;
  }

  get housesCount(): number {
    return this.houses.length;
  }

  get modelName(): string {
    return this.model.model;
  }

  get mediaTitle(): string {
    return this.model.media?.title || '';
  }

  get mediaBanner(): string {
    return this.model.media?.banner || '';
  }

  get mediaVideo(): string {
    return this.model.media?.video || '';
  }

  get mediaDescription(): string {
    return this.model.media?.description || '';
  }

  hasVideo(): boolean {
    return !!this.model.media?.video;
  }
}
```

### 2. Grouping Utility Function

```typescript
// libs/houses/data-access/src/lib/utils/house-grouping.util.ts

import { HouseDetailModel, HouseModelModel, GroupedHouseModel } from '@oivan/houses/domain';

export function groupHousesByModel(
  houses: HouseDetailModel[],
  models: HouseModelModel[]
): GroupedHouseModel[] {
  const modelMap = new Map<string, HouseModelModel>();
  
  // Create a map of model name to HouseModelModel
  models.forEach(model => {
    modelMap.set(model.model, model);
  });

  // Group houses by their model attribute
  const groupedMap = new Map<string, HouseDetailModel[]>();
  
  houses.forEach(house => {
    const modelName = house.model;
    if (modelMap.has(modelName)) {
      if (!groupedMap.has(modelName)) {
        groupedMap.set(modelName, []);
      }
      groupedMap.get(modelName)!.push(house);
    }
  });

  // Create GroupedHouseModel instances
  const result: GroupedHouseModel[] = [];
  
  groupedMap.forEach((houseList, modelName) => {
    const model = modelMap.get(modelName)!;
    result.push(new GroupedHouseModel(model, houseList));
  });

  return result;
}
```

### 3. Updated House State Interface

```typescript
// libs/houses/data-access/src/lib/state/house.reducer.ts (updated interface)

export interface HouseState {
  houses: HouseDetailModel[];
  groupedHouses: GroupedHouseModel[];  // NEW
  selectedHouse: HouseDetailModel | null;
  currentFilter: HouseFilterModel | null;
  currentPagination: PaginationRequestModel | null;
  totalCount: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  houseModels: HouseModelModel[];
  selectedHouseModel: HouseModelModel | null;
  isLoadingHouseModels: boolean;
  houseModelError: string | null;
}
```

### 4. Updated Actions

```typescript
// libs/houses/data-access/src/lib/state/house.actions.ts (updated)

export const loadHousesSuccess = createAction(
  '[House] Load Houses Success',
  props<{ 
    houses: HouseDetailModel[]; 
    groupedHouses: GroupedHouseModel[];  // NEW
    totalCount: number; 
    totalPages: number;
    pagination?: PaginationRequestModel;
    filter?: HouseFilterModel;
  }>()
);
```

### 5. Updated Selectors

```typescript
// libs/houses/data-access/src/lib/state/house.selectors.ts (new selector)

export const selectGroupedHouses = createSelector(
  selectHouseState,
  (state: HouseState) => state.groupedHouses
);

export const selectNonEmptyGroupedHouses = createSelector(
  selectGroupedHouses,
  (groupedHouses: GroupedHouseModel[]) => 
    groupedHouses.filter(group => group.housesCount > 0)
);
```

### 6. Updated Facade

```typescript
// libs/houses/data-access/src/lib/state/house.facade.ts (additions)

// Observable
groupedHouses$ = this.store.select(HouseSelectors.selectGroupedHouses);
nonEmptyGroupedHouses$ = this.store.select(HouseSelectors.selectNonEmptyGroupedHouses);

// Signals
groupedHousesSignal = toSignal(this.groupedHouses$, { initialValue: [] });
nonEmptyGroupedHousesSignal = toSignal(this.nonEmptyGroupedHouses$, { initialValue: [] });
```

### 7. House List Component Template Structure

```html
<!-- libs/houses/feature/src/lib/house-list/house-list.component.html -->

<div class="house-list-container">
  <!-- Filter Section -->
  <div class="filter-section">
    <lib-houses-house-filter ...></lib-houses-house-filter>
  </div>

  <!-- Accordion Section -->
  <mat-accordion class="house-models-accordion" multi>
    @for (group of groupedHouses(); track group.model.id) {
      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title>
            {{ group.modelName }} ({{ group.housesCount }} houses)
          </mat-panel-title>
        </mat-expansion-panel-header>

        <!-- Model Media Section -->
        <div class="model-media-section">
          <div class="media-content">
            <h3 class="media-title">{{ group.mediaTitle }}</h3>
            <p class="media-description">{{ group.mediaDescription }}</p>
            @if (group.hasVideo()) {
              <a [href]="group.mediaVideo" target="_blank" class="video-link">
                Watch Video
              </a>
            }
          </div>
          @if (group.mediaBanner) {
            <img [src]="group.mediaBanner" 
                 [alt]="group.mediaTitle" 
                 class="media-banner">
          }
        </div>

        <!-- Houses Table -->
        <lib-houses-house-table
          [houses]="group.houses"
          [showEditActions]="isAuthenticated()"
          (viewDetails)="onViewDetails($event)"
          (edit)="onEditHouse($event)">
        </lib-houses-house-table>
      </mat-expansion-panel>
    }
  </mat-accordion>
</div>
```

## Data Models

### GroupedHouseModel

| Property | Type | Description |
|----------|------|-------------|
| model | HouseModelModel | The house model information |
| houses | HouseDetailModel[] | Array of houses belonging to this model |

### HouseModelModel (existing)

| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique identifier |
| type | string | Entity type |
| model | string | Model name/identifier |
| media | HouseModelMedia | Media information |
| houseType | string | Type of house |

### HouseModelMedia (existing)

| Property | Type | Description |
|----------|------|-------------|
| title | string | Media title |
| video | string | Video URL |
| banner | string | Banner image URL |
| description | string | Description text |

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: GroupedHouseModel Structure Integrity

*For any* GroupedHouseModel instance, it SHALL contain a valid HouseModelModel and an array of HouseDetailModel, and the housesCount method SHALL return the exact length of the houses array.

**Validates: Requirements 1.1, 1.2, 1.3**

### Property 2: Grouping Correctness by Model Match

*For any* set of houses and models, when grouping is performed, every house in a GroupedHouseModel SHALL have its `model` attribute equal to the GroupedHouseModel's `model.model` attribute.

**Validates: Requirements 2.1**

### Property 3: Unique Model Groups

*For any* set of houses and models, the grouping function SHALL produce exactly one GroupedHouseModel for each unique model that has at least one matching house.

**Validates: Requirements 2.2**

### Property 4: Unmatched Houses Exclusion

*For any* house whose `model` attribute does not match any HouseModelModel's `model` attribute, that house SHALL NOT appear in any GroupedHouseModel's houses array.

**Validates: Requirements 2.3**

### Property 5: State Update Consistency

*For any* loadHousesSuccess action dispatched with groupedHouses, the reducer SHALL update the state's groupedHouses to exactly match the action's groupedHouses payload.

**Validates: Requirements 3.2, 3.3**

### Property 6: Filter Then Group Order

*For any* filter applied to houses, the grouping SHALL be performed on the filtered result, meaning the total count of houses across all groups SHALL equal the count of filtered houses that have matching models.

**Validates: Requirements 6.1, 6.2**

### Property 7: Panel Header Model Name Display

*For any* GroupedHouseModel displayed in the accordion, the expansion panel header SHALL contain the model name from `group.modelName`.

**Validates: Requirements 4.2**

## Error Handling

| Scenario | Handling |
|----------|----------|
| API returns empty houses array | Display empty state message, no accordion panels |
| API returns empty models array | Display houses in flat list (fallback), log warning |
| House model doesn't match any HouseModel | Exclude from grouped view, include in flat houses list |
| Model media fields are null/undefined | Display placeholder or hide element gracefully |
| Network error during load | Display error message with retry option |

## Testing Strategy

### Unit Tests

1. **GroupedHouseModel class tests**
   - Test constructor with valid model and houses
   - Test getter methods (housesCount, modelName, media getters)
   - Test hasVideo() method with and without video URL

2. **Grouping utility function tests**
   - Test with matching houses and models
   - Test with houses that don't match any model
   - Test with empty houses array
   - Test with empty models array

3. **Reducer tests**
   - Test loadHousesSuccess updates groupedHouses state
   - Test initial state has empty groupedHouses array

4. **Selector tests**
   - Test selectGroupedHouses returns correct data
   - Test selectNonEmptyGroupedHouses filters empty groups

### Property-Based Tests

Property-based testing will be used to validate the correctness properties defined above. We will use a property-based testing library (e.g., fast-check for TypeScript) to generate random inputs and verify properties hold.

**Test Configuration:**
- Minimum 100 iterations per property test
- Each test tagged with: **Feature: house-model-grouping, Property {number}: {property_text}**

**Property Tests to Implement:**
1. GroupedHouseModel structure validation
2. Grouping correctness - model matching
3. Unique model groups creation
4. Unmatched houses exclusion
5. State update consistency
6. Filter then group ordering

### Integration Tests

1. **Effect integration tests**
   - Test loadHouses$ effect produces correct grouped output
   - Test caching behavior with grouped data

2. **Component integration tests**
   - Test accordion renders correct number of panels
   - Test panel expansion shows media and table
   - Test filter interaction with grouped view
