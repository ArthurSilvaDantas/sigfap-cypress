describe("F-04 - Perfil: Endereço", () => {
    beforeEach(() => {
        cy.fixture("ts02-perf/endereco").then((dados) => {
            cy.typeLogin(dados.usuario.email, dados.usuario.senha);
            cy.get('[data-cy="user-menu"]').click();
            cy.get('[data-cy="editar-perfil"]').click();
            cy.get('[data-cy="endereco"]').click();
        });
    });

    context("CT-SIG-PERF-004 — Endereço: CEP válido aciona autopreenchimento", () => {
        it("deve preencher Logradouro, Estado e Município automaticamente após CEP válido e salvar", () => {
            cy.fixture("ts02-perf/endereco").then((dados) => {

                // Passo 1: digitar CEP válido
                cy.get('[data-cy="endereco.cep"]').clear().type(dados.cep);

                // Passo 2: aguardar autopreenchimento via API de CEP
                cy.get('[data-cy="endereco.logradouro"]', { timeout: 8000 }).should("not.have.value", "");

                // Passo 3: verificar campos preenchidos automaticamente
                cy.get('[data-cy="endereco.logradouro"]').should("not.have.value", "");
                cy.get('[data-cy="endereco.bairro"]').should("not.have.value", "");
                cy.get('[data-cy="search-estado"]').should("not.have.value", "");
                cy.get('[data-cy="search-municipio"]').should("not.have.value", "");

                // Passo 4: preencher Número
                cy.get('[data-cy="endereco.numero"]').clear().type(dados.numero);

                // Passo 5: preencher Complemento
                cy.get('[data-cy="endereco.complemento"]').clear().type(dados.complemento);

                // Passo 5: salvar
                cy.contains("button", /salvar/i).click();

                // Resultado esperado: mensagem de sucesso
                cy.contains(/sucesso|atualizado|salvo/i).should("be.visible");
            });
        });
    });

    context("CT-SIG-PERF-005 — Endereço: CEP inválido ou inexistente", () => {
        it("deve não preencher o endereço e/ou exibir erro para cada CEP inválido", () => {
            cy.fixture("ts02-perf/ceps-invalidos").then(
                (ceps: Array<{ cep: string; descricao: string }>) => {
                    ceps.forEach((item, idx) => {
                        cy.log(`[${idx + 1}/${ceps.length}] ${item.descricao}: "${item.cep}"`);

                        // Passo 1: limpar Logradouro e digitar CEP inválido
                        cy.get('[data-cy="endereco.logradouro"]').clear();
                        cy.get('[data-cy="endereco.cep"]').clear().type(item.cep);

                        // Passo 2: aguardar possível chamada à API
                        cy.wait(3000);

                        // Resultado esperado: Logradouro permanece vazio OU sistema exibe erro de CEP
                        cy.get("body").then(($body) => {
                            const temErro =
                                /cep.*inválido|cep.*não.*encontrado|cep.*inexistente|erro.*cep|not.*found|invalid.*zip|formato.*cep/i.test(
                                    $body.text()
                                );
                            if (temErro) {
                                cy.log(`✔ Sistema exibiu erro de CEP para: "${item.cep}"`);
                            } else {
                                cy.get('[data-cy="endereco.logradouro"]')
                                    .invoke("val")
                                    .then((val) => {
                                        cy.log(`Logradouro após CEP inválido "${item.cep}": "${val}"`);
                                        expect(
                                            val as string,
                                            `CEP inválido "${item.cep}" não deveria preencher o logradouro`
                                        ).to.equal("");
                                    });
                            }
                        });
                    });
                }
            );
        });
    });
});
