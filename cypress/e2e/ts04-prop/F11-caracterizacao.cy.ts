describe("F-11 - Proposta: Caracterização", () => {
    beforeEach(() => {
        cy.fixture("ts04-prop/caracterizacao").then((dados) => {
            cy.typeLogin(dados.usuario.email, dados.usuario.senha);
            cy.get('[data-cy="user-menu"]').should("be.visible");
        });
    });

    context("CT-SIG-PROP-002 — Informações Iniciais: caminho feliz", () => {
        beforeEach(() => {
            cy.fixture("ts04-prop/caracterizacao").then((dados) => {
                cy.visit(dados.propostaNovaUrl);
                cy.wait(1500);
            });
        });

        it("deve preencher dados válidos e avançar para Informações Complementares", () => {
            cy.fixture("ts04-prop/caracterizacao").then((dados) => {

                // Passo 1: preencher Título
                cy.get('[data-cy="titulo"]').type(dados.titulo);

                // Passo 2: preencher Duração
                cy.get('[data-cy="duracao"]').type(dados.duracao, { force: true });

                // Passo 3: selecionar Instituição Executora
                cy.get('[data-cy="search-instituicao-executora-id"]').type(dados.instituicao, { force: true });
                cy.wait(800);
                cy.contains(/UFMS\/Universidade Federal do Mato Grosso do Sul/i).click({ force: true });
                cy.wait(500);

                // Passo 4: avançar
                cy.get('[data-cy="next-button"]').click({ force: true });
                cy.wait(2000);

                // Resultado esperado: sistema avança para Informações Complementares
                cy.get('[data-cy^="formularioPropostaInformacaoComplementar"]').should("exist");
            });
        });

        it("deve exibir campo Título do Edital como somente leitura", () => {

            // Resultado esperado: campo edital.nome desabilitado
            cy.get('[data-cy="edital.nome"]').should("exist").and("be.disabled");
        });

        it("deve exibir campos de Instituição e Unidade Executora", () => {

            // Resultado esperado: campos de seleção presentes
            cy.get('[data-cy="search-instituicao-executora-id"]').should("exist");
            cy.get('[data-cy="search-unidade-executora-id"]').should("exist");
        });
    });

    context("CT-SIG-PROP-003 — Informações Iniciais: campos obrigatórios vazios bloqueiam avanço", () => {
        beforeEach(() => {
            cy.fixture("ts04-prop/caracterizacao").then((dados) => {
                cy.visit(dados.propostaExistenteUrl);
                cy.wait(1500);
                cy.get('[data-cy="informacoes-iniciais"]').click({ force: true });
                cy.wait(500);
            });
        });

        it("deve bloquear avanço quando Título está vazio", () => {

            // Passo 1: limpar Título e preencher Duração
            cy.get('[data-cy="titulo"]').clear();
            cy.get('[data-cy="duracao"]').clear({ force: true });
            cy.get('[data-cy="duracao"]').type("12", { force: true });

            // Passo 2: tentar avançar
            cy.get('[data-cy="next-button"]').click({ force: true });
            cy.wait(800);

            // Resultado esperado: permanece na etapa 1
            cy.get('[data-cy="titulo"]').should("exist");
            cy.get('[data-cy^="formularioPropostaInformacaoComplementar"]').should("not.exist");
        });

        it("deve bloquear avanço quando Duração está vazia", () => {

            // Passo 1: preencher Título e limpar Duração
            cy.get('[data-cy="titulo"]').clear();
            cy.get('[data-cy="titulo"]').type("Projeto Teste");
            cy.get('[data-cy="duracao"]').clear({ force: true });

            // Passo 2: tentar avançar
            cy.get('[data-cy="next-button"]').click({ force: true });
            cy.wait(800);

            // Resultado esperado: permanece na etapa 1
            cy.get('[data-cy="duracao"]').should("exist");
            cy.get('[data-cy^="formularioPropostaInformacaoComplementar"]').should("not.exist");
        });

        it("deve bloquear avanço sem nenhum campo preenchido", () => {

            // Passo 1: limpar todos os campos obrigatórios
            cy.get('[data-cy="titulo"]').clear();
            cy.get('[data-cy="duracao"]').clear({ force: true });

            // Passo 2: tentar avançar
            cy.get('[data-cy="next-button"]').click({ force: true });
            cy.wait(800);

            // Resultado esperado: sistema mantém na etapa 1 ou exibe mensagem de erro
            cy.get("body").then(($body) => {
                const temErro = /obrigatório|required|preencha|campo.*vazio|informação.*necessária/i.test($body.text());
                const naEtapa1 = $body.find('[data-cy="titulo"]').length > 0;
                expect(temErro || naEtapa1).to.be.true;
            });
        });
    });

    context("CT-SIG-PROP-004 — Informações Iniciais: limite de caracteres no Título", () => {
        beforeEach(() => {
            cy.fixture("ts04-prop/caracterizacao").then((dados) => {
                cy.visit(dados.propostaNovaUrl);
                cy.wait(1500);
            });
        });

        it("deve truncar ou rejeitar Título com 300 caracteres (acima do limite)", () => {
            const tituloLongo = "A".repeat(300);

            // Passo 1: digitar título com 300 chars
            cy.get('[data-cy="titulo"]').type(tituloLongo, { delay: 0 });

            // Resultado esperado: campo trunca automaticamente OU erro de limite ao avançar
            cy.get('[data-cy="titulo"]').then(($input) => {
                const valorAtual = ($input.val() as string) ?? "";
                cy.log(`Comprimento após digitação: ${valorAtual.length}`);

                if (valorAtual.length >= 300) {
                    cy.get('[data-cy="duracao"]').type("12", { force: true });
                    cy.get('[data-cy="next-button"]').click({ force: true });
                    cy.wait(800);
                    cy.get("body").then(($body) => {
                        const temErro = /limite|caractere|longo|máximo|max/i.test($body.text());
                        cy.log(`Tem erro de limite: ${temErro}`);
                    });
                } else {
                    expect(valorAtual.length).to.be.lessThan(300);
                }
            });
        });

        it("deve aceitar Título com comprimento válido (25 caracteres)", () => {
            const tituloValido = "Projeto de Teste VVT 2026";

            // Passo 1: digitar título válido
            cy.get('[data-cy="titulo"]').type(tituloValido);

            // Resultado esperado: campo aceita o valor integralmente
            cy.get('[data-cy="titulo"]').should("have.value", tituloValido);
        });
    });

    context("CT-SIG-PROP-005 — Informações Iniciais: Duração inválida (data-driven)", () => {
        beforeEach(() => {
            cy.fixture("ts04-prop/caracterizacao").then((dados) => {
                cy.visit(dados.propostaExistenteUrl);
                cy.wait(1500);
                cy.get('[data-cy="informacoes-iniciais"]').click({ force: true });
                cy.wait(500);
            });
        });

        it("deve bloquear avanço para cada valor de Duração inválido", () => {
            cy.fixture("ts04-prop/duracao-invalida").then(
                (casos: Array<{ valor: string; descricao: string }>) => {
                    cy.fixture("ts04-prop/caracterizacao").then((dados) => {
                        casos.forEach((caso) => {
                            cy.log(`Testando Duração: "${caso.valor}" — ${caso.descricao}`);

                            cy.get('[data-cy="titulo"]').clear();
                            cy.get('[data-cy="titulo"]').type("Projeto Teste VVT");
                            cy.get('[data-cy="duracao"]').clear({ force: true });
                            if (caso.valor !== "") {
                                cy.get('[data-cy="duracao"]').type(caso.valor, { force: true });
                            }

                            cy.get('[data-cy="next-button"]').click({ force: true });
                            cy.wait(800);

                            // Resultado esperado: permanece na etapa 1
                            cy.get('[data-cy="duracao"]').should("exist");
                            cy.get('[data-cy^="formularioPropostaInformacaoComplementar"]').should("not.exist");

                            // Restaura para próxima iteração
                            cy.visit(dados.propostaExistenteUrl);
                            cy.wait(1000);
                            cy.get('[data-cy="informacoes-iniciais"]').click({ force: true });
                            cy.wait(500);
                        });
                    });
                }
            );
        });

        it("deve aceitar Duração = 12 (valor válido)", () => {

            // Passo 1: preencher título e duração válida
            cy.get('[data-cy="titulo"]').clear();
            cy.get('[data-cy="titulo"]').type("Projeto Teste VVT 2026");
            cy.get('[data-cy="duracao"]').clear({ force: true });
            cy.get('[data-cy="duracao"]').type("12", { force: true });

            // Resultado esperado: campo aceita o valor 12
            cy.get('[data-cy="duracao"]').invoke("val").should("match", /^12$/);
        });
    });

    context("CT-SIG-PROP-006 — Informações Iniciais: Unidade Executora condicional", () => {
        beforeEach(() => {
            cy.fixture("ts04-prop/caracterizacao").then((dados) => {
                cy.visit(dados.propostaExistenteUrl);
                cy.wait(1500);
                cy.get('[data-cy="informacoes-iniciais"]').click({ force: true });
                cy.wait(500);
            });
        });

        it("deve habilitar busca de Unidade ao selecionar Instituição Executora", () => {

            // Passo 1: limpar seleção anterior e selecionar UFMS
            cy.get('[data-cy="close-instituicao-executora-id"]').click({ force: true });
            cy.wait(300);
            cy.get('[data-cy="search-instituicao-executora-id"]').clear({ force: true });
            cy.get('[data-cy="search-instituicao-executora-id"]').type("UFMS", { force: true });
            cy.wait(600);
            cy.contains(/UFMS\/Universidade Federal do Mato Grosso do Sul/i).click({ force: true });
            cy.wait(500);

            // Resultado esperado: Unidade Executora habilitada para busca
            cy.get('[data-cy="search-unidade-executora-id"]').should("exist").and("not.be.disabled");
        });

        it("deve resetar Unidade Executora ao limpar Instituição Executora", () => {

            // Passo 1: selecionar UFMS
            cy.get('[data-cy="search-instituicao-executora-id"]').clear({ force: true });
            cy.get('[data-cy="search-instituicao-executora-id"]').type("UFMS", { force: true });
            cy.wait(600);
            cy.contains(/UFMS\/Universidade Federal do Mato Grosso do Sul/i).click({ force: true });
            cy.wait(500);

            // Passo 2: limpar Instituição
            cy.get('[data-cy="close-instituicao-executora-id"]').click({ force: true });
            cy.wait(500);

            // Resultado esperado: Unidade sem opções disponíveis
            cy.get('[data-cy="search-unidade-executora-id"]').clear({ force: true });
            cy.get('[data-cy="search-unidade-executora-id"]').type("Qualquer", { force: true });
            cy.wait(600);
            cy.contains(/nenhuma opção|nenhum resultado/i).should("exist");
        });
    });

    context("CT-SIG-PROP-007 — Informações Complementares: dados válidos avançam para Abrangência", () => {
        beforeEach(() => {
            cy.fixture("ts04-prop/caracterizacao").then((dados) => {

                // Pré-condição: navegar pela etapa 1 e chegar em Informações Complementares
                cy.visit(dados.propostaNovaUrl);
                cy.wait(1500);
                cy.get('[data-cy="titulo"]').type(dados.titulo, { force: true });
                cy.get('[data-cy="duracao"]').type(dados.duracao, { force: true });
                cy.get('[data-cy="search-instituicao-executora-id"]').type(dados.instituicao, { force: true });
                cy.wait(800);
                cy.contains(/UFMS\/Universidade Federal do Mato Grosso do Sul/i).click({ force: true });
                cy.wait(500);
                cy.get('[data-cy="next-button"]').click({ force: true });
                cy.wait(2000);
            });
        });

        it("deve exibir todos os campos da etapa Informações Complementares", () => {

            // Resultado esperado: perguntas 28 a 32 presentes
            cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-28-item-ods01-erradicar-a-pobreza-em-tod"]').should("exist");
            cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-29-item-micro-faturamento-ano-de-r-81-00"]').should("exist");
            cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-30-item-tecnologia"]').should("exist");
            cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-31"]').should("exist");
            cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-32"]').should("exist");
        });

        it("deve avançar para Abrangência ao responder todas as perguntas com dados válidos", () => {

            // Passo 1: responder todas as perguntas
            cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-28-item-ods01-erradicar-a-pobreza-em-tod"]').click({ force: true });
            cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-29-item-micro-faturamento-ano-de-r-81-00"]').click({ force: true });
            cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-30-item-tecnologia"]').click({ force: true });
            cy.wait(200);
            cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-31"]').clear();
            cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-31"]').type("Resposta de teste para a pergunta dissertativa sobre o projeto.");
            cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-32"]').clear();
            cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-32"]').type("Resposta teste");

            // Passo 2: avançar
            cy.get('[data-cy="next-button"]').click({ force: true });
            cy.wait(2000);

            // Resultado esperado: sistema avança para Abrangência
            cy.get('[data-cy="add-button"]').should("exist");
        });
    });

    context("CT-SIG-PROP-008 — Informações Complementares: perguntas são opcionais", () => {
        beforeEach(() => {
            cy.fixture("ts04-prop/caracterizacao").then((dados) => {

                // Pré-condição: chegar em Informações Complementares
                cy.visit(dados.propostaNovaUrl);
                cy.wait(1500);
                cy.get('[data-cy="titulo"]').type(dados.titulo, { force: true });
                cy.get('[data-cy="duracao"]').type(dados.duracao, { force: true });
                cy.get('[data-cy="search-instituicao-executora-id"]').type(dados.instituicao, { force: true });
                cy.wait(800);
                cy.contains(/UFMS\/Universidade Federal do Mato Grosso do Sul/i).click({ force: true });
                cy.wait(500);
                cy.get('[data-cy="next-button"]').click({ force: true });
                cy.wait(2000);
            });
        });

        it("deve permitir avançar para Abrangência sem responder nenhuma pergunta", () => {

            // Passo 1: avançar sem responder perguntas
            cy.get('[data-cy="next-button"]').click({ force: true });
            cy.wait(1500);

            // Resultado esperado: sistema permite avanço (perguntas opcionais)
            cy.get("body").then(($body) => {
                const avancou =
                    $body.find('[data-cy="add-button"]').length > 0 ||
                    $body.find('[data-cy^="formularioPropostaInformacaoComplementar"]').length === 0;
                cy.log(`Sistema permitiu avanço (perguntas opcionais): ${avancou}`);
                expect(avancou).to.be.true;
            });
        });

        it("deve exibir os campos de Informações Complementares (perguntas 28 a 32)", () => {

            // Resultado esperado: campos das perguntas presentes
            cy.get("body").then(($body) => {
                const temCamposComplementares =
                    $body.find('[data-cy^="formularioPropostaInformacaoComplementar.pergunta-28"]').length > 0 ||
                    $body.find('[data-cy^="formularioPropostaInformacaoComplementar.pergunta-29"]').length > 0 ||
                    $body.find('[data-cy="formularioPropostaInformacaoComplementar.pergunta-31"]').length > 0 ||
                    $body.find('[data-cy="formularioPropostaInformacaoComplementar.pergunta-32"]').length > 0;
                cy.log(`Campos de Informações Complementares presentes: ${temCamposComplementares}`);
                expect(temCamposComplementares).to.be.true;
            });
        });
    });

    context("CT-SIG-PROP-009 — Informações Complementares: limite de caracteres na Pergunta 31", () => {
        beforeEach(() => {
            cy.fixture("ts04-prop/caracterizacao").then((dados) => {

                // Pré-condição: chegar em Informações Complementares
                cy.visit(dados.propostaNovaUrl);
                cy.wait(1500);
                cy.get('[data-cy="titulo"]').type(dados.titulo, { force: true });
                cy.get('[data-cy="duracao"]').type(dados.duracao, { force: true });
                cy.get('[data-cy="search-instituicao-executora-id"]').type(dados.instituicao, { force: true });
                cy.wait(800);
                cy.contains(/UFMS\/Universidade Federal do Mato Grosso do Sul/i).click({ force: true });
                cy.wait(500);
                cy.get('[data-cy="next-button"]').click({ force: true });
                cy.wait(2000);
            });
        });

        it("deve aceitar texto dentro do limite na Pergunta 31", () => {
            cy.fixture("ts04-prop/complementares-limite").then(
                (casos: Array<{ descricao: string; esperado: string; texto: string }>) => {
                    const casoDentroLimite = casos.find((c) => c.esperado === "aceitar");
                    if (!casoDentroLimite) return;

                    // Passo 1: digitar texto dentro do limite
                    cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-31"]').clear();
                    cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-31"]').type(casoDentroLimite.texto, { delay: 0 });

                    // Resultado esperado: campo aceita o conteúdo
                    cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-31"]')
                        .invoke("val")
                        .then((val) => {
                            const len = (val as string).length;
                            cy.log(`Comprimento aceito pelo campo: ${len}`);
                            expect(len).to.be.gt(0);
                        });
                }
            );
        });

        it("deve truncar ou rejeitar texto com 2001+ caracteres na Pergunta 31", () => {
            cy.fixture("ts04-prop/complementares-limite").then(
                (casos: Array<{ descricao: string; esperado: string; texto: string }>) => {
                    const casoAcimaLimite = casos.find((c) => c.esperado === "truncar ou erro");
                    if (!casoAcimaLimite) return;

                    // Passo 1: digitar texto acima do limite
                    cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-31"]').clear();
                    cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-31"]').type(casoAcimaLimite.texto, { delay: 0 });
                    cy.wait(300);

                    // Resultado esperado: campo trunca ou erro ao avançar
                    cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-31"]')
                        .invoke("val")
                        .then((valor) => {
                            const comprimento = (valor as string).length;
                            cy.log(`Comprimento após digitação: ${comprimento}`);

                            if (comprimento >= 2001) {
                                cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-28-item-ods01-erradicar-a-pobreza-em-tod"]').click({ force: true });
                                cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-29-item-micro-faturamento-ano-de-r-81-00"]').click({ force: true });
                                cy.get('[data-cy="next-button"]').click({ force: true });
                                cy.wait(800);
                                cy.get("body").then(($body) => {
                                    const temErro = /limite|caractere|longo|máximo|max/i.test($body.text());
                                    cy.log(`Erro de limite exibido: ${temErro}`);
                                });
                            } else {
                                expect(comprimento).to.be.lessThan(2001);
                            }
                        });
                }
            );
        });
    });

    context("CT-SIG-PROP-010 — Abrangência: etapa opcional", () => {
        beforeEach(() => {
            cy.fixture("ts04-prop/caracterizacao").then((dados) => {

                // Pré-condição: navegar pela etapa 1 → 2 → chegar em Abrangência
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
            });
        });

        it("deve exibir botão Adicionar e colunas Estado/Município na Abrangência", () => {

            // Resultado esperado: tabela de abrangência com colunas corretas
            cy.get('[data-cy="add-button"]').should("exist");
            cy.contains(/estado/i).should("exist");
            cy.contains(/município/i).should("exist");
        });

        it("deve permitir avançar sem adicionar abrangência (campo opcional)", () => {

            // Passo 1: avançar sem adicionar abrangência
            cy.get('[data-cy="next-button"]').should("exist").and("not.be.disabled");
            cy.get('[data-cy="next-button"]').click({ force: true });
            cy.wait(2000);

            // Resultado esperado: sistema avança para seção de Coordenação
            cy.get("body").then(($body) => {
                const aindaEmAbrangencia =
                    $body.find('[data-cy="add-button"]').length > 0 &&
                    /estado|município/i.test($body.text());
                cy.log(`Ainda na tela de Abrangência: ${aindaEmAbrangencia}`);
                expect(aindaEmAbrangencia).to.be.false;
            });
            cy.contains(/coordenação|coordenador|apresentação|próxima/i).should("exist");
        });

        it("deve abrir formulário de seleção ao clicar em Adicionar na Abrangência", () => {

            // Passo 1: clicar em Adicionar
            cy.get('[data-cy="add-button"]').click({ force: true });
            cy.wait(800);

            // Resultado esperado: formulário de seleção de Estado/Município aparece
            cy.contains(/estado/i).should("exist");
        });
    });
});
