import { toCyString } from "../../helpers/kebab.helper";

function fillStep1(dados: any) {
  cy.contains(/criar conta/i).click();

  // Step 1: Dados pessoais
  cy.get('[data-cy="nome"]').type(dados.nome);
  cy.get('[data-cy="dataNascimento"]').type(dados.dataNascimento);
  cy.get('[data-cy="open-sexo"]').click();
  cy.get(`[data-cy="${toCyString(dados.sexo)}"]`).click({ force: true });
  cy.get('[data-cy="documento"]').type(dados.cpf);
  cy.contains("button", /próximo/i).click();
}

describe("CT-SIG-SMOKE-002 — Senha não atende regras de complexidade", () => {
  it("deve exibir erro de validação para cada senha que viola as regras de complexidade", () => {
    cy.fixture("ts01-smoke/criar-conta").then((dados) => {
      cy.fixture("ts01-smoke/senhas-invalidas").then(
        (senhas: Array<{ senha: string; descricao: string }>) => {
          senhas.forEach((item, idx) => {
            cy.log(`[${idx + 1}/${senhas.length}] ${item.descricao}: "${item.senha}"`);
            cy.visit("/");
            fillStep1(dados);

            // Step 2: Credenciais
            const email = `smoke002.${idx}.${Date.now()}@sig.test`;
            cy.get('[data-cy="email"]').type(email);
            cy.get('[data-cy="senha"]').type(item.senha);
            cy.get('[data-cy="senhaConfirmar"]').type(item.senha);
            cy.contains("button", /próximo/i).click();

            cy.contains(
              /senha|complexidade|maiúscula|minúscula|especial|número|caractere|mínimo|inválida|fraca|weak|password/i
            ).should("be.visible");
            cy.get('[data-cy="finalizar"]').should("not.exist");
          });
        }
      );
    });
  });
});
