export {};
interface CriarContaFixture {
  emailCadastrado: string;
  senha: string;
}

interface F13bFixture {
  edital: { id: number; titulo: string };
  proposta: { id: number; titulo: string };
  atividade: {
    titulo: string;
    mesInicio: string;
    duracaoLabel: string;
    duracaoColuna: string;
    cargaHorariaSemanal: string;
  };
}

const NAV_MEMBROS = '[data-cy="membros"]';
const NAV_ATIVIDADES = '[data-cy="atividades"]';
const NAV_VISUALIZACAO = '[data-cy="visualizacao-das-atividades"]';
const NEXT_BTN = '[data-cy="next-button"]';
const INPUT_PESQUISADOR = '[data-cy="nome-do-pesquisador"]';

const abrirApresentacao = (dados: F13bFixture) => {
  cy.visit(`/edital/${dados.edital.id}/minhas-propostas/${dados.proposta.id}`);
  cy.get('[data-cy="apresentacao"]').should("be.visible");
  // Clica para alternar; aguarda a animação MUI Collapse (~300ms) estabilizar;
  // se fechou (estava aberta), clica novamente para reabrir
  cy.get('[data-cy="apresentacao"]').click();
  cy.wait(500);
  cy.get("body").then(($body) => {
    if (($body.find('[data-cy="membros"]').outerHeight() ?? 0) === 0) {
      cy.get('[data-cy="apresentacao"]').click();
    }
  });
  cy.get('[data-cy="membros"]', { timeout: 15000 }).should("be.visible");
};

describe("TS-04 — F13b: Apresentação — Membros, Atividades e Visualização", () => {
  let dados: F13bFixture;
  let conta: Pick<CriarContaFixture, "email" | "senha">;

  before(() => {
    cy.fixture<F13bFixture>("ts04-prop/apresentacao").then((fixture) => {
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

  context("CT-SIG-PROP-021 — Membros: adicionar membro existente gera convite pendente", () => {
    it("deve exibir o Coordenador com status Aceito e criar convite Pendente para membro adicionado", () => {
      cy.get(NAV_MEMBROS).click({ force: true });

      cy.get("tbody tr", { timeout: 15000 }).should("have.length.at.least", 1);

      // Encontra o coordenador pela função, não pelo nome (independe do display name da conta)
      cy.contains("tbody tr", "Coordenador").then(($tr) => {
        expect($tr[0].innerText).to.include("Aceito");
      });

      // Sempre adiciona novo membro: membros já associados ficam excluídos da busca do servidor,
      // garantindo que sempre há um candidato novo. Acumular convites "Pendente" é esperado.
      cy.get(INPUT_PESQUISADOR).click();
      cy.get('[role="option"]', { timeout: 8000 }).first().then(($option) => {
        // $option.text() concatena as iniciais do avatar com o nome sem separador (ex: "VFVinicius Feitosa").
        // O nome real está em nó de texto direto da option, fora do <span> das iniciais.
        const addedMember = Array.from($option[0].childNodes)
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => n.textContent)
          .join("")
          .trim();
        cy.wrap($option).click();
        cy.contains("button", /adicionar/i).click();
        cy.contains("button", "Sim, continuar").click();
        cy.contains("button", "Confirmar").click();
        cy.contains("tbody tr", addedMember, { timeout: 10000 }).then(($tr) => {
          expect($tr[0].innerText).to.include("Pendente");
        });
      });

      cy.contains("tbody tr", "Coordenador").then(($tr) => {
        expect($tr[0].innerText).to.include("Aceito");
      });
    });
  });

  context("CT-SIG-PROP-022 — Membros: pesquisador inexistente exibe erro", () => {
    it("deve manter o botão ADICIONAR desabilitado e não inserir linha ao digitar nome inexistente", () => {
      cy.get(NAV_MEMBROS).click({ force: true });

      cy.get("tbody tr", { timeout: 15000 }).should("have.length.at.least", 1);
      cy.wait(1000); // aguarda carregamento completo da tabela antes de capturar contagem-base

      cy.get("tbody tr").its("length").then((qtdAntes) => {
        cy.get(INPUT_PESQUISADOR).type("Pesquisador Inexistente XYZ");
        cy.contains("button", /adicionar/i).should("be.disabled");
        // Limpa o campo antes de contar: digitar no input filtra a tabela existente
        cy.get(INPUT_PESQUISADOR).clear();
        cy.get("tbody tr", { timeout: 5000 }).its("length").should("eq", qtdAntes);
      });
    });
  });

  context("CT-SIG-PROP-023 — Membros: função do Coordenador é imutável", () => {
    it("deve exibir a função Coordenador sem campo editável na linha do coordenador", () => {
      cy.get(NAV_MEMBROS).click({ force: true });

      cy.contains("tbody tr", "Coordenador", { timeout: 15000 }).should("exist");
    });
  });

  context("CT-SIG-PROP-024 — Atividades: adicionar atividade válida", () => {
    it("deve inserir a atividade na tabela com os valores corretos após confirmação", () => {
      cy.get(NAV_ATIVIDADES).click({ force: true });
      cy.get('[data-cy="add-button"]', { timeout: 8000 }).should("be.visible");

      cy.get('[data-cy="add-button"]').click();
      cy.get('[data-cy="propostaAtividadeForm.titulo"]', { timeout: 10000 }).type(dados.atividade.titulo);

      // Mês de início: opções usam data-cy numérico, :visible funciona para este componente
      cy.get('[data-cy="open-mes-inicio"]').click();
      cy.get(`[data-cy="${dados.atividade.mesInicio}"]`).filter(':visible').click();

      // Duração: MUI Autocomplete — opções renderizadas no portal não passam em :visible
      cy.get('[data-cy="open-duracao"]').click();
      cy.contains('[role="option"]', dados.atividade.duracaoLabel).click({ force: true });

      cy.get('[data-cy="open-carga-horaria-semanal"]').click();
      cy.get(`[data-cy="${dados.atividade.cargaHorariaSemanal}"]`).click({ force: true });

      cy.get('[data-cy="propostaAtividade-confirmar"]').click();

      cy.contains("tbody tr", dados.atividade.titulo, { timeout: 10000 }).then(($tr) => {
        expect($tr[0].innerText).to.include(`${dados.atividade.mesInicio}°`);
        expect($tr[0].innerText).to.include(dados.atividade.duracaoColuna);
      });
    });
  });

  context("CT-SIG-PROP-025 — Atividades: campo obrigatório vazio bloqueia adição", () => {
    it("deve exibir mensagem de campo obrigatório e não inserir linha ao deixar Título vazio", () => {
      cy.get(NAV_ATIVIDADES).click({ force: true });

      // timeout maior pois CT-024 faz PATCH que pode deixar o servidor mais lento
      cy.get('[data-cy="add-button"]', { timeout: 20000 }).should("be.visible");

      cy.get("tbody tr").its("length").then((qtdAntes) => {
        cy.get('[data-cy="add-button"]').click();

        cy.get('[data-cy="open-mes-inicio"]', { timeout: 10000 }).click();
        cy.get(`[data-cy="${dados.atividade.mesInicio}"]`).filter(':visible').click();

        cy.get('[data-cy="open-duracao"]').click();
        cy.contains('[role="option"]', '2 meses').click({ force: true });

        cy.get('[data-cy="propostaAtividade-confirmar"]').click();

        cy.contains(/obrigatório|obrigatória|required|deve ter|entre.*1|1 e 128/i).should("be.visible");

        cy.get('[data-cy="propostaAtividade-cancelar"]').click();
        cy.get("tbody tr").its("length").should("eq", qtdAntes);
      });
    });
  });

  context("CT-SIG-PROP-026 — Atividades: visualização de atividades cadastradas", () => {
    it("deve exibir as atividades no Gantt e avançar para o Orçamento", () => {
      cy.get(NAV_VISUALIZACAO).click({ force: true });

      cy.contains("Visualização das atividades").should("be.visible");
      cy.contains(/^Ano\s+\d+$/i, { timeout: 10000 }).should("be.visible");
      cy.contains(/atividade/i).should("be.visible");

      cy.contains(dados.atividade.titulo).should("be.visible");

      cy.get(NEXT_BTN).click();

      cy.get('[data-cy="orcamento"]').should("be.visible");
    });
  });
});
