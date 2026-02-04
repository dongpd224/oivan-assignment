# Implementation Plan: UI Layout Redesign

## Overview

This implementation plan transforms the House Management System from a sidenav-based layout to a streamlined single-page layout with inline header authentication. Tasks are ordered to build incrementally, with each step validating core functionality before proceeding.

## Tasks

- [x] 1. Remove sidenav and update App Shell layout
  - [x] 1.1 Remove sidenav from App Shell component
    - Remove `MatSidenavModule` import from app component
    - Remove sidenav-related template code (`mat-sidenav-container`, `mat-sidenav`, `mat-sidenav-content`)
    - Remove hamburger menu button from toolbar
    - Apply full-width layout to main content container
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ]* 1.2 Write unit tests for App Shell layout changes
    - Test that no sidenav elements are present in DOM
    - Test that no hamburger menu button is present
    - Test that main content uses full viewport width
    - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Create Header Login Widget component
  - [x] 2.1 Create HeaderLoginWidgetComponent
    - Create component at `libs/auth/ui/src/lib/header-login-widget/`
    - Implement inline form with email and password inputs
    - Add Login button next to input fields
    - Emit `loginSubmit` event with `LoginCredentialsModel` on form submission
    - Handle form validation (required fields)
    - Style for compact horizontal header placement
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ]* 2.2 Write unit tests for Header Login Widget
    - Test form validation (required fields)
    - Test submit button disabled when form invalid
    - Test event emission on valid form submission
    - _Requirements: 2.1, 2.2, 2.3_

- [x] 3. Create Header User Display component
  - [x] 3.1 Create HeaderUserDisplayComponent
    - Create component at `libs/auth/ui/src/lib/header-user-display/`
    - Accept `username` input
    - Display username text
    - Add Logout button
    - Emit `logoutClick` event on button click
    - _Requirements: 3.1, 3.2_

  - [ ]* 3.2 Write unit tests for Header User Display
    - Test username rendering
    - Test logout button click event emission
    - _Requirements: 3.1, 3.2_

- [x] 4. Integrate auth components into Header Bar
  - [x] 4.1 Update App Shell to conditionally show auth components
    - Inject `AuthFacade` to access `isAuthenticated$` and `currentUser$`
    - Show `HeaderLoginWidgetComponent` when not authenticated
    - Show `HeaderUserDisplayComponent` when authenticated
    - Handle `loginSubmit` event by calling `AuthFacade.login()`
    - Handle `logoutClick` event by calling `AuthFacade.logout()`
    - Display error notification on authentication failure
    - _Requirements: 2.3, 2.4, 2.5, 3.3_

  - [ ]* 4.2 Write property test for auth component visibility
    - **Property 1: Login Widget and User Display Mutual Exclusivity**
    - **Validates: Requirements 2.1, 2.2, 3.1, 3.2**

- [x] 5. Checkpoint - Verify auth integration
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Remove login route and update routing
  - [x] 6.1 Update route configuration
    - Remove `/auth` route with lazy loading configuration
    - Add redirect rule: `/auth/login` → `/houses`
    - Remove or deprecate standalone login page component references
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ]* 6.2 Write unit tests for route configuration
    - Test that `/auth/login` redirects to `/houses`
    - Test that auth module lazy loading is removed
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 7. Update House Filter component for horizontal layout
  - [x] 7.1 Modify HouseFilterComponent layout
    - Update template for horizontal layout on lg/xl viewports
    - Implement responsive stacking for medium and smaller viewports
    - Ensure Block Number, Land Number, Min Price, Max Price controls are present
    - Add `showCreateButton` input property
    - Add `createHouse` output event
    - Position Create button on the right side of filter row
    - Conditionally show Create button based on `showCreateButton` input
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.1, 6.2_

  - [ ]* 7.2 Write unit tests for House Filter layout
    - Test horizontal layout on large viewports
    - Test stacked layout on smaller viewports
    - Test all filter controls are present
    - Test Create button visibility based on input
    - Test Create button positioned on right
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 7.3 Write property test for Create button visibility
    - **Property 2: Create Button Visibility Invariant**
    - **Validates: Requirements 6.1, 6.2, 6.3**

- [x] 8. Update House List to pass auth state to filter
  - [x] 8.1 Wire auth state to House Filter
    - Inject `AuthFacade` in House List component
    - Pass `isAuthenticated$` value to `showCreateButton` input
    - Handle `createHouse` event to navigate to create page
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 9. Update House Table for conditional edit actions
  - [x] 9.1 Ensure House Table respects showEditActions input
    - Verify `showEditActions` input controls Edit link visibility
    - Update House List to pass auth state to `showEditActions`
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ]* 9.2 Write property test for Edit action visibility
    - **Property 3: Edit Action Visibility Invariant**
    - **Validates: Requirements 7.1, 7.2, 7.3**

- [x] 10. Checkpoint - Verify conditional UI elements
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 11. Write property test for auth state transitions
  - **Property 4: Auth State Transition Consistency**
  - **Validates: Requirements 2.3, 2.4, 3.3**

- [ ]* 12. Write integration tests
  - Test login flow: Enter credentials → Submit → Verify UI transition
  - Test logout flow: Click logout → Verify UI transition
  - Test route redirect: Navigate to '/auth/login' → Verify redirect to '/houses'
  - _Requirements: 2.3, 2.4, 3.3, 4.2_

- [x] 13. Final checkpoint - Full regression
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
