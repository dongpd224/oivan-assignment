// ***********************************************
// Custom Cypress commands for the application
// ***********************************************

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login with credentials
     * @example cy.login('admin@example.com', 'password123')
     */
    login(email: string, password: string): Chainable<void>;

    /**
     * Custom command to intercept and mock API calls
     * @example cy.mockHousesApi()
     */
    mockHousesApi(): Chainable<void>;

    /**
     * Custom command to intercept and mock auth API
     * @example cy.mockAuthApi()
     */
    mockAuthApi(): Chainable<void>;

    /**
     * Custom command to get element by data-testid
     * @example cy.getByTestId('house-card')
     */
    getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
  }
}

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.intercept('POST', '/api/auth', {
    statusCode: 200,
    body: {
      data: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: 3600
      },
      meta: { record_count: 1 }
    }
  }).as('loginRequest');

  cy.visit('/auth/login');
  cy.get('input[formControlName="email"]').type(email);
  cy.get('input[formControlName="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.wait('@loginRequest');
});

// Mock Houses API
Cypress.Commands.add('mockHousesApi', () => {
  cy.intercept('GET', '/api/houses', {
    statusCode: 200,
    fixture: 'houses.json'
  }).as('getHouses');

  cy.intercept('GET', '/api/house_models', {
    statusCode: 200,
    fixture: 'house-models.json'
  }).as('getHouseModels');
});

// Mock Auth API
Cypress.Commands.add('mockAuthApi', () => {
  cy.intercept('POST', '/api/auth', {
    statusCode: 200,
    body: {
      data: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: 3600
      },
      meta: { record_count: 1 }
    }
  }).as('loginRequest');

  cy.intercept('POST', '/api/auth/logout', {
    statusCode: 200,
    body: { data: null, meta: { record_count: 0 } }
  }).as('logoutRequest');
});

// Get by test ID
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

// Prevent TypeScript from reading file as legacy script
export {};
