import { toCyString } from "../../helpers/kebab.helper";

describe("F-05 - Perfil: Dados Acadêmicos", () => {
    // Pré-condições:
    beforeEach(() => {
        cy.fixture("ts02-perf/dados-academicos").then((dados) => {
            cy.typeLogin(dados.usuario.email, dados.usuario.senha);
        });
    });

    context("CT-SIG-PERF-006 — Dados Acadêmicos: preenchimento válido", () => {
        it("deve salvar dados acadêmicos com Grande Área obrigatória preenchida", () => {
            cy.fixture("ts02-perf/dados-academicos").then((dados) => {
                
                // Passo 1: navegar para o perfil -> Dados academicos                    
                cy.get('[data-cy="user-menu"]').click();                    
                cy.get('[data-cy="editar-perfil"]').click();
                cy.get('[data-cy="dados-academicos"]').click();

                // Passo 2: selecionar a instituicao
                cy.get('[data-cy="open-instituicao-id"]').click();                    
                cy.get('[data-cy="ufms-universidade-federal-do-mat"]').click();
                
                // Passo 3: selecionar nivel academico - doutorado
                cy.get('[data-cy="search-nivel-academico-id"]').click();
                cy.get(`[data-cy="${toCyString(dados.nivelAcademico)}"]`).click();
                
                // Passo 4: preencher campo Lattes
                cy.get('[data-cy="lattes"]').clear().type(dados.lattes);

                // Passo 5: clicar "adicionar area de conhecimento
                cy.get('[data-cy="add-areas-de-conhecimento"]').click();

                // Passo 6: selecionar grande área 
                //abre o dropdown - ciencias exatas e da terra
                cy.get('[data-cy="search-grande-area-id"]').click();
                //seleciona o ciencias extas e da terra
                cy.get('[data-cy="ciencias-exatas-e-da-terra"]').click();
            
                // passo 7: selecionar área: ciencia da computacao
                cy.get('[data-cy="open-area-id"]').click();
                cy.get('[data-cy="ciencia-da-computacao"]').click();

                // passo 8: confirma adição
                cy.get('[data-cy="areaDeConhecimento-confirmar"]').click();

                // passo 9: clicar em 'Salvar'
                cy.get('[data-cy="menu-salvar"]').click();

                // passo 10: clicar em 'Finalizar'
                cy.get('[data-cy="menu-finalizar"]').click();

                // resultado esperado: dados salvos com sucesso.
                // Área de conhecimento exibida na listagem com grande area e area
                cy.contains(dados.grandeArea).should("be.visible");
                cy.contains(dados.area).should("be.visible");
                
            })
        })
    });

    context("CT-SIG-PERF-010 — Dados Acadêmicos: Grande Área obrigatória bloqueia confirmação", () => {
        it("não deve confirmar Área de Conhecimento sem Grande Área selecionada", () => {
            cy.fixture("ts02-perf/dados-academicos").then((dados) => {

                // Passo 1: navegar para Dados Acadêmicos
                cy.get('[data-cy="user-menu"]').click();
                cy.get('[data-cy="editar-perfil"]').click();
                cy.get('[data-cy="dados-academicos"]').click();

                // Passo 2: clicar em "Adicionar Área de Conhecimento"
                cy.get('[data-cy="add-areas-de-conhecimento"]').click();

                // Passo 3: selecionar Grande Área
                cy.get('[data-cy="search-grande-area-id"]').click();
                cy.wait(1000);
                cy.get('[data-cy="ciencias-exatas-e-da-terra"]').click();

                // Passo 4: selecionar Área
                cy.get('[data-cy="open-area-id"]').click();
                cy.get('[data-cy="ciencia-da-computacao"]').click();

                // Passo 5: limpar a Grande Área clicando no botão X
                cy.get('[data-cy="grande-area-id"]')
                    .find('button[type="button"]')
                    .click({ force: true });

                // Passo 6: clicar em Confirmar
                cy.get('[data-cy="areaDeConhecimento-confirmar"]').click();
                
                // Resultado esperado: 
                // erro ao salvar
                cy.contains(dados.mensagemErroSalvar).should("be.visible");
                // o botão de confirmar ainda deve estar na tela
                cy.get('[data-cy="areaDeConhecimento-confirmar"]').should("be.visible"); // modal ainda aberto
            });
        });
    });

    context("CT-SIG-PERF-013 — Dados Acadêmicos: toggle Sugerir Instituição", () => {
        it("deve ocultar o select e exibir campos livres ao marcar Sugerir Instituição", () => {
        
            cy.fixture("ts02-perf/dados-academicos").then((dados) => {

            // Passo 1: navegar para Dados Acadêmicos
            cy.get('[data-cy="user-menu"]').click();
            cy.get('[data-cy="editar-perfil"]').click();
            cy.get('[data-cy="dados-academicos"]').click();
                
            // Resultado esperado: verificar que o select de Instituição está visível antes do toggle
            cy.get('[data-cy="open-instituicao-id"]').should("be.visible");
                
            // Passo 2: marcar checkbox 'Não encontrei minha instituição' ("Sugerir Instituição")
            cy.get('[data-cy="sugerir-instituicao-box"]').click();

            // Resultado esperado: 
            // - 1. Select de Sliga/Instituição deve ser ocultado
            cy.get('[data-cy="open-instituicao-id"]').should("not.exist");
            
            // - 2. Aparecer os campos novos:
            // - 2.1 Campos Nome e Sigla da instituição devem aparecer
            cy.get('[data-cy="instituicaoNome"]').should("be.visible");
            cy.get('[data-cy="instituicaoSigla"]').should("be.visible");
            
            // - 2.2 - campos livres de Nome e Sigla da unidade devem aparecer
            cy.get('[data-cy="unidadeNome"]').should("be.visible");
            cy.get('[data-cy="unidadeSigla"]').should("be.visible");

            // Passo 3: preencher campos da instituição
            cy.get('[data-cy="instituicaoNome"]').type(dados.nomeInstituicao);
            cy.get('[data-cy="instituicaoSigla"]').type(dados.sigla);

            // Passo 4: preencher campos da unidade
            cy.get('[data-cy="unidadeNome"]').type(dados.unidadeNome);
            cy.get('[data-cy="unidadeSigla"]').type(dados.unidadeSigla);

            // Passo 5: clicar em Salvar
            cy.get('[data-cy="menu-salvar"]').click();

            // Passo 6: finalizar edição do perfil
            cy.get('[data-cy="menu-finalizar"]').click();

            // Resultado esperado: dados salvos com sucesso — campos preenchidos são mantidos
            cy.get('[data-cy="user-menu"]').should("be.visible");

            });

        });
    });
});
