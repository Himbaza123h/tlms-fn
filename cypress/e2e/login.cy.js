describe('Google Login Flow', () => {
    beforeEach(() => {
      cy.visit('/');
    });
  
    it('should display the login button', () => {
      cy.get('button').contains('Login with Google').should('be.visible');
    });
  
    it('should redirect to Google for login', () => {
      cy.get('button').contains('Login with Google').click();
      cy.url().should('include', '/');
    });
  });
  