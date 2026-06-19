export {};

interface CriarContaFixture {
  emailCadastrado: string;
  senha: string;
}

interface F11Fixture {
  edital: { id: number };
  proposta: { id: number };
  titulo: string;
  duracao: string;
  instituicao: string;
}

const NAV_CARACTERIZACAO = '[data-cy="caracterizacao"]';
const NAV_INFO_INICIAIS  = '[data-cy="informacoes-iniciais"]';
const TITULO             = '[data-cy="titulo"]';
const DURACAO            = '[data-cy="duracao"]';
const SEARCH_INSTITUICAO = '[data-cy="search-instituicao-executora-id"]';
const CLOSE_INSTITUICAO  = '[data-cy="close-instituicao-executora-id"]';
const SEARCH_UNIDADE     = '[data-cy="search-unidade-executora-id"]';
const NEXT_BTN           = '[data-cy="next-button"]';
const ADD_BTN            = '[data-cy="add-button"]';

const PERGUNTA_28 = '[data-cy="formularioPropostaInformacaoComplementar.pergunta-28-item-ods01-erradicar-a-pobreza-em-tod"]';
const PERGUNTA_29 = '[data-cy="formularioPropostaInformacaoComplementar.pergunta-29-item-micro-faturamento-ano-de-r-81-00"]';
const PERGUNTA_30 = '[data-cy="formularioPropostaInformacaoComplementar.pergunta-30-item-tecnologia"]';
const PERGUNTA_31 = '[data-cy="formularioPropostaInformacaoComplementar.pergunta-31"]';
const PERGUNTA_32 = '[data-cy="formularioPropostaInformacaoComplementar.pergunta-32"]';

// Expande a seção Caracterização no sidebar e aguarda o link de Info Iniciais ficar visível
const abrirCaracterizacao = (dados: F11Fixture) => {
  cy.visit(`/edital/${dados.edital.id}/minhas-propostas/${dados.proposta.id}`);
  cy.get(NAV_CARACTERIZACAO).should("be.visible");
  cy.get(NAV_CARACTERIZACAO).click();
  cy.wait(500);
  cy.get("body").then(($body) => {
    if (($body.find(NAV_INFO_INICIAIS).outerHeight() ?? 0) === 0) {
      cy.get(NAV_CARACTERIZACAO).click();
    }
  });
  cy.get(NAV_INFO_INICIAIS, { timeout: 15000 }).should("be.visible");
};

// Navega para Informações Complementares usando os dados já salvos na proposta existente
const irParaComplementares = () => {
  cy.get(NAV_INFO_INICIAIS).click({ force: true });
  cy.get(NEXT_BTN, { timeout: 8000 }).click({ force: true });
  cy.get('[data-cy^="formularioPropostaInformacaoComplementar"]', { timeout: 10000 }).should("exist");
};

const preencherComplementares = () => {
  cy.get(PERGUNTA_28).click({ force: true });
  cy.get(PERGUNTA_29).click({ force: true });
  cy.get(PERGUNTA_30).click({ force: true });
  cy.get(PERGUNTA_31).clear().type("Resposta de teste para a pergunta dissertativa.");
  cy.get(PERGUNTA_32).clear().type("Resposta teste");
};

describe("TS-04 — F11: Proposta — Caracterização", () => {
  let dados: F11Fixture;
  let conta: { email: string; senha: string };

  before(() => {
    cy.fixture<F11Fixture>("ts04-prop/caracterizacao").then((f) => {
      dados = f;
    });
    cy.fixture<CriarContaFixture>("ts01-smoke/criar-conta").then((f) => {
      conta = { email: f.emailCadastrado, senha: f.senha };
    });
  });

  beforeEach(() => {
    cy.typeLogin(conta.email, conta.senha);
    cy.get('[data-cy="user-menu"]').should("be.visible");
  });

  context("CT-SIG-PROP-002 — Informações Iniciais: caminho feliz", () => {
    beforeEach(() => {
      abrirCaracterizacao(dados);
      cy.get(NAV_INFO_INICIAIS).click({ force: true });
      cy.get(TITULO, { timeout: 8000 }).should("exist");
    });

    it("deve preencher dados válidos e avançar para Informações Complementares", () => {
      cy.get(TITULO).clear().type(dados.titulo);
      cy.get(DURACAO).clear({ force: true }).type(dados.duracao, { force: true });
      cy.get(CLOSE_INSTITUICAO).click({ force: true });
      cy.get(SEARCH_INSTITUICAO).type(dados.instituicao, { force: true });
      cy.contains(/UFMS\/Universidade Federal do Mato Grosso do Sul/i).click({ force: true });
      cy.get(NEXT_BTN).click({ force: true });

      cy.get('[data-cy^="formularioPropostaInformacaoComplementar"]', { timeout: 10000 }).should("exist");
    });

    it("deve exibir campo Título do Edital como somente leitura", () => {
      cy.get('[data-cy="edital.nome"]').should("exist").and("be.disabled");
    });

    it("deve exibir campos de Instituição e Unidade Executora", () => {
      cy.get(SEARCH_INSTITUICAO).should("exist");
      cy.get(SEARCH_UNIDADE).should("exist");
    });
  });

  context("CT-SIG-PROP-003 — Informações Iniciais: campos obrigatórios vazios bloqueiam avanço", () => {
    beforeEach(() => {
      abrirCaracterizacao(dados);
      cy.get(NAV_INFO_INICIAIS).click({ force: true });
      cy.get(TITULO, { timeout: 8000 }).should("exist");
    });

    it("deve bloquear avanço quando Título está vazio", () => {
      cy.get(TITULO).clear();
      cy.get(DURACAO).clear({ force: true }).type("12", { force: true });
      cy.get(NEXT_BTN).click({ force: true });

      cy.get(TITULO).should("exist");
      cy.get('[data-cy^="formularioPropostaInformacaoComplementar"]').should("not.exist");
    });

    it("deve bloquear avanço quando Duração está vazia", () => {
      cy.get(TITULO).clear().type("Projeto Teste");
      cy.get(DURACAO).clear({ force: true });
      cy.get(NEXT_BTN).click({ force: true });

      cy.get(DURACAO).should("exist");
      cy.get('[data-cy^="formularioPropostaInformacaoComplementar"]').should("not.exist");
    });

    it("deve bloquear avanço sem nenhum campo preenchido", () => {
      cy.get(TITULO).clear();
      cy.get(DURACAO).clear({ force: true });
      cy.get(NEXT_BTN).click({ force: true });

      cy.get(TITULO).should("exist");
      cy.get('[data-cy^="formularioPropostaInformacaoComplementar"]').should("not.exist");
    });
  });

  context("CT-SIG-PROP-004 — Informações Iniciais: limite de caracteres no Título", () => {
    beforeEach(() => {
      abrirCaracterizacao(dados);
      cy.get(NAV_INFO_INICIAIS).click({ force: true });
      cy.get(TITULO, { timeout: 8000 }).should("exist");
    });

    it("deve aceitar Título com comprimento válido (25 caracteres)", () => {
      const tituloValido = "Projeto de Teste VVT 2026";
      cy.get(TITULO).clear().type(tituloValido);

      cy.get(TITULO).should("have.value", tituloValido);
    });

    it("deve truncar Título com 300 caracteres (acima do limite)", () => {
      cy.get(TITULO).clear().type("A".repeat(300), { delay: 0 });

      cy.get(TITULO).invoke("val").then((val) => {
        const comprimento = (val as string).length;
        cy.log(`Comprimento após digitação: ${comprimento}`);
        expect(comprimento).to.be.lessThan(300);
      });
    });
  });

  context("CT-SIG-PROP-005 — Informações Iniciais: Duração inválida (data-driven)", () => {
    beforeEach(() => {
      abrirCaracterizacao(dados);
      cy.get(NAV_INFO_INICIAIS).click({ force: true });
      cy.get(TITULO, { timeout: 8000 }).should("exist");
    });

    it("deve bloquear avanço para cada valor de Duração inválido", () => {
      cy.fixture<Array<{ valor: string; descricao: string }>>("ts04-prop/duracao-invalida").then((casos) => {
        casos.forEach((caso) => {
          cy.log(`Testando Duração: "${caso.valor}" — ${caso.descricao}`);

          cy.get(TITULO).clear().type("Projeto Teste VVT");
          cy.get(DURACAO).clear({ force: true });
          if (caso.valor !== "") {
            cy.get(DURACAO).type(caso.valor, { force: true });
          }
          cy.get(NEXT_BTN).click({ force: true });

          cy.get(DURACAO).should("exist");
          cy.get('[data-cy^="formularioPropostaInformacaoComplementar"]').should("not.exist");

          cy.get(NAV_INFO_INICIAIS).click({ force: true });
          cy.get(TITULO, { timeout: 5000 }).should("exist");
        });
      });
    });

    it("deve aceitar Duração = 12 (valor válido no limite máximo)", () => {
      cy.get(TITULO).clear().type("Projeto Teste VVT 2026");
      cy.get(DURACAO).clear({ force: true }).type("12", { force: true });

      cy.get(DURACAO).invoke("val").should("match", /^12$/);
    });
  });

  context("CT-SIG-PROP-006 — Informações Iniciais: Unidade Executora condicional", () => {
    beforeEach(() => {
      abrirCaracterizacao(dados);
      cy.get(NAV_INFO_INICIAIS).click({ force: true });
      cy.get(TITULO, { timeout: 8000 }).should("exist");
    });

    it("deve habilitar busca de Unidade ao selecionar Instituição Executora", () => {
      cy.get(CLOSE_INSTITUICAO).click({ force: true });
      cy.get(SEARCH_INSTITUICAO).type("UFMS", { force: true });
      cy.contains(/UFMS\/Universidade Federal do Mato Grosso do Sul/i).click({ force: true });

      cy.get(SEARCH_UNIDADE).should("exist").and("not.be.disabled");
    });

    it("deve resetar Unidade Executora ao limpar Instituição Executora", () => {
      cy.get(SEARCH_INSTITUICAO).type("UFMS", { force: true });
      cy.contains(/UFMS\/Universidade Federal do Mato Grosso do Sul/i).click({ force: true });
      cy.get(CLOSE_INSTITUICAO).click({ force: true });

      cy.get(SEARCH_UNIDADE).clear({ force: true }).type("Qualquer", { force: true });
      cy.contains(/nenhuma opção|nenhum resultado/i).should("exist");
    });
  });

  context("CT-SIG-PROP-007 — Informações Complementares: dados válidos avançam para Abrangência", () => {
    beforeEach(() => {
      abrirCaracterizacao(dados);
      irParaComplementares();
    });

    it("deve exibir todos os campos da etapa Informações Complementares", () => {
      cy.get(PERGUNTA_28).should("exist");
      cy.get(PERGUNTA_29).should("exist");
      cy.get(PERGUNTA_30).should("exist");
      cy.get(PERGUNTA_31).should("exist");
      cy.get(PERGUNTA_32).should("exist");
    });

    it("deve avançar para Abrangência ao responder todas as perguntas com dados válidos", () => {
      preencherComplementares();
      cy.get(NEXT_BTN).click({ force: true });

      cy.get(ADD_BTN, { timeout: 10000 }).should("exist");
    });
  });

  context("CT-SIG-PROP-008 — Informações Complementares: perguntas são opcionais", () => {
    beforeEach(() => {
      abrirCaracterizacao(dados);
      irParaComplementares();
    });

    it("deve exibir os campos das perguntas complementares", () => {
      cy.get(PERGUNTA_28).should("exist");
      cy.get(PERGUNTA_31).should("exist");
    });

    it("deve permitir avançar para Abrangência sem responder nenhuma pergunta", () => {
      cy.get(NEXT_BTN).click({ force: true });

      cy.get("body").then(($body) => {
        const avancou =
          $body.find(ADD_BTN).length > 0 ||
          $body.find('[data-cy^="formularioPropostaInformacaoComplementar"]').length === 0;
        cy.log(`Sistema permitiu avanço (perguntas opcionais): ${avancou}`);
        expect(avancou).to.be.true;
      });
    });
  });

  context("CT-SIG-PROP-009 — Informações Complementares: limite de caracteres na Pergunta 31", () => {
    beforeEach(() => {
      abrirCaracterizacao(dados);
      irParaComplementares();
    });

    it("deve aceitar texto dentro do limite na Pergunta 31", () => {
      cy.fixture<Array<{ descricao: string; esperado: string; texto: string }>>("ts04-prop/complementares-limite").then((casos) => {
        const caso = casos.find((c) => c.esperado === "aceitar");
        if (!caso) return;

        cy.get(PERGUNTA_31).clear().type(caso.texto, { delay: 0 });
        cy.get(PERGUNTA_31).invoke("val").then((val) => {
          expect((val as string).length).to.be.gt(0);
        });
      });
    });

    it("deve truncar texto com 2001+ caracteres na Pergunta 31", () => {
      cy.fixture<Array<{ descricao: string; esperado: string; texto: string }>>("ts04-prop/complementares-limite").then((casos) => {
        const caso = casos.find((c) => c.esperado === "truncar ou erro");
        if (!caso) return;

        cy.get(PERGUNTA_31).clear().type(caso.texto, { delay: 0 });
        cy.get(PERGUNTA_31).invoke("val").then((valor) => {
          const comprimento = (valor as string).length;
          cy.log(`Comprimento após digitação: ${comprimento}`);
          expect(comprimento).to.be.lessThan(2001);
        });
      });
    });
  });

  context("CT-SIG-PROP-010 — Abrangência: etapa opcional", () => {
    beforeEach(() => {
      abrirCaracterizacao(dados);
      irParaComplementares();
      preencherComplementares();
      cy.get(NEXT_BTN).click({ force: true });
      cy.get(ADD_BTN, { timeout: 10000 }).should("exist");
    });

    it("deve exibir botão Adicionar e colunas Estado/Município na Abrangência", () => {
      cy.get(ADD_BTN).should("exist");
      cy.contains(/estado/i).should("exist");
      cy.contains(/município/i).should("exist");
    });

    it("deve permitir avançar sem adicionar abrangência (campo opcional)", () => {
      cy.get(NEXT_BTN).should("exist").and("not.be.disabled");
      cy.get(NEXT_BTN).click({ force: true });

      cy.contains(/coordenação|coordenador|apresentação/i, { timeout: 10000 }).should("exist");
    });

    it("deve abrir formulário de seleção ao clicar em Adicionar na Abrangência", () => {
      cy.get(ADD_BTN).click({ force: true });

      cy.contains(/estado/i).should("exist");
    });
  });
});
