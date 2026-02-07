describe('House Filter Component', () => {
  beforeEach(() => {
    cy.mockHousesApi();
    cy.visit('/houses');
    cy.wait('@getHouses');
    cy.wait('@getHouseModels');
  });

  describe('Filter Form Elements', () => {
    it('should display block number autocomplete', () => {
      cy.get('input[formControlName="blockNumber"]').should('exist');
    });

    it('should display land number autocomplete', () => {
      cy.get('input[formControlName="landNumber"]').should('exist');
    });

    it('should display min price input', () => {
      cy.get('input[formControlName="minPrice"]').should('exist');
    });

    it('should display max price input', () => {
      cy.get('input[formControlName="maxPrice"]').should('exist');
    });

    it('should display apply button', () => {
      cy.contains('button', 'Apply').should('exist');
    });

    it('should display clear button', () => {
      cy.contains('button', 'Clear').should('exist');
    });
  });

  describe('Block Number Filter', () => {
    it('should show autocomplete options when typing', () => {
      cy.get('input[formControlName="blockNumber"]').type('A');
      cy.get('mat-option').should('be.visible');
    });

    it('should filter autocomplete options', () => {
      cy.get('input[formControlName="blockNumber"]').type('A');
      cy.get('mat-option').should('contain', 'Block A');
    });

    it('should select option from autocomplete', () => {
      cy.get('input[formControlName="blockNumber"]').type('A');
      cy.get('mat-option').contains('Block A').click();
      cy.get('input[formControlName="blockNumber"]').should('have.value', 'Block A');
    });
  });

  describe('Price Filter', () => {
    it('should format price input with thousand separators', () => {
      cy.get('input[formControlName="minPrice"]').type('1000000');
      cy.get('input[formControlName="minPrice"]').should('have.value', '1.000.000');
    });

    it('should accept decimal values', () => {
      cy.get('input[formControlName="minPrice"]').type('1000000,5');
      cy.get('input[formControlName="minPrice"]').should('have.value', '1.000.000,5');
    });
  });

  describe('Apply Filter', () => {
    it('should enable apply button when filter values change', () => {
      cy.get('input[formControlName="blockNumber"]').type('A');
      cy.contains('button', 'Apply').should('not.be.disabled');
    });

    it('should apply filter when apply button is clicked', () => {
      cy.get('input[formControlName="blockNumber"]').type('A');
      cy.contains('button', 'Apply').click();
      // Verify filter is applied - table should update
    });
  });

  describe('Clear Filter', () => {
    it('should clear all filter values when clear button is clicked', () => {
      cy.get('input[formControlName="blockNumber"]').type('A');
      cy.get('input[formControlName="minPrice"]').type('500000000');
      
      cy.contains('button', 'Clear').click();
      
      cy.get('input[formControlName="blockNumber"]').should('have.value', '');
      cy.get('input[formControlName="minPrice"]').should('have.value', '');
    });

    it('should disable clear button when no filters are active', () => {
      cy.contains('button', 'Clear').should('be.disabled');
    });

    it('should enable clear button when filters are active', () => {
      cy.get('input[formControlName="blockNumber"]').type('A');
      cy.contains('button', 'Clear').should('not.be.disabled');
    });
  });
});
