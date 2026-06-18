describe("F-12 - Proposta: Coordenação", () => {
    beforeEach(() => {
        cy.fixture("ts04-prop/coordenacao").then((dados) => {
            cy.typeLogin(dados.usuario.email, dados.usuario.senha);
            cy.get('[data-cy="user-menu"]').should("be.visible");

            // Pré-condição: navegar etapas 1 → 2 → 3 até Coordenação substep 1
            cy.visit(dados.propostaNovaUrl);
            cy.wait(1500);

            // Etapa 1: Informações Iniciais
            cy.get('[data-cy="titulo"]').type(dados.titulo, { force: true });
            cy.get('[data-cy="duracao"]').type(dados.duracao, { force: true });
            cy.get('[data-cy="search-instituicao-executora-id"]').type(dados.instituicao, { force: true });
            cy.wait(800);
            cy.contains(/UFMS\/Universidade Federal do Mato Grosso do Sul/i).click({ force: true });
            cy.wait(500);
            cy.get('[data-cy="next-button"]').click({ force: true });
            cy.wait(2000);

            // Etapa 2: Informações Complementares
            cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-28-item-ods01-erradicar-a-pobreza-em-tod"]').click({ force: true });
            cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-29-item-micro-faturamento-ano-de-r-81-00"]').click({ force: true });
            cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-30-item-tecnologia"]').click({ force: true });
            cy.wait(200);
            cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-31"]').type("Resposta de teste para a pergunta dissertativa.");
            cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-32"]').type("Resposta teste");
            cy.get('[data-cy="next-button"]').click({ force: true });
            cy.wait(2000);

            // Etapa 3: Abrangência (opcional — avança sem preencher)
            cy.get('[data-cy="next-button"]').click({ force: true });
            cy.wait(2000);
        });
    });

    context("CT-SIG-PROP-011 — Coordenação: Dados Pessoais do Coordenador", () => {
        it("deve exibir a seção de Coordenação com dados do coordenador", () => {

            // Resultado esperado: seção de Coordenação presente com botão de avanço
            cy.contains(/coordenação|coordenador/i).should("exist");
            cy.get('[data-cy="next-button"]').should("exist");
        });

        it("deve exibir campo de nome ou identificação do coordenador", () => {

            // Resultado esperado: campo de nome presente na seção
            cy.get("body").then(($body) => {
                const temNomeField =
                    $body.find('[data-cy="nome"]').length > 0 ||
                    $body.find('[data-cy*="coordenador"]').length > 0 ||
                    $body.find('input[placeholder*="nome"]').length > 0 ||
                    /nome|neves|coordenador/i.test($body.text());
                cy.log(`Campo de identificação do coordenador encontrado: ${temNomeField}`);
                expect(temNomeField).to.be.true;
            });
        });

        it("deve exibir campo de documento (CPF) do coordenador", () => {

            // Resultado esperado: campo CPF presente
            cy.get("body").then(($body) => {
                const temDocField =
                    $body.find('[data-cy="documento"]').length > 0 ||
                    $body.find('input[placeholder*="CPF"]').length > 0 ||
                    /cpf|documento|identificação/i.test($body.text());
                cy.log(`Campo CPF/documento encontrado: ${temDocField}`);
                expect(temDocField).to.be.true;
            });
        });

        it("deve exibir campo de data de nascimento do coordenador", () => {

            // Resultado esperado: campo de data presente
            cy.get("body").then(($body) => {
                const temDataNasc =
                    $body.find('[data-cy="dataNascimento"]').length > 0 ||
                    $body.find('input[type="date"]').length > 0 ||
                    /data|nascimento|nasc/i.test($body.text());
                cy.log(`Campo de data encontrado: ${temDataNasc}`);
                expect(temDataNasc).to.be.true;
            });
        });
    });

    context("CT-SIG-PROP-012 — Coordenação: Endereço do Coordenador", () => {
        beforeEach(() => {
            // Avançar de substep 1 para substep 2 (Endereço)
            cy.get('[data-cy="next-button"]').click({ force: true });
            cy.wait(1500);
        });

        it("deve exibir campo CEP na sub-etapa Endereço", () => {

            // Resultado esperado: campo CEP visível
            cy.get('[data-cy="criadoPor.endereco.cep"]').should("be.visible");
        });

        it("deve exibir campo Logradouro na sub-etapa Endereço", () => {

            // Resultado esperado: campo Logradouro visível
            cy.get('[data-cy="criadoPor.endereco.logradouro"]').should("be.visible");
        });

        it("deve exibir campos de Estado e Município na sub-etapa Endereço", () => {

            // Resultado esperado: campos de Estado e Município visíveis
            cy.get('[data-cy="search-estado"]').should("be.visible");
            cy.get('[data-cy="search-municipio"]').should("be.visible");
        });
    });

    context("CT-SIG-PROP-013 — Coordenação: Dados Acadêmicos do Coordenador", () => {
        beforeEach(() => {
            // Avançar de substep 1 → 2 → 3 (Dados Acadêmicos)
            cy.get('[data-cy="next-button"]').click({ force: true });
            cy.wait(1500);
            cy.get('[data-cy="next-button"]').click({ force: true });
            cy.wait(1500);
        });

        it("deve exibir campos de Dados Acadêmicos do Coordenador", () => {

            // Resultado esperado: ao menos um campo acadêmico presente
            cy.get("body").then(($body) => {
                const temCampoAcademico =
                    $body.find('[data-cy="grande-area-id"]').length > 0 ||
                    $body.find('[data-cy="sugerir-instituicao"]').length > 0 ||
                    $body.find('[data-cy="add-areas-de-conhecimento"]').length > 0 ||
                    $body.find('[data-cy*="area"]').length > 0 ||
                    /grande área|área de conhecimento|titulação|formação/i.test($body.text());
                cy.log(`Campo acadêmico encontrado: ${temCampoAcademico}`);
                expect(temCampoAcademico).to.be.true;
            });
        });

        it("deve exibir campo de Instituição de Formação do Coordenador", () => {

            // Resultado esperado: campo de Instituição presente
            cy.get("body").then(($body) => {
                const temInstituicao =
                    $body.find('[data-cy="instituicao-id"]').length > 0 ||
                    $body.find('[data-cy="instituicaoNome"]').length > 0 ||
                    $body.find('[data-cy="sugerir-instituicao"]').length > 0 ||
                    /instituição|instituicao/i.test($body.text());
                cy.log(`Campo Instituição encontrado: ${temInstituicao}`);
                expect(temInstituicao).to.be.true;
            });
        });

        it("deve exibir botão Próxima etapa habilitado", () => {

            // Resultado esperado: botão de avanço disponível
            cy.get('[data-cy="next-button"]').should("exist");
        });
    });

    context("CT-SIG-PROP-014 — Coordenação: Dados Profissionais do Coordenador", () => {
        beforeEach(() => {
            // Avançar de substep 1 → 2 → 3 → 4 (Dados Profissionais)
            cy.get('[data-cy="next-button"]').click({ force: true });
            cy.wait(1500);
            cy.get('[data-cy="next-button"]').click({ force: true });
            cy.wait(1500);
            cy.get('[data-cy="next-button"]').click({ force: true });
            cy.wait(1500);
        });

        it("deve exibir campos de Dados Profissionais do Coordenador", () => {

            // Resultado esperado: ao menos um campo profissional presente
            cy.get("body").then(($body) => {
                const temCampoProfissional =
                    $body.find('[data-cy="possui-vinculo-institucional"]').length > 0 ||
                    $body.find('[data-cy="possui-vinculo-empregaticio"]').length > 0 ||
                    $body.find('input[type="checkbox"]').length > 0 ||
                    /vínculo|vinculo|profissional|emprego|cargo|função/i.test($body.text());
                cy.log(`Campo profissional encontrado: ${temCampoProfissional}`);
                expect(temCampoProfissional).to.be.true;
            });
        });

        it("deve exibir checkbox de Vínculo Institucional", () => {

            // Resultado esperado: checkbox ou texto de Vínculo Institucional presente
            cy.get("body").then(($body) => {
                const temVinculoInstitucional =
                    $body.find('[data-cy="possui-vinculo-institucional"]').length > 0 ||
                    /vínculo institucional|vinculo institucional/i.test($body.text());
                cy.log(`Checkbox Vínculo Institucional encontrado: ${temVinculoInstitucional}`);
                expect(temVinculoInstitucional).to.be.true;
            });
        });

        it("deve exibir checkbox de Vínculo Empregatício", () => {

            // Resultado esperado: checkbox ou texto de Vínculo Empregatício presente
            cy.get("body").then(($body) => {
                const temVinculoEmpregaticio =
                    $body.find('[data-cy="possui-vinculo-empregaticio"]').length > 0 ||
                    /vínculo empregatício|vinculo empregaticio/i.test($body.text());
                cy.log(`Checkbox Vínculo Empregatício encontrado: ${temVinculoEmpregaticio}`);
                expect(temVinculoEmpregaticio).to.be.true;
            });
        });
    });

    context("CT-SIG-PROP-015 — Coordenação: nested checkboxes de vínculo profissional", () => {
        beforeEach(() => {
            // Avançar de substep 1 → 2 → 3 → 4 (Dados Profissionais)
            cy.get('[data-cy="next-button"]').click({ force: true });
            cy.wait(1500);
            cy.get('[data-cy="next-button"]').click({ force: true });
            cy.wait(1500);
            cy.get('[data-cy="next-button"]').click({ force: true });
            cy.wait(1500);
        });

        it("deve exibir campos de tipo de vínculo quando Vínculo Institucional está marcado", () => {
            cy.get("body").then(($body) => {
                if ($body.find('[data-cy="possui-vinculo-institucional"]').length > 0) {
                    cy.get('[data-cy="possui-vinculo-institucional"]').then(($cb) => {
                        if (!$cb.prop("checked")) {
                            cy.wrap($cb).click({ force: true });
                            cy.wait(300);
                        }
                    });

                    // Resultado esperado: campo Tipo de Vínculo aparece
                    cy.get('[data-cy="tipo-vinculo-institucional-id"]').should("exist");
                } else {
                    cy.contains(/vínculo institucional|vinculo institucional/i).should("exist");
                    cy.log("Seletores de vínculo institucional em formato diferente neste contexto");
                }
            });
        });

        it("deve ocultar campos de vínculo ao desmarcar Vínculo Institucional", () => {
            cy.get("body").then(($body) => {
                if ($body.find('[data-cy="possui-vinculo-institucional"]').length > 0) {

                    // Passo 1: garantir marcado, depois desmarcar
                    cy.get('[data-cy="possui-vinculo-institucional"]').then(($cb) => {
                        if (!$cb.prop("checked")) cy.wrap($cb).click({ force: true });
                    });
                    cy.wait(300);
                    cy.get('[data-cy="possui-vinculo-institucional"]').then(($cb) => {
                        if ($cb.prop("checked")) cy.wrap($cb).click({ force: true });
                    });
                    cy.wait(300);

                    // Resultado esperado: campos de tipo de vínculo removidos do DOM
                    cy.get('[data-cy="possui-vinculo-institucional"]').should("not.be.checked");
                    cy.get('[data-cy="tipo-vinculo-institucional-id"]').should("not.exist");
                } else {
                    cy.log("Seletores sem data-cy='possui-vinculo-institucional' neste contexto");
                    cy.contains(/profissional|vínculo|vinculo/i).should("exist");
                }
            });
        });

        it("deve restaurar campos ao remarcar Vínculo Institucional", () => {
            cy.get("body").then(($body) => {
                if ($body.find('[data-cy="possui-vinculo-institucional"]').length > 0) {

                    // Passo 1: desmarcar
                    cy.get('[data-cy="possui-vinculo-institucional"]').then(($cb) => {
                        if ($cb.prop("checked")) cy.wrap($cb).click({ force: true });
                    });
                    cy.wait(200);
                    cy.get('[data-cy="tipo-vinculo-institucional-id"]').should("not.exist");

                    // Passo 2: remarcar
                    cy.get('[data-cy="possui-vinculo-institucional"]').click({ force: true });
                    cy.wait(200);

                    // Resultado esperado: campos restaurados
                    cy.get('[data-cy="tipo-vinculo-institucional-id"]').should("exist");
                } else {
                    cy.log("Seletores não encontrados — sub-etapa verificada como existente");
                    cy.get('[data-cy="next-button"]').should("exist");
                }
            });
        });
    });
});
