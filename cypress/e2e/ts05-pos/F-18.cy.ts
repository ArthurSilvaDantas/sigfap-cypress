export {};

interface CriarContaFixture {
  emailCadastrado: string;
  senha: string;
}

interface F18Fixture {
  nome: string;
  "search-sexo": string;
  "search-pais-id": string;
}

const NOME       = '[data-cy="nome"]';
const SEXO       = '[data-cy="search-sexo"]';
const PAIS       = '[data-cy="search-pais-id"]';
const USER_MENU  = '[data-cy="user-menu"]';
const EDITAR     = '[data-cy="editar-perfil"]';
const LOGOUT     = '[data-cy="logout"]';

describe("TS-05 — F18: Pós-submissão — Persistência de Dados", () => {
  let dados: F18Fixture;
  let conta: { email: string; senha: string };

  before(() => {
    cy.fixture<F18Fixture>("ts05-pos/perfil-proposta").then((f) => {
      dados = f;
    });
    cy.fixture<CriarContaFixture>("ts01-smoke/criar-conta").then((f) => {
      conta = { email: f.emailCadastrado, senha: f.senha };
    });
  });

  context("CT-SIG-PERS-001 — Persistência de dados do perfil entre sessões", () => {
    it("deve manter os dados do perfil após logout e novo login", () => {
      cy.typeLogin(conta.email, conta.senha);
      cy.get(USER_MENU).should("be.visible");

      cy.get(USER_MENU).click();
      cy.get(EDITAR).click();

      cy.get(NOME).should("have.value", dados.nome);
      cy.get(SEXO).should("have.value", dados["search-sexo"]);
      cy.get(PAIS).should("have.value", dados["search-pais-id"]);

      cy.get(USER_MENU).click();
      cy.get(LOGOUT).click();

      cy.typeLogin(conta.email, conta.senha);
      cy.get(USER_MENU).should("be.visible");

      cy.get(USER_MENU).click();
      cy.get(EDITAR).click();

      cy.get(NOME).should("have.value", dados.nome);
      cy.get(SEXO).should("have.value", dados["search-sexo"]);
      cy.get(PAIS).should("have.value", dados["search-pais-id"]);
    });
  });
});
