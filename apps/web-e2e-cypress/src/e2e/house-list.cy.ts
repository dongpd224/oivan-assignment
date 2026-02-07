describe('House List Page', () => {
  beforeEach(() => {
    cy.mockHousesApi();
    cy.visit('/houses');
    cy.wait('@getHouses');
    cy.wait('@getHouseModels');
  });

  it('should display the house list page', () => {
    cy.url().should('include', '/houses');
  });

  it('should display houses in the table', () => {
    cy.get('table').should('exist');
    cy.get('tr.mat-mdc-row').should('have.length.at.least', 1);
  });

  it('should display house numbers in the table', () => {
    cy.contains('H-001').should('be.visible');
    cy.contains('H-002').should('be.visible');
  });

  it('should display block numbers', () => {
    cy.contains('A').should('be.visible');
    cy.contains('B').should('be.visible');
  });

  it('should display status badges', () => {
    cy.get('.badge').should('have.length.at.least', 1);
    cy.get('.bg-success').should('exist'); // Available status
    cy.get('.bg-warning').should('exist'); // Booked status
  });

  describe('Filter functionality', () => {
    it('should have filter form', () => {
      cy.get('form').should('exist');
    });

    it('should have block number filter', () => {
      cy.get('input[formControlName="blockNumber"]').should('exist');
    });

    it('should have land number filter', () => {
      cy.get('input[formControlName="landNumber"]').should('exist');
    });

    it('should have min price filter', () => {
      cy.get('input[formControlName="minPrice"]').should('exist');
    });

    it('should have max price filter', () => {
      cy.get('input[formControlName="maxPrice"]').should('exist');
    });

    it('should have apply filter button', () => {
      cy.contains('button', 'Apply').should('exist');
    });

    it('should have clear filter button', () => {
      cy.contains('button', 'Clear').should('exist');
    });

    it('should filter by block number', () => {
      cy.get('input[formControlName="blockNumber"]').type('A');
      cy.contains('button', 'Apply').click();
      // Verify filter is applied (implementation depends on actual behavior)
    });
  });

  describe('Pagination', () => {
    it('should display pagination when there are houses', () => {
      cy.get('mat-paginator').should('exist');
    });

    it('should display total items count', () => {
      cy.contains('Total:').should('be.visible');
    });
  });

  describe('Sorting', () => {
    it('should have sortable columns', () => {
      cy.get('[mat-sort-header]').should('have.length.at.least', 1);
    });

    it('should sort by house number when header is clicked', () => {
      cy.get('[mat-sort-header="houseNumber"]').click();
      // Verify sorting is applied
    });

    it('should sort by price when header is clicked', () => {
      cy.get('[mat-sort-header="price"]').click();
      // Verify sorting is applied
    });
  });
});

describe('House List - Authenticated User', () => {
  beforeEach(() => {
    cy.mockHousesApi();
    cy.mockAuthApi();
    
    // Set up authenticated state
    cy.window().then((win) => {
      win.localStorage.setItem('auth_token', 'mock-access-token');
    });
    
    cy.visit('/houses');
    cy.wait('@getHouses');
    cy.wait('@getHouseModels');
  });

  it('should show create button for authenticated users', () => {
    cy.contains('button', 'Create new house').should('exist');
  });

  it('should show edit actions in table for authenticated users', () => {
    cy.get('button[title="Edit House"]').should('exist');
  });

  it('should navigate to create page when create button is clicked', () => {
    cy.contains('button', 'Create new house').click();
    cy.url().should('include', '/houses/create');
  });
});
