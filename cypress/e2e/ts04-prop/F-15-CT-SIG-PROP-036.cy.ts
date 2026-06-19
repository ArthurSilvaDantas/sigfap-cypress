export {};

interface CriarContaFixture {
  emailCadastrado: string;
  senha: string;
}

interface F15Fixture {
  edital: { id: number };
  titulo: string;
  duracao: string;
  resposta: string;
  tituloAtividade: string;
}

const NEXT_BTN         = '[data-cy="next-button"]';
const NAV_FINALIZACAO  = '[data-cy="finalizacao"]';
const AREA_CONFIRMAR   = '[data-cy="areaDeConhecimento-confirmar"]';
const ADD_BTN          = '[data-cy="add-button"]';
const TERMO_ACEITE     = '[data-cy="termo-de-aceite"]';
const TERMO_ACEITE_BOX = '[data-cy="termo-de-aceite-aceito-box"]';
const MENU_VERIFICAR   = '[data-cy="menu-verificar-pendencias"]';
const BTN_SUBMETER     = '.css-1alpf6f';

const realizarFluxoAteFinalizacao = (dados: F15Fixture) => {
  cy.visit(`/edital/${dados.edital.id}`);
  cy.get('[data-cy="criar-proposta"]', { timeout: 10000 }).click({ force: true });
  cy.get('[data-cy="informacoes-iniciais"]', { timeout: 10000 }).should("be.visible");

  // 1.1 Informações iniciais
  cy.get('[data-cy="titulo"]').clear().type(dados.titulo);
  cy.get('[data-cy="duracao"]').clear({ force: true }).type(dados.duracao, { force: true });
  cy.get('[data-cy="instituicao-executora-id"]').click();
  cy.get('[data-cy="ufms-universidade-federal-do-mat"]').click();
  cy.get('[data-cy="unidade-executora-id"]').click();
  cy.get('[data-cy="facom-faculdade-de-computacao"]').click();
  cy.get('[data-cy="add-areas-de-conhecimento"]').click();
  cy.get('[data-cy="search-grande-area-id"]').click();
  cy.get('[data-cy="ciencias-exatas-e-da-terra"]').click();
  cy.get('[data-cy="search-area-id"]').click();
  cy.get('[data-cy="probabilidade-e-estatistica"]').click();
  cy.get(AREA_CONFIRMAR).should("be.enabled").click();
  cy.get(NEXT_BTN).should("be.enabled").click({ force: true });

  // 1.2 Informações complementares
  cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-231-item-media-faturamento-ano-de-r-4-800"]').click();
  cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-232"]').click();
  cy.get('[aria-label="Junho 19, 2026"]').click();
  cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-233-item-bioeconomia"]').click();
  cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-234"]').clear().type(dados.resposta);
  cy.get('[data-cy="formularioPropostaInformacaoComplementar.pergunta-235-item-a3"]').click();
  cy.get(NEXT_BTN).should("be.enabled").click({ force: true });

  // 1.3 Abrangência (opcional)
  cy.get(NEXT_BTN).should("be.enabled").click({ force: true });

  // 2.1 Dados pessoais (auto-preenchido — duas sub-etapas)
  cy.get(NEXT_BTN).should("be.enabled").click({ force: true });
  cy.get(NEXT_BTN).should("be.enabled").click({ force: true });

  // 2.2 Endereço (opcional)
  cy.get(NEXT_BTN).should("be.enabled").click({ force: true });

  // 2.3 Dados acadêmicos (auto-preenchido)
  cy.get(NEXT_BTN).should("be.enabled").click({ force: true });

  // 3.1 Membros (opcional)
  cy.get(NEXT_BTN).should("be.enabled").click({ force: true });

  // 3.2 Atividades
  cy.get(ADD_BTN, { timeout: 10000 }).should("be.enabled").click({ force: true });
  cy.get('[data-cy="propostaAtividadeForm.titulo"]').clear().type(dados.tituloAtividade);
  cy.get('[data-cy="search-mes-inicio"]').click();
  cy.get('[data-cy="1"]').click();
  cy.get('[data-cy="search-duracao"]').click();
  cy.get('[data-cy="1-mes"]').click();
  cy.get('[data-cy="search-carga-horaria-semanal"]').click();
  cy.get('[data-cy="1-hora"]').click();
  cy.get('[data-cy="propostaAtividade-confirmar"]').should("be.enabled").click();
  cy.get(NEXT_BTN).should("be.enabled").click({ force: true });

  // 3.3 Visualização das atividades (opcional)
  cy.get(NEXT_BTN).should("be.enabled").click({ force: true });

  // 3.4.1 Bolsa (opcional)
  cy.get(NEXT_BTN).should("be.enabled").click({ force: true });

  // 3.4.2 Consolidação (opcional)
  cy.get(NEXT_BTN).should("be.enabled").click({ force: true });

  // 3.4.3 Solicitado à Fundação → Finalização
  cy.get(NEXT_BTN).should("be.enabled").click({ force: true });
  cy.get(NAV_FINALIZACAO, { timeout: 10000 }).should("be.visible");
};

describe("TS-04 — F15b: Proposta — Finalização", () => {
  let dados: F15Fixture;
  let conta: { email: string; senha: string };

  before(() => {
    cy.fixture<F15Fixture>("ts04-prop/perfil-proposta").then((f) => {
      dados = f;
    });
    cy.fixture<CriarContaFixture>("ts01-smoke/criar-conta").then((f) => {
      conta = { email: f.emailCadastrado, senha: f.senha };
    });
  });

  context("CT-SIG-PROP-036 — Termo de aceite habilita submissão", () => {
    beforeEach(() => {
      cy.typeLogin(conta.email, conta.senha);
      cy.get('[data-cy="user-menu"]').should("be.visible");
      realizarFluxoAteFinalizacao(dados);
    });

    it("deve manter botão de submissão desabilitado sem aceite do termo", () => {
      cy.get(TERMO_ACEITE_BOX).should("not.be.checked");
      cy.get(MENU_VERIFICAR).click();
      cy.get(BTN_SUBMETER).should("be.disabled");
    });

    it("deve habilitar botão de submissão após aceitar o termo", () => {
      cy.get(MENU_VERIFICAR).click();
      cy.get(BTN_SUBMETER).should("be.disabled");
      cy.get(MENU_VERIFICAR).click();

      cy.get(NAV_FINALIZACAO).click();
      cy.get(TERMO_ACEITE).click();
      cy.get(TERMO_ACEITE_BOX).click();

      cy.get(MENU_VERIFICAR).click();
      cy.get(BTN_SUBMETER).should("be.enabled");
    });
  });
});
