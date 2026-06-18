describe("F-08 - Editais: Listagem", () => {
    beforeEach(() => {
        cy.fixture("ts03-edit/listagem-editais").then((dados) => {
            cy.typeLogin(dados.usuario.email, dados.usuario.senha);
            cy.get('[data-cy="user-menu"]').should("be.visible");
        });
    });

    context("CT-SIG-EDIT-001 — Listagem de editais disponíveis", () => {
        it("deve exibir seção de editais na home com botão Ver mais", () => {

            // Passo 1: acessar home autenticado
            cy.visit("/");
            cy.wait(1500);

            // Resultado esperado: seção de editais visível com botão Ver mais
            cy.get('[data-cy="editais-ver-mais"]').should("exist");
            cy.get('[data-cy^="editais-"]').its("length").should("be.gt", 0);
        });

        it("deve exibir listagem completa de editais ao clicar em Ver mais", () => {

            // Passo 1: acessar home
            cy.visit("/");
            cy.wait(1500);

            // Passo 2: clicar em Ver mais
            cy.get('[data-cy="editais-ver-mais"]').click();
            cy.wait(1500);

            // Resultado esperado: página de listagem exibida com opções de visualizar
            cy.contains(/visualização dos editais/i).should("exist");
            cy.contains(/visualizar edital/i).should("exist");
        });
    });
});
