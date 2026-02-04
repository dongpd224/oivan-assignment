# Requirements Document

## Introduction

This feature redesigns the main UI layout of the House Management System based on a new mockup. The changes include removing the sidenav navigation, integrating login functionality directly into the top header bar, reorganizing the filter section to display horizontally, and conditionally showing authenticated-only features.

## Glossary

- **App_Shell**: The main application container component that provides the overall layout structure
- **Header_Bar**: The top navigation bar containing the login/logout functionality and branding
- **Login_Widget**: An inline login form displayed in the header bar with username and password fields
- **User_Display**: A component showing the logged-in user's name with a logout button
- **Filter_Section**: The horizontal filter bar containing house filtering controls
- **House_List**: The main content area displaying the list of houses in an expandable accordion format
- **Authenticated_User**: A user who has successfully logged in to the system

## Requirements

### Requirement 1: Remove Sidenav Navigation

**User Story:** As a user, I want a cleaner interface without sidenav, so that I have more screen space for content.

#### Acceptance Criteria

1. WHEN the application loads, THE App_Shell SHALL display content without a sidenav drawer
2. WHEN the application loads, THE App_Shell SHALL NOT display a hamburger menu button
3. THE App_Shell SHALL use the full viewport width for main content

### Requirement 2: Inline Header Login Widget

**User Story:** As a user, I want to log in directly from the header bar, so that I can authenticate without navigating to a separate page.

#### Acceptance Criteria

1. WHEN a user is not authenticated, THE Header_Bar SHALL display the Login_Widget with username and password input fields
2. WHEN a user is not authenticated, THE Header_Bar SHALL display a "Login" button next to the input fields
3. WHEN a user enters valid credentials and clicks Login, THE Login_Widget SHALL authenticate the user
4. WHEN authentication succeeds, THE Header_Bar SHALL replace the Login_Widget with the User_Display
5. IF authentication fails, THEN THE Login_Widget SHALL display an error notification and maintain the current state

### Requirement 3: Authenticated User Display

**User Story:** As an authenticated user, I want to see my username and have easy access to logout, so that I know I'm logged in and can sign out easily.

#### Acceptance Criteria

1. WHEN a user is authenticated, THE Header_Bar SHALL display the user's username
2. WHEN a user is authenticated, THE Header_Bar SHALL display a "Logout" button
3. WHEN a user clicks the Logout button, THE App_Shell SHALL log out the user and display the Login_Widget

### Requirement 4: Remove Login Route

**User Story:** As a developer, I want to remove the dedicated login page route, so that the application uses the inline login widget exclusively.

#### Acceptance Criteria

1. THE App_Shell SHALL NOT include a route for '/auth/login'
2. WHEN a user navigates to '/auth/login', THE App_Shell SHALL redirect to the houses list
3. THE App_Shell SHALL remove the auth module lazy loading configuration

### Requirement 5: Horizontal Filter Layout

**User Story:** As a user, I want the filter controls displayed horizontally on large screens, so that I can see all filter options at a glance.

#### Acceptance Criteria

1. WHEN the viewport is large (lg) or extra-large (xl), THE Filter_Section SHALL display all filter controls on a single horizontal line
2. WHEN the viewport is medium or smaller, THE Filter_Section SHALL stack filter controls appropriately for the screen size
3. THE Filter_Section SHALL include Block Number, Land Number, Min Price, and Max Price dropdowns/inputs
4. THE Filter_Section SHALL position the "Create new house" button on the right side of the filter row

### Requirement 6: Conditional Create House Button

**User Story:** As a user, I want the "Create new house" button to only appear when I'm logged in, so that unauthorized users cannot attempt to create houses.

#### Acceptance Criteria

1. WHEN a user is authenticated, THE Filter_Section SHALL display the "Create new house" button
2. WHEN a user is not authenticated, THE Filter_Section SHALL NOT display the "Create new house" button
3. WHEN a user logs out, THE Filter_Section SHALL immediately hide the "Create new house" button

### Requirement 7: Conditional Edit Actions

**User Story:** As a user, I want the Edit action in the house table to only appear when I'm logged in, so that unauthorized users cannot attempt to edit houses.

#### Acceptance Criteria

1. WHEN a user is authenticated, THE House_List SHALL display the "Edit" action link in the Action column
2. WHEN a user is not authenticated, THE House_List SHALL NOT display the "Edit" action link
3. WHEN a user logs out, THE House_List SHALL immediately hide the "Edit" action links
