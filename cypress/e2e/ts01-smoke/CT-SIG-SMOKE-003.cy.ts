import { toCyString } from "../../helpers/kebab.helper";

describe("CT-SIG-SMOKE-003 — E-mail já cadastrado", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("deve exibir erro ao tentar cadastrar e-mail já existente no sistema", () => {
    cy.fixture("ts01-smoke/criar-conta").then((dados) => {
      cy.fixture("ts01-smoke/usuarios").then((usuarios) => {
        // Step 1: Dados pessoais
        cy.contains(/criar conta/i).click();
        cy.get('[data-cy="nome"]').type(dados.nome);
        cy.get('[data-cy="dataNascimento"]').type(dados.dataNascimento);
        cy.get('[data-cy="open-sexo"]').click();
        cy.get(`[data-cy="${toCyString(dados.sexo)}"]`).click({ force: true });
        cy.get('[data-cy="documento"]').type(dados.cpf);
        cy.contains("button", /próximo/i).click();

        // Step 2: Credenciais — e-mail já cadastrado
        cy.get('[data-cy="email"]').type(usuarios.proponente.email);
        cy.get('[data-cy="senha"]').type(dados.senha);
        cy.get('[data-cy="senhaConfirmar"]').type(dados.senhaConfirmar);
        cy.contains("button", /próximo/i).click();

        // Step 3: Aceite de Termos
        cy.get('input[type="checkbox"]').click({ force: true });
        cy.get('[data-cy="finalizar"]').should("be.enabled").click();

        cy.contains(
          /e-mail|email|já.*cadastrado|already.*exist|em uso|cadastrado|duplicado|existente|conflict|erro/i
        ).should("exist");
        cy.get('[data-cy="user-menu"]').should("not.exist");
      });
    });
  });
});
