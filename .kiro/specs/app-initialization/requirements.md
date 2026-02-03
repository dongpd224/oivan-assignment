# App Initialization Requirements

## Overview
Implement a modular architecture with authentication and product management capabilities in the existing Nx workspace with Angular applications.

## User Stories

### US1: Workspace Cleanup and Structure Implementation
**As a** developer  
**I want** to clean up the existing workspace and implement the required modular architecture structure  
**So that** I can have a clean codebase following domain-driven design principles

**Acceptance Criteria:**
- Remove all existing applications (api, shop, shop-e2e)
- Remove all existing libraries (api/products, shared/models, shop/data, shop/feature-product-detail, shop/feature-products, shop/shared-ui)
- Create one new application named "web"
- Create new libraries: "auth", "products", and "shared" with proper DDD structure
- All libraries follow Nx conventions and are properly configured
- Project follows the specified directory structure

### US2: Authentication Module
**As a** user  
**I want** authentication functionality  
**So that** I can securely access the application

**Acceptance Criteria:**
- Auth library follows domain-driven design structure (domain, data-access, feature, ui)
- Authentication guard is implemented and applied to routes
- Login functionality is available
- Token management is implemented
- Authentication state is managed exclusively through NgRx store (NO BehaviorSubject/Subject)
- AuthFacade provides simplified interface to NgRx store operations
- All components interact with store only through facade pattern

### US3: House Management Module
**As a** user  
**I want** to manage houses  
**So that** I can view and interact with house data

**Acceptance Criteria:**
- House library follows domain-driven design structure
- House listing and detail views are available
- House routes are defined but not protected by authentication
- House data access layer is implemented with NgRx store (NO BehaviorSubject/Subject)
- HouseFacade provides simplified interface to NgRx store operations
- All components interact with store only through facade pattern

### US4: Shared Components
**As a** developer  
**I want** reusable shared components  
**So that** I can maintain consistency across the application

**Acceptance Criteria:**
- Shared library contains common UI components (button, modal, table)
- Shared domain models are available (base-entity, pagination)
- Components are reusable across different modules

### US5: Modern Angular Compliance
**As a** developer  
**I want** all components to use modern Angular syntax and patterns  
**So that** the codebase follows current Angular best practices and is maintainable

**Acceptance Criteria:**
- All components use @if instead of *ngIf control flow syntax
- All components use @for instead of *ngFor control flow syntax  
- Components use Angular signals for interpolation where appropriate
- Every component has complete file structure: .html, .ts, and .scss files
- All components follow modern Angular standalone component patterns where applicable
- Code uses latest TypeScript features and Angular conventions

## Technical Requirements

### Workspace Cleanup
- Remove existing applications: api, shop, shop-e2e
- Remove existing libraries: api/products, shared/models, shop/data, shop/feature-product-detail, shop/feature-products, shop/shared-ui
- Clean up nx.json and any project configuration files
- Start with a clean workspace structure

### Implementation Focus
- Create new "web" application with Angular
- Create new library structure as specified
- Implement domain-driven design architecture

### Project Structure
```
apps/
└─ web/          <-- NEW: Main web application
   └─ src/
      ├─ app/
      │  ├─ app.component.ts
      │  └─ app.routes.ts   <-- Apply AuthGuard here
      └─ main.ts

libs/
├─ auth/         <-- NEW: Authentication library
│  ├─ domain/
│  │  └─ src/lib/
│  │     ├─ auth.model.ts
│  │     ├─ token.model.ts
│  │     └─ auth.rules.ts
│  ├─ data-access/
│  │  └─ src/lib/
│  │     ├─ auth.api.ts
│  │     ├─ auth.store.ts
│  │     └─ auth.mapper.ts
│  ├─ feature/
│  │  └─ src/lib/
│  │     ├─ login/
│  │     │  └─ login.component.ts
│  │     ├─ guards/
│  │     │  └─ auth.guard.ts   <-- Auth Guard implementation
│  │     ├─ auth.facade.ts
│  │     └─ auth.routes.ts
│  └─ ui/
│     └─ src/lib/
│        ├─ login-form/
│        └─ auth-layout/

├─ products/     <-- NEW: Products library
│  ├─ domain/
│  │  └─ src/lib/
│  │     ├─ product.model.ts
│  │     └─ product.rules.ts
│  ├─ data-access/
│  │  └─ src/lib/
│  │     ├─ product.api.ts
│  │     ├─ product.store.ts
│  │     └─ product.mapper.ts
│  ├─ feature/
│  │  └─ src/lib/
│  │     ├─ list/
│  │     ├─ detail/
│  │     ├─ product.facade.ts
│  │     └─ product.routes.ts   <-- No auth protection
│  └─ ui/
│     └─ src/lib/
│        ├─ product-card/
│        └─ product-detail-view/

└─ shared/       <-- NEW: Shared library
   ├─ domain/
   │  └─ src/lib/
   │     ├─ base-entity.ts
   │     └─ pagination.ts
   └─ ui/
      └─ src/lib/
         ├─ button/
         ├─ modal/
         └─ table/
```

### Architecture Constraints
- Follow domain-driven design principles
- Use Nx library structure with domain, data-access, feature, and ui layers
- Remove all existing applications and libraries first
- Create clean new structure with only required components
- Implement authentication guard for route protection in web application
- House routes should remain unprotected by authentication
- Use Angular best practices and conventions
- **CRITICAL**: Use NgRx store exclusively for state management - NO BehaviorSubject, Subject, or similar reactive patterns
- **CRITICAL**: All store interactions must go through facade pattern - components never directly access store
- Facades provide simplified, type-safe interface to store operations

### Modern Angular Requirements
- **Control Flow**: Use @if and @for instead of *ngIf and *ngFor in all templates
- **Signals**: Implement Angular signals for reactive data and interpolation
- **Component Structure**: Every component must have .html, .ts, and .scss files
- **Standalone Components**: Use standalone components where applicable
- **TypeScript**: Use latest TypeScript features and strict typing
- **No Legacy Patterns**: Absolutely no BehaviorSubject, Subject, or similar reactive patterns in services


