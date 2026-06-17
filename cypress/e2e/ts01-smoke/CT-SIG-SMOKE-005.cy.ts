describe("CT-SIG-SMOKE-005 — Login com credenciais válidas", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("deve autenticar o usuário e exibir o menu de usuário na Home após login válido", () => {
    cy.fixture("ts01-smoke/usuarios").then((usuarios) => {
      cy.typeLogin(usuarios.proponente.email, usuarios.proponente.senha);
      cy.get('[data-cy="user-menu"]').should("be.visible");
      cy.url().should("not.include", "/login");
    });
  });
});
