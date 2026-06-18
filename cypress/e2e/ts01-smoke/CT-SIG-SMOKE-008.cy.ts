import { toCyString } from "../../helpers/kebab.helper";

function goToStep3(dados: any) {
  cy.visit("/");
  cy.contains(/criar conta/i).click();

  // Step 1: Dados pessoais
  cy.get('[data-cy="nome"]').type(dados.nome);
  cy.get('[data-cy="dataNascimento"]').type(dados.dataNascimento);
  cy.get('[data-cy="open-sexo"]').click();
  cy.get(`[data-cy="${toCyString(dados.sexo)}"]`).click({ force: true });
  cy.get('[data-cy="documento"]').type(dados.cpf);
  cy.contains("button", /próximo/i).click();

  // Step 2: Credenciais
  const email = `smoke008.${Date.now()}@sig.test`;
  cy.get('[data-cy="email"]').type(email);
  cy.get('[data-cy="senha"]').type(dados.senha);
  cy.get('[data-cy="senhaConfirmar"]').type(dados.senhaConfirmar);
  cy.contains("button", /próximo/i).click();
}

describe("CT-SIG-SMOKE-008 — Aceite de Termos obrigatório no cadastro", () => {
  it("deve manter Finalizar desabilitado enquanto checkbox de Termos estiver desmarcado", () => {
    cy.fixture("ts01-smoke/criar-conta").then((dados) => {
      goToStep3(dados);
      cy.get('input[type="checkbox"]').should("not.be.checked");
      cy.get('[data-cy="finalizar"]').should("be.disabled");
    });
  });

  it("deve habilitar o botão Finalizar ao marcar o checkbox de Termos", () => {
    cy.fixture("ts01-smoke/criar-conta").then((dados) => {
      goToStep3(dados);
      cy.get('input[type="checkbox"]').should("not.be.checked");
      cy.get('[data-cy="finalizar"]').should("be.disabled");
      cy.get('input[type="checkbox"]').click({ force: true });
      cy.get('[data-cy="finalizar"]').should("be.enabled");
    });
  });
});
