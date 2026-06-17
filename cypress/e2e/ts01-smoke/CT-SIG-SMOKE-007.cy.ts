describe("CT-SIG-SMOKE-007 — Login com campos vazios", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("deve exibir mensagens de campo obrigatório ao submeter login sem preencher os campos", () => {
    cy.get('[data-cy="loginButton"]').click();
    cy.contains(/inválido|inválida|invalid|obrigatório|required|erro|error|preencha/i).should("be.visible");
    cy.get('[data-cy="loginButton"]').should("exist");
    cy.get('[data-cy="user-menu"]').should("not.exist");
  });
});
