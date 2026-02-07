describe('House Table Component', () => {
  beforeEach(() => {
    cy.mockHousesApi();
    cy.visit('/houses');
    cy.wait('@getHouses');
    cy.wait('@getHouseModels');
  });

  describe('Table Structure', () => {
    it('should display table with correct columns', () => {
      cy.get('table').should('exist');
      cy.contains('th', 'House Number').should('be.visible');
      cy.contains('th', 'Block No').should('be.visible');
      cy.contains('th', 'Land No').should('be.visible');
      cy.contains('th', 'Price').should('be.visible');
      cy.contains('th', 'Status').should('be.visible');
    });

    it('should display house data in rows', () => {
      cy.get('tr.mat-mdc-row').should('have.length', 3);
    });
  });

  describe('Table Data', () => {
    it('should display house numbers', () => {
      cy.contains('td', 'H-001').should('be.visible');
      cy.contains('td', 'H-002').should('be.visible');
      cy.contains('td', 'H-003').should('be.visible');
    });

    it('should display formatted prices', () => {
      cy.contains('1.000.000.000').should('be.visible');
      cy.contains('500.000.000').should('be.visible');
    });

    it('should display status badges', () => {
      cy.get('.badge.bg-success').should('contain', 'AVAILABLE');
      cy.get('.badge.bg-warning').should('contain', 'BOOKED');
    });
  });

  describe('Sorting', () => {
    it('should sort by house number ascending', () => {
      cy.get('[mat-sort-header="houseNumber"]').click();
      cy.get('tr.mat-mdc-row').first().should('contain', 'H-001');
    });

    it('should sort by house number descending', () => {
      cy.get('[mat-sort-header="houseNumber"]').click().click();
      cy.get('tr.mat-mdc-row').first().should('contain', 'H-003');
    });

    it('should sort by price', () => {
      cy.get('[mat-sort-header="price"]').click();
      // Verify price sorting
    });
  });
});
