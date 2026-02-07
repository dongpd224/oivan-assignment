describe('House Form - Create Mode', () => {
  beforeEach(() => {
    cy.mockHousesApi();
    cy.mockAuthApi();
    
    // Set up authenticated state
    cy.window().then((win) => {
      win.localStorage.setItem('auth_token', 'mock-access-token');
    });
    
    cy.intercept('POST', '/api/houses', {
      statusCode: 201,
      body: {
        data: {
          id: '4',
          type: 'houses',
          attributes: {
            house_number: 'H-004',
            price: 800000000,
            block_number: 'C',
            land_number: '01',
            house_type: 'villa',
            model: 'Model A',
            status: 'available'
          }
        },
        meta: { record_count: 1 }
      }
    }).as('createHouse');

    cy.visit('/houses/create');
    cy.wait('@getHouseModels');
  });

  it('should display the create house form', () => {
    cy.get('form').should('exist');
  });

  it('should have all required form fields', () => {
    cy.get('input[formControlName="houseNumber"]').should('exist');
    cy.get('input[formControlName="blockNumber"]').should('exist');
    cy.get('input[formControlName="landNumber"]').should('exist');
    cy.get('mat-select[formControlName="houseType"]').should('exist');
    cy.get('mat-select[formControlName="model"]').should('exist');
    cy.get('input[formControlName="price"]').should('exist');
    cy.get('mat-select[formControlName="status"]').should('exist');
  });

  it('should show "Create House" button', () => {
    cy.contains('button', 'Create House').should('exist');
  });

  it('should disable submit button when form is invalid', () => {
    cy.contains('button', 'Create House').should('be.disabled');
  });

  it('should enable submit button when form is valid', () => {
    cy.get('input[formControlName="houseNumber"]').type('H-004');
    cy.get('input[formControlName="blockNumber"]').type('C');
    cy.get('input[formControlName="landNumber"]').type('01');
    
    cy.get('mat-select[formControlName="houseType"]').click();
    cy.get('mat-option').contains('villa').click();
    
    cy.get('mat-select[formControlName="model"]').click();
    cy.get('mat-option').contains('Model A').click();
    
    cy.get('input[formControlName="price"]').clear().type('800000000');
    
    cy.get('mat-select[formControlName="status"]').click();
    cy.get('mat-option').contains('available').click();

    cy.contains('button', 'Create House').should('not.be.disabled');
  });

  it('should show validation errors for required fields', () => {
    cy.get('input[formControlName="houseNumber"]').focus().blur();
    cy.contains('House number is required').should('be.visible');
  });

  it('should show error for duplicate house number', () => {
    cy.get('input[formControlName="houseNumber"]').type('H-001');
    // Wait for debounce
    cy.wait(400);
    cy.contains('House number already exists').should('be.visible');
  });

  it('should submit form and navigate to list on success', () => {
    cy.get('input[formControlName="houseNumber"]').type('H-004');
    cy.get('input[formControlName="blockNumber"]').type('C');
    cy.get('input[formControlName="landNumber"]').type('01');
    
    cy.get('mat-select[formControlName="houseType"]').click();
    cy.get('mat-option').contains('villa').click();
    
    cy.get('mat-select[formControlName="model"]').click();
    cy.get('mat-option').contains('Model A').click();
    
    cy.get('input[formControlName="price"]').clear().type('800000000');
    
    cy.get('mat-select[formControlName="status"]').click();
    cy.get('mat-option').contains('available').click();

    cy.contains('button', 'Create House').click();
    cy.wait('@createHouse');
    cy.url().should('include', '/houses');
  });
});

describe('House Form - Edit Mode', () => {
  beforeEach(() => {
    cy.mockHousesApi();
    cy.mockAuthApi();
    
    // Set up authenticated state
    cy.window().then((win) => {
      win.localStorage.setItem('auth_token', 'mock-access-token');
    });
    
    cy.intercept('PUT', '/api/houses/1', {
      statusCode: 200,
      body: {
        data: {
          id: '1',
          type: 'houses',
          attributes: {
            house_number: 'H-001',
            price: 1200000000,
            block_number: 'A',
            land_number: '01',
            house_type: 'villa',
            model: 'Model A',
            status: 'booked'
          }
        },
        meta: { record_count: 1 }
      }
    }).as('updateHouse');

    cy.visit('/houses/1/edit');
    cy.wait('@getHouses');
    cy.wait('@getHouseModels');
  });

  it('should display the edit house form', () => {
    cy.get('form').should('exist');
  });

  it('should show "Update House" button', () => {
    cy.contains('button', 'Update House').should('exist');
  });

  it('should pre-populate form with house data', () => {
    cy.get('input[formControlName="houseNumber"]').should('have.value', 'H-001');
    cy.get('input[formControlName="blockNumber"]').should('have.value', 'A');
    cy.get('input[formControlName="landNumber"]').should('have.value', '01');
  });

  it('should update house and stay on page', () => {
    cy.get('input[formControlName="price"]').clear().type('1200000000');
    
    cy.get('mat-select[formControlName="status"]').click();
    cy.get('mat-option').contains('booked').click();

    cy.contains('button', 'Update House').click();
    cy.wait('@updateHouse');
  });
});
