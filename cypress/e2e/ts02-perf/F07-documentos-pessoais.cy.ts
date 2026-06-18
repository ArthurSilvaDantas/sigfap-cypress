import { toCyString } from "../../helpers/kebab.helper";

describe("F-07 — Perfil: Documentos Pessoais", () => {
    
    // Pré-condições:
    beforeEach(() => {
        cy.fixture("ts02-perf/F07-documentos-pessoais").then((dados) => {
            // efetuado o login do usuario
            cy.typeLogin(dados.usuario.email, dados.usuario.senha);

            // Pré-condições para todos os testes é de não ter arquivos anteriores, 
            // então remover arquivo existente se houver:
            cy.get('[data-cy="user-menu"]').click();
            cy.get('[data-cy="editar-perfil"]').click();
            cy.get('[data-cy="documentos-pessoais"]').click();

            cy.get('body').then(($body) => {
                if ($body.find('[data-icon="trash"]').length > 0) {
                    cy.get('[data-icon="trash"]').first().click({ force: true });
                    cy.wait(1000);
                }
            });
            
        });
    });


    // CAMINHO FELIZ 
    context("CT-SIG-PERF-008 — Documentos Pessoais: upload de arquivo válido", () => {
        it("deve aceitar upload de PDF válido e listar o documento associado ao tipo selecionado", () => {
            cy.fixture("ts02-perf/F07-documentos-pessoais").then((dados) => {

                // Passo 1: Navegar para Documentos Pessoais
                cy.get('[data-cy="user-menu"]').click();
                cy.get('[data-cy="editar-perfil"]').click();
                cy.get('[data-cy="documentos-pessoais"]').click();

                // Passo 2: Selecionar tipo de documento
                cy.get('[data-cy="select-categories-usuario-anexo"]').click();
                cy.get('[data-cy="documento-de-identificacao-com-f"]').click();

                // Passo 3: Fazer upload do arquivo PDF válido
                cy.get('[data-cy="usuarioAnexo-upload"]').selectFile(
                    "cypress/fixtures/ts02-perf/documento-de-identificacao-com-foto-2.pdf",
                    { force: true }
                );
                // Esperar um pouco para o processo finalizar
                cy.wait(3000);

                // Passo 4: Verificar que o nome do arquivo aparece após upload
                cy.contains(dados.PERF008.nomeArquivo).should("be.visible");

                // Passo 5: Apertar em 'Salvar'
                cy.get('[data-cy="menu-salvar"]').click();

                // Reposta esperada: mensagem de sucesso sobre envio
                cy.contains("Salvo com sucesso!").should("be.visible");

                cy.get('[data-cy="menu-finalizar"]').click();
            });
        });
    });

    //CAMINHO INVÁLIDO
    context("CT-SIG-PERF-009 — Documentos Pessoais: upload de tipo de arquivo inválido", () => {
        it("deve rejeitar arquivos com formato não suportado", () => {
            cy.fixture("ts02-perf/F07-documentos-pessoais").then((dados) => {
                
                // Passo 1: navegar para Documentos Pessoais
                cy.get('[data-cy="user-menu"]').click();
                cy.get('[data-cy="editar-perfil"]').click();
                cy.get('[data-cy="documentos-pessoais"]').click();

                // Passo 2: selecionar tipo de documento
                cy.get('[data-cy="select-categories-usuario-anexo"]').click();
                cy.get('[data-cy="documento-de-identificacao-com-f"]').click();

                // Passo 3: Fazer upload de arquivor inválidos
                dados.PERF009.arquivosInvalidos.forEach((arquivo) => {
                    //tenta enviar três arquivos com formatos inválidos
                    cy.get('[data-cy="usuarioAnexo-upload"]').selectFile(
                        {
                            contents: Cypress.Buffer.from("conteudo fake"),
                            fileName: arquivo.nome,
                            mimeType: arquivo.mimeType,
                        },
                        { force: true }
                    );
                    cy.wait(1000);

                    // Respostas esperadas =================================
                    // Mensagem de erro sobre formato inválido
                    cy.contains(dados.PERF009.mensagemErro).should("be.visible");

                    // Arquivos inválidos não foram upados
                    cy.contains(arquivo.nome).should("not.exist");
                });
            });
        });
    });

    context("CT-SIG-PERF-016 — Documentos Pessoais: upload de mais de um arquivo", () => {
        it("deve rejeitar segundo arquivo e informar quantidade máxima atingida", () => {
            cy.fixture("ts02-perf/F07-documentos-pessoais").then((dados) => {

                // Passo 1: selecionar tipo de documento
                cy.get('[data-cy="select-categories-usuario-anexo"]').click();
                cy.get('[data-cy="documento-de-identificacao-com-f"]').click();

                // Passo 2: fazer upload do primeiro arquivo (válido)
                cy.get('[data-cy="usuarioAnexo-upload"]').selectFile(
                    "cypress/fixtures/ts02-perf/documento-de-identificacao-com-foto-2.pdf",
                    { force: true }
                );

                //Passo 3: verificar que o primeiro arquivo foi aceito
                cy.contains(dados.PERF008.nomeArquivo).should("be.visible");

                //Passo 4: tentar fazer upload de um segundo arquivo
                cy.get('[data-cy="usuarioAnexo-upload"]').selectFile(
                    "cypress/fixtures/ts02-perf/documento-de-identificacao-com-foto-2.pdf",
                    { force: true }
                );

                //Resultado esperado ======================================
                // Mensagem de erro informando que a quantidade máxima foi atingida
                cy.contains(dados.PERFXX.mensagemErroQuantidade).should("be.visible");

                //Segundo arquivo não é upado
                cy.get('[data-icon="trash"]').should("have.length", 1);
            });
        });
    });

});