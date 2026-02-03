# Implementation Plan: App Initialization

## Overview

This implementation plan converts the modular Angular application architecture design into discrete coding tasks for a house/property management system. The approach follows a phased implementation starting with workspace cleanup, Angular Material setup, then building the foundation with shared components, followed by authentication and house management modules, and finally integration.

## Tasks

- [ ] 1. Workspace cleanup and structure setup
  - [x] 1.1 Remove existing applications and libraries
    - Remove existing applications: api, shop, shop-e2e
    - Remove existing libraries: api/products, shared/models, shop/data, shop/feature-product-detail, shop/feature-products, shop/shared-ui
    - Clean up nx.json and workspace configuration files
    - _Requirements: US1.1, US1.2_

  - [x] 1.2 Create new web application with Angular Material
    - Generate new "web" application using Nx Angular schematic
    - Install Angular Material, CDK, and animations
    - Configure Material theme, typography, and icons
    - Set up main.ts bootstrap configuration with Material theme
    - _Requirements: US1.3_

  - [x] 1.3 Create library structure with DDD organization
    - Generate auth library with domain, data-access, feature, ui layers
    - Generate houses library with domain, data-access, feature, ui layers  
    - Generate shared library with domain and ui layers
    - Configure library dependencies and import paths
    - Set up Material module imports in each library
    - _Requirements: US1.4, US1.5, US2.1, US3.1_

- [ ] 2. Angular Material foundation setup
  - [x] 2.1 Configure Material design system
    - Set up Material theme with primary, accent, and warn colors
    - Configure Material typography and density
    - Set up Material icons and fonts (Google Fonts)
    - Create shared Material module for common components
    - _Requirements: US4.1_

  - [x] 2.2 Create Material-based shared UI components
    - Use Angular Material components directly without wrappers
    - Configure Material components: mat-button, mat-select, mat-table, mat-form-field
    - Use Material services: MatDialog, MatSnackBar, mat-progress-spinner
    - _Requirements: US4.1_

  - [ ]* 2.3 Write unit tests for shared Material components
    - Test ButtonComponent Material variants and interactions
    - Test ModalComponent Material dialog functionality
    - Test TableComponent Material table features
    - Test Material form field components
    - _Requirements: US4.1, US4.3_

- [-] 3. Shared foundation implementation
  - [x] 3.1 Implement shared domain models
    - Create BaseEntityModel class with enum and interface pattern
    - Create PaginationRequestModel and PaginationResponseModel classes
    - Create ApiResponseModel class with success/error handling methods
    - _Requirements: US4.2_

  - [ ]* 3.2 Write property test for shared component reusability
    - **Property 3: Shared component reusability**
    - **Validates: Requirements US4.3**

- [x] 4. Authentication module implementation
  - [x] 4.1 Implement auth domain models
    - Create AuthUserModel class with enum and interface pattern
    - Create AuthTokenModel class with expiration checking
    - Create LoginCredentialsModel class with validation methods
    - _Requirements: US2.1_

  - [x] 4.2 Create auth data access layer with NgRx store only
    - Implement AuthApiService for HTTP authentication endpoints
    - Set up NgRx store for authentication state management (NO BehaviorSubject/Subject)
    - Create TokenService for token storage and retrieval
    - Ensure all state management uses NgRx store exclusively
    - _Requirements: US2.4, US2.5_

  - [x] 4.3 Build authentication UI components with Material design
    - Create LoginFormComponent with Material reactive forms (mat-form-field, mat-input)
    - Implement AuthLayoutComponent with Material card and layout
    - Create UserProfileComponent with Material card and avatar
    - Add Material validation and error handling
    - _Requirements: US2.3_

  - [x] 4.4 Implement AuthGuard, routing, and AuthFacade
    - Create AuthGuard for route protection
    - Set up authentication routes (login, logout)
    - **CRITICAL**: Create AuthFacade for simplified authentication operations
    - Facade must encapsulate all NgRx store selectors and actions
    - Components must only interact with store through facade
    - Add Material navigation and feedback components
    - _Requirements: US2.2_

  - [ ]* 4.5 Write property test for authentication guard protection
    - **Property 5: Authentication guard protection**
    - **Validates: Requirements US2.1**

  - [ ]* 4.6 Write unit tests for authentication components
    - Test LoginFormComponent Material form validation and submission
    - Test AuthGuard behavior with valid/invalid tokens
    - Test token storage and retrieval mechanisms
    - Test Material UI integration in auth components
    - _Requirements: US2.2, US2.3, US2.4_

- [x] 5. House management module implementation
  - [x] 5.1 Implement house domain models
    - Create HouseModel class with enum and interface pattern (houseNumber, blockNumber, landNumber, houseType, houseModel, price, status, media, description)
    - Create HouseType enum (Apartment, Townhouse, Villa)
    - Create HouseStatus enum (Available, Booked)
    - Create HouseFilterModel class with filtering functionality (block, land, price range, type, status)
    - Add Indonesian Rupiah price formatting methods
    - _Requirements: US3.1_

  - [x] 5.2 Create house data access layer
    - Implement HouseApiService for HTTP house endpoints
    - Set up NgRx store for house state management with filtering
    - Create HouseCacheService for data caching strategy
    - Add support for house filtering and pagination
    - _Requirements: US3.4_

  - [x] 5.3 Build house UI components with Material design
    - Create HouseCardComponent with Material card for individual house display
    - Implement HouseTableComponent with Material table and expansion panels for house listings
    - Create HouseFilterComponent with Material dropdowns (mat-select) for block, land, price range filters
    - Create HouseFormComponent with Material form controls for house creation/editing
    - Add Material data display components (formatted price, status badges)
    - _Requirements: US3.2_

  - [x] 5.4 Implement house feature components and routing
    - Create HouseListComponent container with Material table and accordion (publicly accessible)
    - Create HouseDetailComponent container with Material layout (protected by AuthGuard)
    - Create HouseCreateComponent container with Material forms (protected by AuthGuard)
    - Set up house routes: list (public), detail/create (protected)
    - Create HouseFacade for simplified house operations
    - Add "Create new house" button visible only when authenticated
    - _Requirements: US3.2, US3.3_

  - [ ]* 5.5 Write property test for library structure consistency
    - **Property 2: Library structure consistency**
    - **Validates: Requirements US1.4, US2.1, US3.1**

  - [ ]* 5.6 Write property test for Material integration consistency
    - **Property 4: Angular Material integration consistency**
    - **Validates: Requirements US3.1, US4.1**

  - [ ]* 5.7 Write unit tests for house components
    - Test HouseListComponent Material table and filtering functionality
    - Test HouseDetailComponent Material layout and data display
    - Test HouseCreateComponent Material form validation
    - Test house filtering with Material dropdowns
    - Test Material accordion/expansion panels for house models
    - _Requirements: US3.2, US3.4_

- [x] 6. Integration and application wiring
  - [x] 6.1 Configure main application routing with Material navigation
    - Set up app.routes.ts with lazy loading for feature modules
    - Apply AuthGuard to protected house routes (detail, create)
    - Configure Material toolbar and sidenav navigation
    - Add Material breadcrumbs and navigation indicators
    - _Requirements: US2.2_

  - [x] 6.2 Wire authentication and house modules with Material theming
    - Import and configure auth feature module in web app
    - Import and configure houses feature module in web app
    - Set up shared Material component usage across modules
    - Configure dependency injection and services
    - Ensure consistent Material theming across all modules
    - _Requirements: US4.3_

  - [ ]* 6.3 Write integration tests for Material components
    - Test end-to-end authentication flow with Material UI
    - Test house browsing without authentication (Material table access)
    - Test house creation/editing with authentication (Material form access)
    - Test cross-library Material component usage and imports
    - Test Material theme consistency across modules
    - _Requirements: US2.2, US3.3, US4.3_

- [x] 7. Modern Angular syntax and architecture compliance
  - [x] 7.1 Update all components to use modern Angular syntax
    - **CRITICAL**: Replace all *ngIf with @if control flow syntax
    - **CRITICAL**: Replace all *ngFor with @for control flow syntax
    - **CRITICAL**: Use Angular signals for interpolation where appropriate
    - **CRITICAL**: Ensure all components have complete file structure: .html, .ts, .scss
    - Review and update all existing components to follow modern Angular patterns
    - _Requirements: Modern Angular compliance_

  - [x] 7.2 Verify NgRx store and facade pattern compliance
    - **CRITICAL**: Ensure NO BehaviorSubject, Subject, or similar reactive patterns in services
    - **CRITICAL**: Verify all state management uses NgRx store exclusively
    - **CRITICAL**: Confirm all components interact with store ONLY through facade pattern
    - **CRITICAL**: Validate facades provide complete encapsulation of store operations
    - Review AuthFacade and HouseFacade implementations for compliance
    - _Requirements: NgRx store compliance_

- [x] 8. Final validation and cleanup
  - [x] 8.1 Verify workspace structure compliance
    - Validate all libraries follow DDD structure requirements
    - Confirm Nx configuration files are properly updated
    - Test library dependencies and import paths
    - Verify Angular Material integration across all components
    - _Requirements: US1.4, US1.5, US1.6_

  - [ ]* 8.2 Write property test for workspace cleanup completeness
    - **Property 1: Workspace cleanup completeness**
    - **Validates: Requirements US1.1, US1.2**

  - [x] 8.3 Checkpoint - Ensure all tests pass
    - Run all unit tests and property tests
    - Verify authentication guard functionality with Material feedback
    - Test house module accessibility: list (public), detail/create (protected)
    - Test Material component integration and theming
    - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties from the design
- Unit tests validate specific examples and Material component functionality
- The implementation follows TypeScript, Angular, and Material Design best practices
- All libraries use the specified model pattern with enums, interfaces, and classes
- House management system replaces the generic product system
- Angular Material is integrated throughout for consistent UI/UX
- Authentication protects house detail and create pages, but list remains public
- Indonesian Rupiah formatting is used for house prices
- Material table with expansion panels is used for house listings with filtering

## Modern Angular Requirements

- **Control Flow Syntax**: All components must use @if and @for instead of *ngIf and *ngFor
- **Signals**: Use Angular signals for interpolation and reactive data where appropriate
- **Component Structure**: Every component must have complete file structure (.html, .ts, .scss)
- **NgRx Store Only**: Absolutely NO BehaviorSubject, Subject, or similar reactive patterns
- **Facade Pattern**: All store interactions must go through facades - no direct store access from components
- **Modern TypeScript**: Use latest TypeScript features and Angular standalone components where applicable