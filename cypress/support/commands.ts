// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("typeLogin", (username, password) => {
  cy.visit("/");
  cy.get('[data-cy="email"]').type(username);
  cy.get('[data-cy="senha"]').type(password);
  cy.get('[data-cy="loginButton"]').click(); //Botão Acessar da página principal
});

Cypress.Commands.add("getByLabel", (label) => {
  return cy
    .contains("label", label, { matchCase: false })
    .should("be.visible")
    .invoke("attr", "for")
    .then((fieldId) => {
      expect(fieldId, `campo associado ao rotulo "${label}"`)
        .to.be.a("string")
        .and.not.be.empty;

      return cy.get(`[id="${fieldId}"]`);
    });
});
