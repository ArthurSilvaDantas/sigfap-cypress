export {};

interface CriarContaFixture {
  emailCadastrado: string;
  senha: string;
}

const CRIAR_PROPOSTA       = '[data-cy="criar-proposta"]';
const INFORMACOES_INICIAIS = '[data-cy="informacoes-iniciais"]';
const CARACTERIZACAO       = '[data-cy="caracterizacao"]';
const COORDENACAO          = '[data-cy="coordenacao"]';
const APRESENTACAO         = '[data-cy="apresentacao"]';
const FINALIZACAO          = '[data-cy="finalizacao"]';
const TITULO               = '[data-cy="titulo"]';
const DURACAO              = '[data-cy="duracao"]';

const navegarParaDetalhEdital = () => {
  cy.visit("/");
  cy.get('[data-cy="editais-ver-mais"]', { timeout: 10000 }).click();
  cy.contains(/visualizar edital/i, { timeout: 10000 }).first().click();
  cy.get(CRIAR_PROPOSTA, { timeout: 10000 }).should("be.visible");
};

describe("TS-04 — F10: Proposta — Criação", () => {
  let conta: { email: string; senha: string };

  before(() => {
    cy.fixture<CriarContaFixture>("ts01-smoke/criar-conta").then((f) => {
      conta = { email: f.emailCadastrado, senha: f.senha };
    });
  });

  beforeEach(() => {
    cy.typeLogin(conta.email, conta.senha);
    cy.get('[data-cy="user-menu"]').should("be.visible");
    navegarParaDetalhEdital();
  });

  context("CT-SIG-PROP-001 — Iniciar criação de proposta", () => {
    it("deve abrir formulário de proposta ao clicar em Criar Proposta", () => {
      cy.get(CRIAR_PROPOSTA).click({ force: true });

      cy.get(INFORMACOES_INICIAIS, { timeout: 10000 }).should("exist");
    });

    it("deve exibir sidebar com etapas do formulário de proposta", () => {
      cy.get(CRIAR_PROPOSTA).click({ force: true });

      cy.get(CARACTERIZACAO, { timeout: 10000 }).should("exist");
      cy.get(COORDENACAO).should("exist");
      cy.get(APRESENTACAO).should("exist");
      cy.get(FINALIZACAO).should("exist");
    });

    it("deve exibir campos Título do Projeto e Duração na etapa Informações Iniciais", () => {
      cy.get(CRIAR_PROPOSTA).click({ force: true });

      cy.get(TITULO, { timeout: 10000 }).should("exist");
      cy.get(DURACAO).should("exist");
    });
  });
});
