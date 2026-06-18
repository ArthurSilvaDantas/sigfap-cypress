describe("F-10 - Proposta: Criação", () => {
    beforeEach(() => {
        cy.fixture("ts04-prop/criacao-proposta").then((dados) => {
            cy.typeLogin(dados.usuario.email, dados.usuario.senha);
            cy.get('[data-cy="user-menu"]').should("be.visible");

            // Pré-condição: navegar até o detalhe do edital
            cy.visit("/");
            cy.wait(1500);
            cy.get('[data-cy="editais-ver-mais"]').click();
            cy.wait(1500);
            cy.contains(/visualizar edital/i).first().click();
            cy.wait(1500);
        });
    });

    context("CT-SIG-PROP-001 — Iniciar criação de proposta", () => {
        it("deve abrir formulário de proposta ao clicar em Criar Proposta", () => {

            // Passo 1: clicar em Criar Proposta no detalhe do edital
            cy.get('[data-cy="criar-proposta"]').click({ force: true });
            cy.wait(2000);

            // Resultado esperado: etapa Informações Iniciais acessível
            cy.get('[data-cy="informacoes-iniciais"]').should("exist");
        });

        it("deve exibir sidebar com etapas do formulário de proposta", () => {

            // Passo 1: abrir formulário
            cy.get('[data-cy="criar-proposta"]').click({ force: true });
            cy.wait(2000);

            // Resultado esperado: sidebar com todas as etapas visíveis
            cy.get('[data-cy="caracterizacao"]').should("exist");
            cy.get('[data-cy="coordenacao"]').should("exist");
            cy.get('[data-cy="apresentacao"]').should("exist");
            cy.get('[data-cy="finalizacao"]').should("exist");
        });

        it("deve exibir campos Título do Projeto e Duração na etapa 1", () => {

            // Passo 1: abrir formulário
            cy.get('[data-cy="criar-proposta"]').click({ force: true });
            cy.wait(2000);

            // Resultado esperado: campos obrigatórios da etapa 1 presentes
            cy.get('[data-cy="titulo"]').should("exist");
            cy.get('[data-cy="duracao"]').should("exist");
        });
    });
});
