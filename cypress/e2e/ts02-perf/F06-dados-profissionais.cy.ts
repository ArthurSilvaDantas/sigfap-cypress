import { toCyString } from "../../helpers/kebab.helper";
import { calcularTempoDecorrido } from "../../helpers/date.helper";

describe("F-06 - Perfil: Dados Profissionais", () => {
    beforeEach(() => {
        cy.fixture("ts02-perf/dados-profissionais").then((dados) => {
            // efetuado o login do usuario
            cy.typeLogin(dados.usuario.email, dados.usuario.senha);

            // Passo 1: Navegar para perfil e ir para os dados profissionais
            cy.get('[data-cy="user-menu"]').click();
            cy.get('[data-cy="editar-perfil"]').click();
            cy.get('[data-cy="dados-profissionais"]').click();
        });
    });

    context("CT-SIG-PERF-007 — Dados Profissionais: vínculo institucional e empregatício", () => {
        it("usuario consegue salvar todos os campos profissionais com tempo calculado", () => {

            cy.fixture("ts02-perf/dados-profissionais").then((dados) => {

                // Passo 2: Marcar 'possui vinculo institucional' se estiver desativado
                cy.get('[data-cy="possui-vinculo-institucional-box"]').then(($checkbox) => {
                    const isChecked = $checkbox.find('[data-icon="check"]').attr('visible') !== 'false';
                    if (!isChecked) {
                        cy.wrap($checkbox).click();
                    }
                });

                // Passo 3: Seleciona tipo de vinculo: Servidor publico
                cy.get('[data-cy="search-tipo-vinculo-instituciona"]').click();
                cy.get(`[data-cy="${toCyString(dados.PERF007.tipoVinculo)}"]`).click();

                // Passo 4: Marcar "Possui Vínculo Empregatício" - se estiver desativado
                cy.get('[data-cy="possui-vinculo-empregaticio-box"]').then(($checkbox) => {
                    const isChecked = $checkbox.find('[data-icon="check"]').attr('visible') !== 'false';
                    if (!isChecked) {
                        cy.wrap($checkbox).click();
                    }
                });

                // Passo 5: Preencher Início do Serviço: 01/03/2015
                cy.get('[data-cy="vinculoInstitucional.inicioServico"]')
                    .invoke('val', dados.PERF007.inicioServico)
                    .trigger('change');

                // Passo 6: Verificar que campo "Tempo no Serviço" é calculado automaticamente e está bloqueado
                const tempoServico = calcularTempoDecorrido(dados.PERF007.inicioServico);
                cy.wait(500);
                cy.contains(tempoServico).should("be.visible");

                // Passo 7: Selecionar Regime de Trabalho: Dedicação Exclusiva
                cy.get('[data-cy="search-regime-trabalho-id"]').click();
                cy.get('[data-cy="dedicacao-exclusiva"]').click();

                // Passo 8: Preencher Função/Cargo: Analista de Sistemas
                cy.get(`[data-cy="vinculoInstitucional.funcao"]`).clear().type(dados.PERF007.cargo);

                // Passo 9: Preencher Início da Função: 01/07/2018
                cy.get('[data-cy="vinculoInstitucional.inicioFuncao"')
                    .invoke('val', dados.PERF007.inicioCargo)
                    .trigger('change');

                // Passo 10: Clicar "Salvar".
                cy.get('[data-cy="menu-salvar"').click();

                // Resultado esperado: dados salvos com sucesso
                cy.contains("Salvo com sucesso!").should("be.visible");

            })
        })
    })

    context("CT-SIG-PERF-015 — Dados Profissionais: impede salvamento com campos obrigatórios vazios", () => {
        it("deve alertar e impedir salvamento quando campos obrigatórios estão vazios", () => {
            cy.fixture("ts02-perf/dados-profissionais").then((dados) => {

                // Passo 2: garantir que checkboxes de vinculos estão marcados
                cy.get('[data-cy="possui-vinculo-institucional-box"]').then(($checkbox) => {
                    const isChecked = $checkbox.find('[data-icon="check"]').attr('visible') !== 'false';
                    if (!isChecked) cy.wrap($checkbox).click();
                });

                cy.get('[data-cy="possui-vinculo-empregaticio-box"]').then(($checkbox) => {
                    const isChecked = $checkbox.find('[data-icon="check"]').attr('visible') !== 'false';
                    if (!isChecked) cy.wrap($checkbox).click();
                });

                // limpar Função/Cargo se estiver preenchido
                cy.get('[data-cy="vinculoInstitucional.funcao"]').then(($input) => {
                    if ($input.val() !== '') {
                        cy.wrap($input).clear({ force: true });
                    }
                });

                // Passo 3: clicar "Próxima Etapa"
                cy.get('[data-cy="next-button"]').click();

                // Resultado esperado: sistema impede salvamento e alerta campos obrigatórios

                // mensagem de erro deve aparecer (mesmo que em inglês — bug documentado)
                cy.contains(dados.PERF0XX.mensagemErro).should("be.visible");
                // mensagem de sucesso não deve aparecer
                cy.contains("Salvo com sucesso!").should("not.exist");
            });
        });
    });

    context("CT-SIG-PERF-014 — Dados Profissionais: toggle Vínculo Institucional", () => {
        it("verifica se marcar/desmarcar 'Vínculo Institucional' exibe e oculta os campos de emprego", () => {
            cy.fixture("ts02-perf/dados-profissionais").then((dados) => {

                // Pré-condição: desmarcar na ordem correta
                // 1º desmarca institucional
                cy.get('[data-cy="possui-vinculo-institucional-box"]').then(($checkbox) => {
                    const isChecked = $checkbox.find('[data-icon="check"]').attr('visible') !== 'false';
                    if (isChecked) cy.wrap($checkbox).click();
                });

                // Passo 1: verificar campos ocultos no estado inicial
                cy.get('[data-cy="search-tipo-vinculo-instituciona"]').should("not.exist");
                cy.get('[data-cy="vinculoInstitucional.inicioServico"]').should("not.exist");

                // Passo 2: marcar "Possui Vínculo Institucional"
                cy.get('[data-cy="possui-vinculo-institucional-box"]').click();

                // Passo 3: Tipo de Vínculo e campos de emprego ficam visíveis
                // NOTA: comportamento real do sistema difere do spec — todos os campos aparecem
                // ao marcar apenas Vínculo Institucional, sem necessidade de marcar Empregatício
                cy.get('[data-cy="search-tipo-vinculo-instituciona"]').should("be.visible");
                cy.get('[data-cy="vinculoInstitucional.inicioServico"]').should("be.visible");
                cy.get('[data-cy="search-regime-trabalho-id"]').should("be.visible");
                cy.get('[data-cy="vinculoInstitucional.funcao"]').should("be.visible");
                cy.get('[data-cy="vinculoInstitucional.inicioFuncao"]').should("be.visible");

            });
        });
    });

})
