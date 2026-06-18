import { toCyString } from "../../helpers/kebab.helper";

let dados: any;

before(() => {
    cy.fixture("ts05-pos/perfil-proposta").then((fixture) => {
        dados = fixture;
    });
});

describe("F-18 — Persistência de dados", () => {
    
    context("Persistência de dados do perfil entre sessões", () => {

    it("CT-SIG-PERS-001 — Persistência de dados do perfil entre sessões", () => {

        cy.typeLogin(dados.usuario.email, dados.usuario.senha);
        cy.get('[data-cy="user-menu"]').should("be.visible");

        cy.get('[data-cy="user-menu"]').click();

        cy.get('[data-cy="editar-perfil"]').click();

        cy.get('[data-cy="nome"]').should('have.value', dados.nome);

        cy.get('[data-cy="search-sexo"]').should('have.value', dados['search-sexo']);

        cy.get('[data-cy="search-pais-id"]').should('have.value', dados['search-pais-id']);

        cy.get('[data-cy="user-menu"]').click();

        cy.get('[data-cy="logout"]').click();

        cy.typeLogin(dados.usuario.email, dados.usuario.senha);
        
        cy.get('[data-cy="user-menu"]').should("be.visible");

        cy.get('[data-cy="user-menu"]').click();

        cy.get('[data-cy="editar-perfil"]').click();

        cy.get('[data-cy="nome"]').should('have.value', dados.nome);

        cy.get('[data-cy="search-sexo"]').should('have.value', dados['search-sexo']);

        cy.get('[data-cy="search-pais-id"]').should('have.value', dados['search-pais-id']);


    });
  });

});
  
  
  
  
  
  
  
  
  
  
  
  
  
