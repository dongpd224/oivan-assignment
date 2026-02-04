# Implementation Plan: House Model Grouping

## Overview

Triển khai tính năng nhóm houses theo model, bao gồm tạo domain model mới, cập nhật NgRx state management, và xây dựng UI accordion để hiển thị grouped houses.

## Tasks

- [x] 1. Create GroupedHouseModel domain class
  - Create `libs/houses/domain/src/lib/grouped-house-model.model.ts`
  - Implement constructor với HouseModelModel và HouseDetailModel[]
  - Implement getter methods: housesCount, modelName, mediaTitle, mediaBanner, mediaVideo, mediaDescription
  - Implement hasVideo() method
  - Export từ domain index.ts
  - _Requirements: 1.1, 1.2, 1.3_

- [ ]* 1.1 Write property test for GroupedHouseModel structure
  - **Property 1: GroupedHouseModel Structure Integrity**
  - **Validates: Requirements 1.1, 1.2, 1.3**

- [x] 2. Create house grouping utility function
  - Create `libs/houses/data-access/src/lib/utils/house-grouping.util.ts`
  - Implement `groupHousesByModel(houses, models)` function
  - Handle edge cases: empty arrays, no matching models
  - Export từ data-access index
  - _Requirements: 2.1, 2.2, 2.3_

- [ ]* 2.1 Write property test for grouping correctness
  - **Property 2: Grouping Correctness by Model Match**
  - **Validates: Requirements 2.1**

- [ ]* 2.2 Write property test for unique model groups
  - **Property 3: Unique Model Groups**
  - **Validates: Requirements 2.2**

- [ ]* 2.3 Write property test for unmatched houses exclusion
  - **Property 4: Unmatched Houses Exclusion**
  - **Validates: Requirements 2.3**

- [x] 3. Update NgRx state management
  - [x] 3.1 Update house.actions.ts - add groupedHouses to loadHousesSuccess
    - _Requirements: 2.4_
  - [x] 3.2 Update house.reducer.ts - add groupedHouses to state interface and initial state
    - Update HouseState interface với groupedHouses: GroupedHouseModel[]
    - Update initialState với groupedHouses: []
    - Update loadHousesSuccess reducer handler
    - _Requirements: 3.1, 3.2_
  - [x] 3.3 Update house.selectors.ts - add selectGroupedHouses and selectNonEmptyGroupedHouses
    - _Requirements: 3.3_
  - [x] 3.4 Update house.facade.ts - expose groupedHouses$ và groupedHousesSignal
    - _Requirements: 3.4_

- [ ]* 3.5 Write property test for state update consistency
  - **Property 5: State Update Consistency**
  - **Validates: Requirements 3.2, 3.3**

- [x] 4. Update house.effects.ts loadHouses$ effect
  - Import groupHousesByModel utility
  - Call groupHousesByModel after parsing houses and models
  - Include groupedHouses in loadHousesSuccess action dispatch
  - Update cache to include groupedHouses
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ]* 4.1 Write property test for filter then group order
  - **Property 6: Filter Then Group Order**
  - **Validates: Requirements 6.1, 6.2**

- [x] 5. Checkpoint - Ensure all data layer tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Update House List Component for accordion UI
  - [x] 6.1 Update house-list.component.ts
    - Import MatExpansionModule, MatAccordion
    - Add groupedHouses signal từ facade
    - _Requirements: 4.1_
  - [x] 6.2 Update house-list.component.html với Mat-Accordion
    - Replace current house table với mat-accordion structure
    - Add mat-expansion-panel for each grouped model
    - Display model name in panel header
    - _Requirements: 4.1, 4.2_
  - [x] 6.3 Add model media section trong expansion panel
    - Display title, description, banner image
    - Conditionally display video link
    - Position media section above house table
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - [x] 6.4 Add house table trong expansion panel
    - Use existing HouseTableComponent
    - Pass group.houses as input
    - Handle edit actions based on authentication
    - _Requirements: 4.3, 4.4, 4.5, 4.6_

- [ ]* 6.5 Write property test for panel header model name display
  - **Property 7: Panel Header Model Name Display**
  - **Validates: Requirements 4.2**

- [x] 7. Update house-list.component.scss for accordion styling
  - Style accordion container
  - Style expansion panel headers
  - Style model media section layout (title, banner side by side)
  - Ensure responsive design
  - _Requirements: 4.1, 5.5_

- [x] 8. Handle empty groups and filter integration
  - Filter out empty groups from display
  - Update filter change handler to work with grouped view
  - Show appropriate empty state when no groups have houses
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
