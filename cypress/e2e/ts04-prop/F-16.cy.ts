import { toCyString } from "../../helpers/kebab.helper";

let dados: any;

before(() => {
    cy.fixture("ts04-prop/perfil-proposta").then((fixture) => {
        dados = fixture;
    });
});

describe("F-16 — Verificação e Submissão", () => {

  beforeEach(() => {
    cy.typeLogin(dados.usuario.email, dados.usuario.senha);
    cy.get('[data-cy="user-menu"]').should("be.visible");


    cy.url().should("include", "/home");

        // Localiza um edital disponível
    cy.get('[data-cy^="editais"]')
      .eq(2)
      .first()
      .should("be.visible")
      .click();

        // Inicia a criação da proposta
        cy.get('[data-cy="criar-proposta"]')
          .should("be.visible")
          .click();

    cy.get('[data-cy="caracterizacao"]')
      .should('be.visible');

    cy.get('[data-cy="informacoes-iniciais"]')
      .should('be.visible');

    cy.get('[data-cy="titulo"]').clear().type(dados.titulo);

    cy.get('[data-cy="duracao"]').clear().type(dados.duracao);

    cy.get('[data-cy="instituicao-executora-id"]').click();   
    
    cy.get('[data-cy="ufms-universidade-federal-do-mat"]').click();

    cy.get('[data-cy="unidade-executora-id"]').click();

    cy.get('[data-cy="facom-faculdade-de-computacao"]').click();

    cy.get('[data-cy="add-areas-de-conhecimento"]').click();

    cy.get('[data-cy="search-grande-area-id"]').click();

    cy.get('[data-cy="ciencias-exatas-e-da-terra"]').click();

    cy.get('[data-cy="search-area-id"]').click();

    cy.get('[data-cy="probabilidade-e-estatistica"]').click();

    cy.get('[data-cy="areaDeConhecimento-confirmar"]').should('be.enabled').click();


    cy.get('[data-cy="next-button"]').should('be.enabled').click();

    cy.wait(100);

    //1.2 Informações complementares

    cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-231-item-media-faturamento-ano-de-r-4-800"]').click();

    cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-232"]').click();

    cy.get('[aria-label="Junho 19, 2026"]').click();

    cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-233-item-bioeconomia"]').click();

    cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-234"]').clear().type(dados.resposta);

    cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-235-item-a3"]').click();

    cy.get('[data-cy="next-button"]').should('be.enabled').click();

    cy.wait(100);

    //1.3 Abrangência

    //Pode ser pulada

    cy.get('[data-cy="next-button"]').should('be.enabled').click();

    cy.wait(100);

    //2 Coordenação

    //2.1 Dados pessoais

    //Pode ser pulada, pois os dados são preenchidos automaticamente

    cy.get('[data-cy="next-button"]').should('be.enabled').click();

    cy.wait(100);

    cy.get('[data-cy="next-button"]').should('be.enabled').click();

    cy.wait(100);

    //2.2 Endereço

    //cy.get('[data-cy="criadoPor.endereco.cep"]').clear().type(dados.cep);

    //cy.get('[data-cy="criadoPor.endereco.numero"]').clear().type(dados.numero);


    //2.3 Dados acadêmicos

    cy.get('[data-cy="add-areas-de-conhecimento"]').should('be.enabled').click();

    cy.get('[data-cy="search-grande-area-id"]').click();

    cy.get('[data-cy="ciencias-exatas-e-da-terra"]').click();

    cy.get('[data-cy="search-area-id"]').click();

    cy.get('[data-cy="ciencia-da-computacao"]').click();

    cy.get('[data-cy="criadoPor.areaDeConhecimento-confirmar"]').should('be.enabled').click();
    cy.get('[data-cy="next-button"]').should('be.enabled').click();

    cy.wait(100);

    cy.get('[data-cy="next-button"]').should('be.enabled').click();

    cy.wait(100);


    //3 Apresentação

    //3.1 Membros

    //Pode ser pulada

    cy.get('[data-cy="next-button"]').should('be.enabled').click();

    cy.wait(100);


    //3.2 Atividades

    cy.get('[data-cy="add-button"]').should('be.enabled').click();

    cy.get('[data-cy="propostaAtividadeForm.titulo"]').clear().type(dados.tituloAtividade);

    cy.get('[data-cy="search-mes-inicio"]').click();

    cy.get('[data-cy="1"]').click();

    cy.get('[data-cy="search-duracao"]').click();

    cy.get('[data-cy="1-mes"]').click();

    cy.get('[data-cy="search-carga-horaria-semanal"]').click();

    cy.get('[data-cy="1-hora"]').click();

    cy.get('[data-cy="propostaAtividade-confirmar"]').should('be.enabled').click();

    cy.get('[data-cy="next-button"]').should('be.enabled').click();

    cy.wait(100);

    //3.3 Visualização das atividades

    //Pode ser pulada

    cy.get('[data-cy="next-button"]').should('be.enabled').click();

    cy.wait(100);

    //3.4 Orçamento

    //Vai direto para 3.4.1

    //3.4.1 Bolsa

    //Pode ser pulada

    cy.get('[data-cy="next-button"]').should('be.enabled').click();

    cy.wait(100);

    //3.4.2 Consolidação

    //Pode ser pulada

    cy.get('[data-cy="next-button"]').should('be.enabled').click();

    cy.wait(100);

    //3.4.3 Solicitado à Fundação

    //Pode ser pulada

    cy.get('[data-cy="next-button"]').should('be.enabled').click();
    
    cy.wait(100);

    cy.get('[data-cy="next-button"]').should('be.enabled').click();

    cy.wait(100);

    //4. Finalização

    });


  context("Submissão da proposta com sucesso", () => {

    it("CT-SIG-PROP-037 - Submissão da proposta com sucesso", () => {

      cy.get('[data-cy="termo-de-aceite-aceito-box"]').click();

      cy.get('[data-cy="menu-verificar-pendencias"]').click();

      cy.get('.css-1alpf6f').should("be.enabled");

      cy.get('.css-1alpf6f').click();

      cy.get('[data-cy="sim-continuar-button"]').click();

      cy.get('[data-cy="confirmar-button"]').click();

      cy.wait(100);

      cy.get('[data-cy-index="propostas-0"] > .css-7732s4 > .css-13mtqy1 > :nth-child(4) > .css-9h7nwi > .css-f3bdy2 > .css-10ed830').should("contain.text", "Submetida");

    });
  });

context("Submissão bloqueada com campos obrigatórios pendentes", () => {

    it("CT-SIG-PROP-038 - Submissão bloqueada com campos obrigatórios pendentes", () => {
            
      cy.get('[data-cy="caracterizacao"]').click();

      cy.get('[data-cy="informacoes-iniciais"] > .css-jq9ysz').click();

      cy.get('[data-cy="duracao"]').clear();

      cy.get('[data-cy="menu-verificar-pendencias"]').click();

      cy.get('.css-1alpf6f').should("be.disabled");

    });
  });


});
  
  
  
  
  
  
  
  
  
  
  
  
  
