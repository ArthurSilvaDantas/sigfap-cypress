describe("CT-SIG-SMOKE-006 — Login com credenciais inválidas", () => {
  it("deve exibir erro genérico para cada combinação de credencial inválida", () => {
    cy.fixture("ts01-smoke/credenciais-invalidas").then(
      (credenciais: Array<{ email: string; senha: string; descricao: string }>) => {
        credenciais.forEach((item, idx) => {
          cy.log(`[${idx + 1}/${credenciais.length}] ${item.descricao}`);
          cy.visit("/");

          cy.get('[data-cy="email"]').type(item.email);
          cy.get('[data-cy="senha"]').type(item.senha);
          cy.get('[data-cy="loginButton"]').click();

          cy.contains(
            /credenciais|inválid|incorret|usuário.*não.*encontrado|e-mail.*senha|não.*autorizado|unauthorized|login.*fail|erro|error/i
          ).should("be.visible");
          cy.get('[data-cy="loginButton"]').should("exist");
          cy.get('[data-cy="user-menu"]').should("not.exist");
        });
      }
    );
  });
});
