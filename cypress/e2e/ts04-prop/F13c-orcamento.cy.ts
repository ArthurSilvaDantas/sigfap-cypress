interface CriarContaFixture {
  email: string;
  senha: string;
}

interface F13cFixture {
  edital: {
    id: number;
    titulo: string;
  };
  proposta: {
    id: number;
  };
  orcamento: {
    faixas: {
      faixaA: string;
      faixaB: string;
    };
    bolsa: {
      modalidade: string;
      nivel: string;
      quantidade: number;
      duracaoMeses: number;
      contrapartida: boolean;
      valorUnitario: string;
      valorTotal: string;
    };
    consolidacao: {
      subtotalBolsa: string;
      totalGeral: string;
    };
  };
}

const SELETORES = {
  campoFaixa: '[data-cy="faixa-financiamento-id"]',
  valorFaixa: '[data-cy="search-faixa-financiamento-id"]',
  abrirFaixa: '[data-cy="open-faixa-financiamento-id"]',
  opcaoFaixaA: '[data-cy="faixa-a-r-500-00-r-10-000-00"]',
  opcaoFaixaB: '[data-cy="faixa-b-r-10-000-01-r-25-000-00"]',
} as const;

const escaparRegex = (valor: string) =>
  valor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizarTexto = (valor: unknown) =>
  String(valor ?? "")
    .replace(/\s+/g, " ")
    .trim();

const removerAcentos = (valor: unknown) =>
  normalizarTexto(valor).normalize("NFD").replace(/[̀-ͯ]/g, "");

const abrirProposta = (dados: F13cFixture) => {
  cy.visit(`/edital/${dados.edital.id}/minhas-propostas/${dados.proposta.id}`);
  cy.contains(/Informa..es iniciais/i).should("be.visible");

  cy.get('[data-cy="apresentacao"]').should("be.visible").click();
  cy.get('[data-cy="orcamento"]').should("be.visible").click();
};

const acessarSubetapa = (dataCy: string) => {
  cy.get(`[data-cy="${dataCy}"]`).should("be.visible").click();
};

const salvarSecao = () => {
  cy.get('[data-cy="menu-salvar"]').should("be.enabled").click();
  cy.contains(/Salvo com sucesso!/i).should("be.visible");
};

const validarFaixaSelecionada = (
  faixaEsperada: string,
  seletorEsperado: string,
  seletorNaoEsperado: string,
) => {
  cy.get(SELETORES.valorFaixa).should(($input) => {
    expect(
      normalizarTexto($input.val()),
      `valor exibido para a faixa selecionada`,
    ).to.equal(normalizarTexto(faixaEsperada));
  });

  cy.get(seletorEsperado).should("have.attr", "aria-selected", "true");
  cy.get(seletorNaoEsperado).should(
    "have.attr",
    "aria-selected",
    "false",
  );
};

const selecionarOpcaoPorRotulo = (rotulo: string, opcao: string) => {
  cy.getByLabel(rotulo).should("be.visible").click({ force: true });
  cy.contains(
    new RegExp(`^\\s*${escaparRegex(opcao)}\\s*$`, "i"),
  )
    .filter(":visible")
    .last()
    .click();
};

const localizarLinhasDaBolsa = (
  $linhas: JQuery<HTMLElement>,
  modalidade: string,
  nivel: string,
) => {
  const identificacao = new RegExp(
    `${escaparRegex(modalidade)}\\s*-\\s*${escaparRegex(
      nivel.replace(/\s*\(.+$/, ""),
    )}`,
    "i",
  );

  return $linhas.filter((_indice, linha) =>
    identificacao.test(normalizarTexto(linha.innerText)),
  );
};

const validarBolsa = (
  bolsa: F13cFixture["orcamento"]["bolsa"],
  contexto: string,
) => {
  cy.get("table tbody tr").then(($linhas) => {
    const $linhaBolsa = localizarLinhasDaBolsa(
      $linhas,
      bolsa.modalidade,
      bolsa.nivel,
    );

    expect(
      $linhaBolsa.length,
      `CT-SIG-PROP-029: uma unica linha de bolsa ${contexto}`,
    ).to.equal(1);

    cy.wrap($linhaBolsa.eq(0)).within(() => {
      cy.get("td").should("have.length.at.least", 6);
      cy.get("td")
        .eq(0)
        .should(
          "contain.text",
          `${bolsa.modalidade} - ${bolsa.nivel.replace(/\s*\(.+$/, "")}`,
        );
      cy.get("td").eq(1).should("have.text", String(bolsa.quantidade));
      cy.get("td").eq(2).should("have.text", String(bolsa.duracaoMeses));
      cy.get("td").eq(3).should("contain.text", bolsa.valorUnitario);
      cy.get("td")
        .eq(4)
        .should(($celula) => {
          expect(removerAcentos($celula.text())).to.include(
            bolsa.contrapartida ? "Sim" : "Nao",
          );
        });
      cy.get("td").eq(5).should("contain.text", bolsa.valorTotal);
    });
  });

  cy.contains(/Total gasto em cada moeda/i).should("be.visible");
  cy.contains(
    new RegExp(`Real\\s*\\(R\\$\\)\\s*${escaparRegex(bolsa.valorTotal)}`, "i"),
  ).should("be.visible");
};

const cadastrarBolsa = (bolsa: F13cFixture["orcamento"]["bolsa"]) => {
  cy.get('[data-cy="add-button"]').should("be.visible").click();
  cy.contains(/Rubrica Bolsa/i).should("be.visible");

  selecionarOpcaoPorRotulo("Modalidade da Bolsa", bolsa.modalidade);
  selecionarOpcaoPorRotulo("Nível da Bolsa", bolsa.nivel);
  cy.getByLabel("Quantidade").clear().type(String(bolsa.quantidade));
  cy.getByLabel("Duração (Em meses)")
    .clear()
    .type(String(bolsa.duracaoMeses));

  cy.getByLabel("Contrapartida").then(($checkbox) => {
    if ($checkbox.is(":checked") !== bolsa.contrapartida) {
      cy.wrap($checkbox).click({ force: true });
    }
  });
  cy.getByLabel("Contrapartida").should(
    bolsa.contrapartida ? "be.checked" : "not.be.checked",
  );

  cy.getByLabel("Valor Total").should("have.value", bolsa.valorTotal);
  cy.contains("button", /^Confirmar$/i).should("be.enabled").click();
};

describe("F-13c - Orcamento", () => {
  let dados: F13cFixture;
  let conta: Pick<CriarContaFixture, "email" | "senha">;

  before(() => {
    cy.fixture<F13cFixture>("ts04-prop/F13c-orcamento").then((fixture) => {
      dados = fixture;
    });
    cy.fixture<CriarContaFixture>("criar-conta").then((fixture) => {
      conta = { email: fixture.email, senha: fixture.senha };
    });
  });

  beforeEach(() => {
    cy.typeLogin(conta.email, conta.senha);
    cy.get('[data-cy="user-menu"]').should("be.visible");
    abrirProposta(dados);
  });

  it("CT-SIG-PROP-027 - seleciona e persiste as Faixas A e B", () => {
    acessarSubetapa("faixa-de-financiamento");

    const faixas = [
      {
        texto: dados.orcamento.faixas.faixaA,
        seletor: SELETORES.opcaoFaixaA,
        outroSeletor: SELETORES.opcaoFaixaB,
      },
      {
        texto: dados.orcamento.faixas.faixaB,
        seletor: SELETORES.opcaoFaixaB,
        outroSeletor: SELETORES.opcaoFaixaA,
      },
    ];

    faixas.forEach((faixa) => {
      cy.get(SELETORES.abrirFaixa).should("be.visible").click();
      cy.get(SELETORES.opcaoFaixaA).should("be.visible");
      cy.get(SELETORES.opcaoFaixaB).should("be.visible");
      cy.get(faixa.seletor).click();

      validarFaixaSelecionada(
        faixa.texto,
        faixa.seletor,
        faixa.outroSeletor,
      );
      salvarSecao();

      acessarSubetapa("bolsa");
      acessarSubetapa("faixa-de-financiamento");
      validarFaixaSelecionada(
        faixa.texto,
        faixa.seletor,
        faixa.outroSeletor,
      );
    });
  });

  it.skip("CT-SIG-PROP-028 - cadastra item em Servicos de Terceiros", () => {
    // DEF-A reproduzido manualmente em multiplas contas e propostas: ao clicar
    // em "+ Adicionar" ([data-cy="add-button"]) na subetapa Servicos de Terceiros,
    // a aplicacao exibe tela em branco sem renderizar qualquer conteudo.
    // Gatilho identico ao DEF-B (add-button), sintoma diferente por conta/subetapa.
    // Reativar quando DEF-A for corrigido. Ver Issue #3.
  });

  // CT-SIG-PROP-029 - Orcamento > Bolsa (DEF-B)
  // DEF-B reproduzido e confirmado nesta rodada, fora do Cypress (Playwright +
  // Chrome headless, sem nenhuma dependencia do Cypress/Electron): ao clicar no
  // botao "+ Adicionar" (data-cy="add-button") da subetapa Bolsa, a pagina inteira
  // trava (sem resposta por mais de 6 minutos, inclusive para o protocolo do
  // navegador). Nao e um problema de timeout de assertion: e a aplicacao SIGFAP que
  // entra em hang ao abrir o formulario "Rubrica Bolsa" neste ambiente homolog.
  // Mantido it.skip de proposito: executar cadastrarBolsa() aqui travaria o
  // cypress run inteiro (sem timeout natural), o que e inviavel em qualquer pipeline.
  // Reativar quando DEF-B for corrigido. A Issue sera criada em etapa posterior,
  // com autorizacao do time.
  it.skip("CT-SIG-PROP-029 - cadastra, calcula e persiste uma Bolsa AT/NS", () => {
    acessarSubetapa("bolsa");

    cy.get("body").then(($body) => {
      const $linhas = $body.find("table tbody tr");
      const $linhaBolsa = localizarLinhasDaBolsa(
        $linhas,
        dados.orcamento.bolsa.modalidade,
        dados.orcamento.bolsa.nivel,
      );

      if ($linhaBolsa.length === 0) {
        cadastrarBolsa(dados.orcamento.bolsa);
      }
    });

    validarBolsa(dados.orcamento.bolsa, "antes de salvar");
    salvarSecao();

    acessarSubetapa("faixa-de-financiamento");
    acessarSubetapa("bolsa");
    validarBolsa(dados.orcamento.bolsa, "apos salvar, navegar e retornar");
  });

  // CT-SIG-PROP-030 - Orcamento > Consolidacao (DEF-B)
  // Estrutura confirmada fora do Cypress (Playwright + Chrome headless): a
  // subetapa Consolidacao exibe uma tabela simples com colunas "Nome" / "R$",
  // uma linha por rubrica com valor cadastrado (ex.: "Bolsa") e uma linha final
  // "Valor total". Navegar para [data-cy="consolidacao"] e seguro e nao aciona
  // o hang do DEF-B.
  // Mantido it.skip: o oraculo abaixo depende de uma Bolsa cadastrada
  // (CT-SIG-PROP-029), que esta bloqueado por DEF-B (hang ao clicar em
  // [data-cy="add-button"] na subetapa Bolsa). Reativar junto com CT-029
  // quando DEF-B for corrigido.
  it.skip("CT-SIG-PROP-030 - consolida os valores do orcamento", () => {
    acessarSubetapa("consolidacao");

    cy.contains(/Consolida..o/i).should("be.visible");

    cy.get<HTMLTableRowElement>("table tbody tr").then(($linhas) => {
      const linhaBolsa = [...$linhas].find((linha) =>
        removerAcentos(linha.cells[0]?.textContent).toLowerCase().includes("bolsa"),
      );
      const linhaTotal = [...$linhas].find((linha) =>
        removerAcentos(linha.cells[0]?.textContent).toLowerCase().includes("valor total"),
      );

      expect(linhaBolsa, "linha 'Bolsa' na Consolidacao").to.exist;
      expect(linhaTotal, "linha 'Valor total' na Consolidacao").to.exist;

      expect(normalizarTexto(linhaBolsa?.cells[1]?.textContent)).to.equal(
        `R$ ${dados.orcamento.consolidacao.subtotalBolsa}`,
      );
      expect(normalizarTexto(linhaTotal?.cells[1]?.textContent)).to.equal(
        `R$ ${dados.orcamento.consolidacao.totalGeral}`,
      );
    });
  });
});
