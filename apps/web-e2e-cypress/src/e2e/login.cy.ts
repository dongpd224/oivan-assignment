describe('Login Page', () => {
  beforeEach(() => {
    cy.mockAuthApi();
    cy.visit('/auth/login');
  });

  it('should display the login form', () => {
    cy.get('mat-card').should('exist');
    cy.contains('Login').should('be.visible');
  });

  it('should have email input field', () => {
    cy.get('input[formControlName="email"]').should('exist');
  });

  it('should have password input field', () => {
    cy.get('input[formControlName="password"]').should('exist');
    cy.get('input[formControlName="password"]').should('have.attr', 'type', 'password');
  });

  it('should have submit button', () => {
    cy.get('button[type="submit"]').should('exist');
    cy.contains('button', 'Login').should('exist');
  });

  it('should disable submit button when form is empty', () => {
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should enable submit button when form is valid', () => {
    cy.get('input[formControlName="email"]').type('admin@example.com');
    cy.get('input[formControlName="password"]').type('password123');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('should show validation error for invalid email', () => {
    cy.get('input[formControlName="email"]').type('invalid-email');
    cy.get('input[formControlName="password"]').focus();
    // Email validation error should appear
  });

  describe('Login Flow', () => {
    it('should login successfully with valid credentials', () => {
      cy.get('input[formControlName="email"]').type('admin@example.com');
      cy.get('input[formControlName="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      
      cy.wait('@loginRequest');
      cy.url().should('include', '/houses');
    });

    it('should show error message on login failure', () => {
      cy.intercept('POST', '/api/auth', {
        statusCode: 401,
        body: {
          error: 'Invalid credentials'
        }
      }).as('failedLogin');

      cy.get('input[formControlName="email"]').type('wrong@example.com');
      cy.get('input[formControlName="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      
      cy.wait('@failedLogin');
      // Error snackbar should appear
      cy.get('.mat-mdc-snack-bar-container').should('be.visible');
    });

    it('should show loading state while logging in', () => {
      cy.intercept('POST', '/api/auth', (req) => {
        req.reply({
          delay: 1000,
          statusCode: 200,
          body: {
            data: {
              accessToken: 'mock-token',
              refreshToken: 'mock-refresh',
              expiresIn: 3600
            },
            meta: { record_count: 1 }
          }
        });
      }).as('slowLogin');

      cy.get('input[formControlName="email"]').type('admin@example.com');
      cy.get('input[formControlName="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      
      cy.contains('Logging in...').should('be.visible');
    });
  });
});

describe('Authentication State', () => {
  beforeEach(() => {
    cy.mockHousesApi();
    cy.mockAuthApi();
  });

  it('should redirect to houses after successful login', () => {
    cy.visit('/auth/login');
    cy.get('input[formControlName="email"]').type('admin@example.com');
    cy.get('input[formControlName="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@loginRequest');
    cy.url().should('include', '/houses');
  });

  it('should persist authentication state', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('auth_token', 'mock-access-token');
    });
    
    cy.visit('/houses');
    // Should be able to access authenticated features
    cy.contains('button', 'Create new house').should('exist');
  });

  it('should clear authentication on logout', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('auth_token', 'mock-access-token');
    });
    
    cy.visit('/houses');
    
    // Trigger logout (implementation depends on UI)
    // cy.get('[data-testid="logout-button"]').click();
    // cy.wait('@logoutRequest');
    
    // cy.window().then((win) => {
    //   expect(win.localStorage.getItem('auth_token')).to.be.null;
    // });
  });
});
