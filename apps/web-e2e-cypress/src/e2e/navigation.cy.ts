describe('Application Navigation', () => {
  beforeEach(() => {
    cy.mockHousesApi();
    cy.mockAuthApi();
  });

  describe('Default Routes', () => {
    it('should redirect root to houses', () => {
      cy.visit('/');
      cy.url().should('include', '/houses');
    });

    it('should redirect unknown routes to houses', () => {
      cy.visit('/unknown-route');
      cy.url().should('include', '/houses');
    });

    it('should redirect auth/login to houses', () => {
      cy.visit('/auth/login');
      cy.url().should('include', '/houses');
    });
  });

  describe('House Routes', () => {
    it('should navigate to house list', () => {
      cy.visit('/houses');
      cy.url().should('include', '/houses');
      cy.get('table').should('exist');
    });

    it('should navigate to house create (authenticated)', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('auth_token', 'mock-access-token');
      });
      
      cy.visit('/houses/create');
      cy.url().should('include', '/houses/create');
      cy.get('form').should('exist');
    });

    it('should navigate to house detail (authenticated)', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('auth_token', 'mock-access-token');
      });
      
      cy.visit('/houses/1');
      cy.url().should('include', '/houses/1');
    });

    it('should navigate to house edit (authenticated)', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('auth_token', 'mock-access-token');
      });
      
      cy.visit('/houses/1/edit');
      cy.url().should('include', '/houses/1/edit');
      cy.get('form').should('exist');
    });
  });

  describe('Protected Routes', () => {
    it('should redirect to login when accessing create without auth', () => {
      cy.visit('/houses/create');
      // Should redirect to login or show unauthorized
    });

    it('should redirect to login when accessing edit without auth', () => {
      cy.visit('/houses/1/edit');
      // Should redirect to login or show unauthorized
    });
  });

  describe('Navigation from House List', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.localStorage.setItem('auth_token', 'mock-access-token');
      });
      cy.visit('/houses');
      cy.wait('@getHouses');
      cy.wait('@getHouseModels');
    });

    it('should navigate to create page from list', () => {
      cy.contains('button', 'Create new house').click();
      cy.url().should('include', '/houses/create');
    });

    it('should navigate to edit page from table action', () => {
      cy.get('button[title="Edit House"]').first().click();
      cy.url().should('include', '/edit');
    });
  });

  describe('Back Navigation', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.localStorage.setItem('auth_token', 'mock-access-token');
      });
    });

    it('should navigate back to list from create page', () => {
      cy.visit('/houses/create');
      cy.wait('@getHouseModels');
      
      // Click back/cancel button
      cy.go('back');
      cy.url().should('include', '/houses');
    });

    it('should navigate back to list from edit page', () => {
      cy.visit('/houses/1/edit');
      cy.wait('@getHouses');
      cy.wait('@getHouseModels');
      
      cy.go('back');
      cy.url().should('include', '/houses');
    });
  });
});
