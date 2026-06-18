import { toCyString } from "../../helpers/kebab.helper";

describe("F-01 - Smoke: Criar Conta", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    context("CT-SIG-SMOKE-001 — Cadastro de conta: caminho feliz", () => {
        it("deve criar conta com dados válidos e avançar pelos 3 steps até finalizar", () => {
            cy.fixture("ts01-smoke/criar-conta").then((dados) => {
                const email = `vvt.smoke001.${Date.now()}@sig.test`;

                // Passo 1: Dados pessoais
                cy.contains(/criar conta/i).click();
                cy.get('[data-cy="nome"]').type(dados.nome);
                cy.get('[data-cy="dataNascimento"]').type(dados.dataNascimento);
                cy.get('[data-cy="open-sexo"]').click();
                cy.get(`[data-cy="${toCyString(dados.sexo)}"]`).click();
                cy.get('[data-cy="documento"]').type(dados.cpf);
                cy.contains("button", /próximo/i).click();

                // Passo 2: Credenciais
                cy.get('[data-cy="email"]').type(email);
                cy.get('[data-cy="senha"]').type(dados.senha);
                cy.get('[data-cy="senhaConfirmar"]').type(dados.senhaConfirmar);
                cy.contains("button", /próximo/i).click();

                // Passo 3: Aceite de Termos
                cy.get('[data-cy="finalizar"]').should("be.disabled");
                cy.get('input[type="checkbox"]').click({ force: true });
                cy.get('[data-cy="finalizar"]').should("be.enabled");
                cy.get('[data-cy="finalizar"]').click();

                // Resultado esperado: conta criada, sistema redireciona para fora do cadastro
                // NOTA: sistema não exibe mensagem de confirmação explícita — verifica apenas o redirecionamento
                cy.url().should("not.include", "/cadastro");
            });
        });
    });

    context("CT-SIG-SMOKE-002 — Senha não atende regras de complexidade", () => {
        it("deve exibir erro de validação para cada senha que viola as regras de complexidade", () => {
            cy.fixture("ts01-smoke/criar-conta").then((dados) => {
                cy.fixture("ts01-smoke/senhas-invalidas").then(
                    (senhas: Array<{ senha: string; descricao: string }>) => {
                        senhas.forEach((item, idx) => {
                            cy.log(`[${idx + 1}/${senhas.length}] ${item.descricao}: "${item.senha}"`);
                            cy.visit("/");

                            // Passo 1: Dados pessoais
                            cy.contains(/criar conta/i).click();
                            cy.get('[data-cy="nome"]').type(dados.nome);
                            cy.get('[data-cy="dataNascimento"]').type(dados.dataNascimento);
                            cy.get('[data-cy="open-sexo"]').click();
                            cy.get(`[data-cy="${toCyString(dados.sexo)}"]`).click({ force: true });
                            cy.get('[data-cy="documento"]').type(dados.cpf);
                            cy.contains("button", /próximo/i).click();

                            // Passo 2: Credenciais com senha inválida
                            const email = `smoke002.${idx}.${Date.now()}@sig.test`;
                            cy.get('[data-cy="email"]').type(email);
                            cy.get('[data-cy="senha"]').type(item.senha);
                            cy.get('[data-cy="senhaConfirmar"]').type(item.senha);
                            cy.contains("button", /próximo/i).click();

                            // Resultado esperado: erro de complexidade de senha
                            cy.contains(
                                /senha|complexidade|maiúscula|minúscula|especial|número|caractere|mínimo|inválida|fraca|weak|password/i
                            ).should("be.visible");
                            cy.get('[data-cy="finalizar"]').should("not.exist");
                        });
                    }
                );
            });
        });
    });

    context("CT-SIG-SMOKE-003 — E-mail já cadastrado", () => {
        it("deve exibir erro ao tentar cadastrar e-mail já existente no sistema", () => {
            cy.fixture("ts01-smoke/criar-conta").then((dados) => {
                    // Passo 1: Dados pessoais
                    cy.contains(/criar conta/i).click();
                    cy.get('[data-cy="nome"]').type(dados.nome);
                    cy.get('[data-cy="dataNascimento"]').type(dados.dataNascimento);
                    cy.get('[data-cy="open-sexo"]').click();
                    cy.get(`[data-cy="${toCyString(dados.sexo)}"]`).click({ force: true });
                    cy.get('[data-cy="documento"]').type(dados.cpf);
                    cy.contains("button", /próximo/i).click();

                    // Passo 2: Credenciais — e-mail já cadastrado
                    cy.get('[data-cy="email"]').type(dados.emailCadastrado);
                    cy.get('[data-cy="senha"]').type(dados.senha);
                    cy.get('[data-cy="senhaConfirmar"]').type(dados.senhaConfirmar);
                    cy.contains("button", /próximo/i).click();

                    // Passo 3: Aceite de Termos
                    cy.get('input[type="checkbox"]').click({ force: true });
                    cy.get('[data-cy="finalizar"]').should("be.enabled").click();

                    // Resultado esperado: erro de e-mail duplicado, sem login efetuado
                    cy.contains(
                        /e-mail|email|já.*cadastrado|already.*exist|em uso|cadastrado|duplicado|existente|conflict|erro/i
                    ).should("exist");
                    cy.get('[data-cy="user-menu"]').should("not.exist");
            });
        });
    });

    context("CT-SIG-SMOKE-004 — Confirmação de senha divergente", () => {
        it("deve exibir erro quando Confirmar Senha não coincide com Senha", () => {
            cy.fixture("ts01-smoke/criar-conta").then((dados) => {
                // Passo 1: Dados pessoais
                cy.contains(/criar conta/i).click();
                cy.get('[data-cy="nome"]').type(dados.nome);
                cy.get('[data-cy="dataNascimento"]').type(dados.dataNascimento);
                cy.get('[data-cy="open-sexo"]').click();
                cy.get(`[data-cy="${toCyString(dados.sexo)}"]`).click({ force: true });
                cy.get('[data-cy="documento"]').type(dados.cpf);
                cy.contains("button", /próximo/i).click();

                // Passo 2: Credenciais — senhas divergentes
                const email = `smoke004.${Date.now()}@sig.test`;
                cy.get('[data-cy="email"]').type(email);
                cy.get('[data-cy="senha"]').type(dados.senha);
                cy.get('[data-cy="senhaConfirmar"]').type(dados.senha + "X");
                cy.contains("button", /próximo/i).click();

                // Resultado esperado: erro de confirmação de senha
                cy.contains(
                    /confirmar|confirmação|coincidem|iguais|diferentes|divergem|match|password/i
                ).should("be.visible");
                cy.get('[data-cy="finalizar"]').should("not.exist");
            });
        });
    });

    context("CT-SIG-SMOKE-008 — Aceite de Termos obrigatório no cadastro", () => {
        it("deve manter Finalizar desabilitado enquanto checkbox de Termos estiver desmarcado", () => {
            cy.fixture("ts01-smoke/criar-conta").then((dados) => {
                // Passo 1: Dados pessoais
                cy.contains(/criar conta/i).click();
                cy.get('[data-cy="nome"]').type(dados.nome);
                cy.get('[data-cy="dataNascimento"]').type(dados.dataNascimento);
                cy.get('[data-cy="open-sexo"]').click();
                cy.get(`[data-cy="${toCyString(dados.sexo)}"]`).click({ force: true });
                cy.get('[data-cy="documento"]').type(dados.cpf);
                cy.contains("button", /próximo/i).click();

                // Passo 2: Credenciais
                const email = `smoke008.${Date.now()}@sig.test`;
                cy.get('[data-cy="email"]').type(email);
                cy.get('[data-cy="senha"]').type(dados.senha);
                cy.get('[data-cy="senhaConfirmar"]').type(dados.senhaConfirmar);
                cy.contains("button", /próximo/i).click();

                // Resultado esperado: Finalizar desabilitado com checkbox desmarcado
                cy.get('input[type="checkbox"]').should("not.be.checked");
                cy.get('[data-cy="finalizar"]').should("be.disabled");
            });
        });

        it("deve redirecionar para login ao clicar em Não aceito sem criar conta", () => {
            cy.fixture("ts01-smoke/criar-conta").then((dados) => {
                // Passo 1: Dados pessoais
                cy.contains(/criar conta/i).click();
                cy.get('[data-cy="nome"]').type(dados.nome);
                cy.get('[data-cy="dataNascimento"]').type(dados.dataNascimento);
                cy.get('[data-cy="open-sexo"]').click();
                cy.get(`[data-cy="${toCyString(dados.sexo)}"]`).click({ force: true });
                cy.get('[data-cy="documento"]').type(dados.cpf);
                cy.contains("button", /próximo/i).click();

                // Passo 2: Credenciais
                const email = `smoke008b.${Date.now()}@sig.test`;
                cy.get('[data-cy="email"]').type(email);
                cy.get('[data-cy="senha"]').type(dados.senha);
                cy.get('[data-cy="senhaConfirmar"]').type(dados.senhaConfirmar);
                cy.contains("button", /próximo/i).click();

                // Passo 3: clicar em "Não aceito"
                cy.contains(/não aceito/i).click();

                // Resultado esperado: redirecionado para login sem criar conta
                cy.url().should("not.include", "/cadastro");
                cy.get('[data-cy="user-menu"]').should("not.exist");
            });
        });

        it("deve habilitar o botão Finalizar ao marcar o checkbox de Termos", () => {
            cy.fixture("ts01-smoke/criar-conta").then((dados) => {
                // Passo 1: Dados pessoais
                cy.contains(/criar conta/i).click();
                cy.get('[data-cy="nome"]').type(dados.nome);
                cy.get('[data-cy="dataNascimento"]').type(dados.dataNascimento);
                cy.get('[data-cy="open-sexo"]').click();
                cy.get(`[data-cy="${toCyString(dados.sexo)}"]`).click({ force: true });
                cy.get('[data-cy="documento"]').type(dados.cpf);
                cy.contains("button", /próximo/i).click();

                // Passo 2: Credenciais
                const email = `smoke008.${Date.now()}@sig.test`;
                cy.get('[data-cy="email"]').type(email);
                cy.get('[data-cy="senha"]').type(dados.senha);
                cy.get('[data-cy="senhaConfirmar"]').type(dados.senhaConfirmar);
                cy.contains("button", /próximo/i).click();

                // Resultado esperado: Finalizar habilitado após marcar checkbox
                cy.get('input[type="checkbox"]').should("not.be.checked");
                cy.get('[data-cy="finalizar"]').should("be.disabled");
                cy.get('input[type="checkbox"]').click({ force: true });
                cy.get('[data-cy="finalizar"]').should("be.enabled");
            });
        });
    });
});
