import { toCyString } from "../../helpers/kebab.helper";

const uniqueEmail = (): string => `vvt.smoke001.${Date.now()}@sig.test`;

describe("CT-SIG-SMOKE-001 — Cadastro de conta: caminho feliz", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("deve criar conta com dados válidos e avançar pelos 3 steps até finalizar", () => {
    cy.fixture("ts01-smoke/criar-conta").then((dados) => {
      const email = uniqueEmail();

      // Step 1: Dados pessoais
      cy.contains(/criar conta/i).click();
      cy.get('[data-cy="nome"]').type(dados.nome);
      cy.get('[data-cy="dataNascimento"]').type(dados.dataNascimento);
      cy.get('[data-cy="open-sexo"]').click();
      cy.get(`[data-cy="${toCyString(dados.sexo)}"]`).click();
      cy.get('[data-cy="documento"]').type(dados.cpf);
      cy.contains("button", /próximo/i).click();

      // Step 2: Credenciais
      cy.get('[data-cy="email"]').type(email);
      cy.get('[data-cy="senha"]').type(dados.senha);
      cy.get('[data-cy="senhaConfirmar"]').type(dados.senhaConfirmar);
      cy.contains("button", /próximo/i).click();

      // Step 3: Aceite de Termos
      cy.get('[data-cy="finalizar"]').should("be.disabled");
      cy.get('input[type="checkbox"]').click({ force: true });
      cy.get('[data-cy="finalizar"]').should("be.enabled");
      cy.get('[data-cy="finalizar"]').click();
      cy.url().should("not.include", "/cadastro");
    });
  });
});
