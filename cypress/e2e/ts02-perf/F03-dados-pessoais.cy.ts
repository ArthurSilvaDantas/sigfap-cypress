describe("F-03 - Perfil: Dados Pessoais", () => {
    beforeEach(() => {
        cy.fixture("ts02-perf/dados-pessoais").then((dados) => {
            cy.typeLogin(dados.usuario.email, dados.usuario.senha);
            cy.get('[data-cy="user-menu"]').click();
            cy.get('[data-cy="editar-perfil"]').click();
        });
    });

    context("CT-SIG-PERF-001 — Dados Pessoais: preenchimento válido", () => {
        it("deve salvar Dados Pessoais com campos obrigatórios e exibir mensagem de sucesso", () => {
            cy.fixture("ts02-perf/dados-pessoais").then((dados) => {

                // Passo 1: verificar que E-mail está em modo somente-leitura
                cy.get('[data-cy="email"]').should("have.value", dados.usuario.email);

                // Passo 2: preencher Nome
                cy.get('[data-cy="nome"]').clear().type(dados.nome);

                // Passo 3: preencher Data de Nascimento
                cy.get('[data-cy="dataNascimento"]').clear({ force: true }).type(dados.dataNascimento, { force: true });

                // Passo 4: selecionar Sexo
                cy.get('[data-cy="search-sexo"]').clear().type(dados.sexo);
                cy.wait(500);
                cy.contains(new RegExp(dados.sexo, "i")).click({ force: true });

                // Passo 5: selecionar País = Brasil (campo CPF aparece após esta seleção)
                cy.get('[data-cy="search-pais-id"]').clear().type(dados.pais);
                cy.wait(500);
                cy.contains(new RegExp(`^${dados.pais}$`, "i")).click({ force: true });

                // Passo 6: selecionar Raça/Cor
                cy.get('[data-cy="search-raca-cor-id"]').clear().type("Branco");
                cy.wait(500);
                cy.contains(/branco\(a\)/i).click({ force: true });

                // Passo 7: verificar que campo CPF está presente (aparece após País = Brasil)
                cy.get('[data-cy="documento"]').should("exist");

                // Passo 8: salvar
                cy.contains("button", /salvar/i).click();

                // Resultado esperado: mensagem de sucesso, E-mail inalterado
                cy.contains(/sucesso|atualizado|salvo/i).should("be.visible");
                cy.get('[data-cy="email"]').should("have.value", dados.usuario.email);
            });
        });
    });

    context("CT-SIG-PERF-002 — Nome acima do limite máximo de caracteres", () => {
        it("deve aceitar Nome com exatamente 64 caracteres (valor limite máximo)", () => {
            cy.fixture("ts02-perf/dados-pessoais").then((dados) => {

                // Passo 1: preencher Nome com 64 caracteres (máximo válido)
                const nome64 = "A".repeat(64);
                cy.get('[data-cy="nome"]').clear().type(nome64);

                // Resultado esperado: campo aceita exatamente 64 chars, sem erro ao salvar
                cy.get('[data-cy="nome"]').invoke("val").should("have.length.lte", 64);
                cy.contains("button", /salvar/i).click();
                cy.contains(/obrigatório|limite|máximo|excede/i).should("not.exist");
            });
        });

        it("deve truncar ou rejeitar Nome com 65 caracteres (max+1)", () => {
            cy.fixture("ts02-perf/dados-pessoais").then((dados) => {

                // Passo 1: preencher Nome com 65 caracteres (max+1)
                const nome65 = "A".repeat(65);
                cy.get('[data-cy="nome"]').clear().type(nome65);

                // Resultado esperado: campo trunca para 64 chars OU salvar exibe erro de limite
                cy.get('[data-cy="nome"]').invoke("val").then((val) => {
                    const comprimento = (val as string).length;
                    if (comprimento >= 65) {
                        cy.contains("button", /salvar/i).click();
                        cy.contains(/limite|máximo|muito longo|excede|caracteres/i).should("be.visible");
                    } else {
                        expect(comprimento).to.be.lte(64);
                    }
                });
            });
        });

        it("deve exibir erro de validação ao tentar salvar com Nome vazio", () => {
            cy.fixture("ts02-perf/dados-pessoais").then((dados) => {

                // Passo 1: limpar o campo Nome e tentar salvar
                cy.get('[data-cy="nome"]').clear();
                cy.contains("button", /salvar/i).click();

                // Resultado esperado: mensagem de validação de campo obrigatório
                cy.contains(/mínimo|caractere|obrigatório|required|preencha|nome.*vazio|blank/i).should("be.visible");
            });
        });
    });

    context("CT-SIG-PERF-003 — Data de nascimento inválida (futura)", () => {
        it("deve documentar comportamento ao informar data de nascimento futura", () => {
            cy.fixture("ts02-perf/dados-pessoais").then((dados) => {

                // Passo 1: preencher Data de Nascimento com data futura
                cy.get('[data-cy="dataNascimento"]').clear({ force: true }).type(dados.dataNascimentoFutura, { force: true });

                // Passo 2: tentar salvar
                cy.contains("button", /salvar/i).click();

                cy.contains(/erro|inválid|futura|data.*inválida|não.*permitid/i).should("be.visible");
                cy.contains(/sucesso|atualizado|salvo/i).should("not.exist");
            });
        });
    });

    context("CT-SIG-PERF-011 — Dados Pessoais: CPF com dígito verificador inválido", () => {
        // BLOQUEIO DE SISTEMA: CPF é campo obrigatório no cadastro — todo usuário
        // registrado nasce com CPF preenchido e o campo fica permanentemente desabilitado
        // no perfil. Não existe fluxo para criar um usuário sem CPF no sistema atual.
        // O teste data-driven com cpfs-invalidos.json não pode ser automatizado até que
        // o sistema permita edição de CPF ou o cadastro sem CPF.
        it("deve confirmar que o campo CPF está presente, desabilitado e no formato correto", () => {
            cy.fixture("ts02-perf/dados-pessoais").then((dados) => {

                // Passo 1: selecionar País = Brasil para exibir o campo CPF
                cy.get('[data-cy="search-pais-id"]').clear();
                cy.get('[data-cy="search-pais-id"]').type(dados.pais);
                cy.wait(500);
                cy.contains(new RegExp(`^${dados.pais}$`, "i")).click({ force: true });

                // Resultado esperado: campo CPF presente, desabilitado e no formato xxx.xxx.xxx-xx
                cy.get('[data-cy="documento"]')
                    .should("exist")
                    .and("be.disabled")
                    .invoke("val")
                    .should("match", /^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
            });
        });
    });

    context("CT-SIG-PERF-012 — Dados Pessoais: País → CPF condicional", () => {
        it("deve exibir o campo CPF quando País = Brasil é selecionado", () => {
            cy.fixture("ts02-perf/dados-pessoais").then((dados) => {

                // Passo 1: selecionar País = Brasil
                // chain quebrada intencionalmente: .clear().type() causa detach após re-render do React
                cy.get('[data-cy="search-pais-id"]').clear();
                cy.get('[data-cy="search-pais-id"]').type(dados.pais);
                cy.wait(500);
                cy.contains(new RegExp(`^${dados.pais}$`, "i")).click({ force: true });

                // Resultado esperado: campo CPF visível
                cy.get('[data-cy="documento"]').should("exist");
            });
        });

        it("deve ocultar o campo CPF quando País diferente de Brasil é selecionado", () => {
            cy.fixture("ts02-perf/dados-pessoais").then((dados) => {

                // Passo 1: selecionar País alternativo (não Brasil)
                // chain quebrada intencionalmente: .clear().type() causa detach após re-render do React
                cy.get('[data-cy="search-pais-id"]').clear();
                cy.get('[data-cy="search-pais-id"]').type(dados.paisAlternativo);
                cy.wait(1000);
                cy.contains(new RegExp(dados.paisAlternativo, "i")).click({ force: true });

                // Resultado esperado: campo CPF não está no DOM
                cy.get('[data-cy="documento"]').should("not.exist");
            });
        });
    });
});
