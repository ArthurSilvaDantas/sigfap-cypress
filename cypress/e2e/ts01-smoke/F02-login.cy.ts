describe("F-02 - Smoke: Login", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    context("CT-SIG-SMOKE-005 — Login com credenciais válidas", () => {
        it("deve autenticar o usuário e exibir o menu de usuário na Home após login válido", () => {
            cy.fixture("ts01-smoke/login").then((dados) => {
                cy.typeLogin(dados.usuario.email, dados.usuario.senha);

                // Resultado esperado: menu de usuário visível, não na página de login
                cy.get('[data-cy="user-menu"]').should("be.visible");
                cy.url().should("not.include", "/login");
            });
        });
    });

    context("CT-SIG-SMOKE-006 — Login com credenciais inválidas", () => {
        it("deve exibir erro genérico para cada combinação de credencial inválida", () => {
            cy.fixture("ts01-smoke/credenciais-invalidas").then(
                (credenciais: Array<{ email: string; senha: string; descricao: string }>) => {
                    credenciais.forEach((item, idx) => {
                        cy.log(`[${idx + 1}/${credenciais.length}] ${item.descricao}`);
                        cy.visit("/");

                        cy.get('[data-cy="email"]').type(item.email);
                        cy.get('[data-cy="senha"]').type(item.senha);
                        cy.get('[data-cy="loginButton"]').click();

                        // Resultado esperado: erro de credenciais, botão de login ainda presente
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

    context("CT-SIG-SMOKE-007 — Login com campos vazios", () => {
        it("deve exibir mensagens de campo obrigatório ao submeter login sem preencher os campos", () => {
            cy.get('[data-cy="loginButton"]').click();

            // Resultado esperado: mensagem de campo obrigatório, sem login efetuado
            cy.contains(/inválido|inválida|invalid|obrigatório|required|erro|error|preencha/i).should("be.visible");
            cy.get('[data-cy="loginButton"]').should("exist");
            cy.get('[data-cy="user-menu"]').should("not.exist");
        });
    });
});
