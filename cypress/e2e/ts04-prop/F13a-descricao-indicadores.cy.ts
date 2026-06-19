export {};
interface CriarContaFixture {
  emailCadastrado: string;
  senha: string;
}

interface F13aFixture {
  edital: { id: number; titulo: string };
  proposta: { id: number; titulo: string };
  descricao: {
    respostaValida: string;
    limiteMaximo: { chars: number; texto: string };
  };
  indicadores: {
    linha: string;
    quantidadeNacional: number;
    quantidadeInternacional: number;
  };
}

const PERGUNTA_1_OPCAO_1 = '[data-cy="formularioPropostaDescritiva.pergunta-221-item-opcao-1"]';
const PERGUNTA_1_OPCAO_2 = '[data-cy="formularioPropostaDescritiva.pergunta-221-item-opcao-2"]';
const PERGUNTA_2_TEXTAREA = '[data-cy="formularioPropostaDescritiva.pergunta-222"]';
const NEXT_BTN = '[data-cy="next-button"]';
const NAV_DESCRICAO = '[data-cy="descricao"]';
const NAV_INDICADORES = '[data-cy="indicadores-de-producao"]';

const abrirApresentacao = (dados: F13aFixture) => {
  cy.visit(`/edital/${dados.edital.id}/minhas-propostas/${dados.proposta.id}`);
  cy.get('[data-cy="apresentacao"]').should("be.visible");
  // Clica para alternar; aguarda a animação MUI Collapse (~300ms) estabilizar;
  // se fechou (estava aberta), clica novamente para reabrir
  cy.get('[data-cy="apresentacao"]').click();
  cy.wait(500);
  cy.get("body").then(($body) => {
    if (($body.find('[data-cy="descricao"]').outerHeight() ?? 0) === 0) {
      cy.get('[data-cy="apresentacao"]').click();
    }
  });
  cy.get('[data-cy="descricao"]', { timeout: 15000 }).should("be.visible");
};

describe("TS-04 — F13a: Apresentação — Descrição e Indicadores de Produção", () => {
  let dados: F13aFixture;
  let conta: Pick<CriarContaFixture, "email" | "senha">;

  before(() => {
    cy.fixture<F13aFixture>("ts04-prop/apresentacao").then((fixture) => {
      dados = fixture;
    });
    cy.fixture<CriarContaFixture>("ts01-smoke/criar-conta").then((fixture) => {
      conta = { email: fixture.emailCadastrado, senha: fixture.senha };
    });
  });

  beforeEach(() => {
    cy.typeLogin(conta.email, conta.senha);
    cy.get('[data-cy="user-menu"]').should("be.visible");
    abrirApresentacao(dados);
  });

  context("CT-SIG-PROP-016 — Descrição: caminho feliz", () => {
    it("deve exibir as duas perguntas nos tipos corretos e aceitar respostas válidas avançando para Indicadores", () => {
      cy.get(NAV_DESCRICAO).click();

      cy.get(PERGUNTA_1_OPCAO_1, { timeout: 10000 }).should("be.visible");
      cy.get(PERGUNTA_1_OPCAO_2).should("be.visible");
      cy.get(PERGUNTA_1_OPCAO_1).click();
      cy.get(PERGUNTA_2_TEXTAREA).should("be.visible").clear().type(dados.descricao.respostaValida);
      cy.get(NEXT_BTN).click();

      cy.contains("Indicadores de produção").should("be.visible");
    });
  });

  context("CT-SIG-PROP-017 — Descrição: perguntas obrigatórias bloqueiam avanço", () => {
    it("deve marcar as perguntas como obrigatórias e exibir indicadores (*) visíveis na tela", () => {
      cy.get(NAV_DESCRICAO).click();

      cy.get("main, [class*='content'], form")
        .contains(/\*/)
        .should("exist");

      cy.get(PERGUNTA_2_TEXTAREA).clear();
      cy.get(NEXT_BTN).click();

      cy.contains(/no mínimo 10 caractere/i).should("be.visible");
      cy.get(PERGUNTA_2_TEXTAREA).should("exist");
    });
  });

  context("CT-SIG-PROP-018 — Descrição: limites de caracteres da Pergunta 2", () => {
    it("deve exibir contador de caracteres e limitar entrada ao máximo de 20 chars", () => {
      cy.get(NAV_DESCRICAO).click();

      cy.contains(/\d+\/20/).should("be.visible");
      cy.get(PERGUNTA_2_TEXTAREA).should("have.attr", "maxlength", "20");

      cy.get(PERGUNTA_1_OPCAO_1).click();
      cy.get(PERGUNTA_2_TEXTAREA).clear().type(dados.descricao.limiteMaximo.texto);
      cy.get(PERGUNTA_2_TEXTAREA).invoke("val").then((val) => {
        expect((val as string).length).to.be.lte(20);
      });
    });
  });

  context("CT-SIG-PROP-019 — Indicadores de Produção: caminho feliz", () => {
    it("deve exibir tabela com colunas corretas e aceitar valores numéricos positivos avançando para Membros", () => {
      cy.get(NAV_INDICADORES).click();

      cy.contains("Produção Bibliográfica").should("be.visible");
      cy.get("thead").within(() => {
        cy.contains(/Nacional/i).should("exist");
        cy.contains(/Internacional/i).should("exist");
      });

      cy.contains("tr", dados.indicadores.linha).within(() => {
        cy.get('input[type="number"]').first().clear().type(String(dados.indicadores.quantidadeNacional));
        cy.get('input[type="number"]').last().clear().type(String(dados.indicadores.quantidadeInternacional));
      });

      cy.get(NEXT_BTN).click();

      cy.contains("h2, h3, [class*='subtitle'], [class*='title']", /membros/i, {
        timeout: 8000,
      }).should("be.visible");
    });
  });

  context("CT-SIG-PROP-020 — Indicadores de Produção: valor inválido", () => {
    it("deve rejeitar ou bloquear valor negativo na Qtde. Nacional", () => {
      cy.get(NAV_INDICADORES).click();

      // input[type=number] rejeita o sinal "-" na digitação, ficando vazio
      cy.contains("tr", dados.indicadores.linha).within(() => {
        cy.get('input[type="number"]').first().clear().type("-1");
      });

      cy.get(NEXT_BTN).click();

      cy.contains(/erro/i).should("be.visible");
      cy.contains("Produção Bibliográfica", { timeout: 5000 }).should("be.visible");
    });

    it("deve ignorar ou rejeitar valor não numérico na Qtde. Internacional", () => {
      cy.get(NAV_INDICADORES).click();

      cy.contains("tr", dados.indicadores.linha).within(() => {
        // input[type=number] ignora texto não numérico em HTML nativo
        cy.get('input[type="number"]').last().clear().type("abc");
        cy.get('input[type="number"]').last().invoke("val").then((val) => {
          expect(val).to.equal("");
        });
      });
    });
  });
});
