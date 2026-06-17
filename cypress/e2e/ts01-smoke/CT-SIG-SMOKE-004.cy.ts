import { toCyString } from "../../helpers/kebab.helper";

describe("CT-SIG-SMOKE-004 — Confirmação de senha divergente", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("deve exibir erro quando Confirmar Senha não coincide com Senha", () => {
    cy.fixture("ts01-smoke/criar-conta").then((dados) => {
      // Step 1: Dados pessoais
      cy.contains(/criar conta/i).click();
      cy.get('[data-cy="nome"]').type(dados.nome);
      cy.get('[data-cy="dataNascimento"]').type(dados.dataNascimento);
      cy.get('[data-cy="open-sexo"]').click();
      cy.get(`[data-cy="${toCyString(dados.sexo)}"]`).click({ force: true });
      cy.get('[data-cy="documento"]').type(dados.cpf);
      cy.contains("button", /próximo/i).click();

      // Step 2: Credenciais — senhas divergentes
      const email = `smoke004.${Date.now()}@sig.test`;
      cy.get('[data-cy="email"]').type(email);
      cy.get('[data-cy="senha"]').type(dados.senha);
      cy.get('[data-cy="senhaConfirmar"]').type(dados.senha + "X");
      cy.contains("button", /próximo/i).click();

      cy.contains(
        /confirmar|confirmação|coincidem|iguais|diferentes|divergem|match|password/i
      ).should("be.visible");
      cy.get('[data-cy="finalizar"]').should("not.exist");
    });
  });
});
