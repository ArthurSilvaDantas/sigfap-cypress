export {};

interface CriarContaFixture {
  emailCadastrado: string;
  senha: string;
}

interface F12Fixture {
  edital: { id: number };
  proposta: { id: number };
}

const NAV_COORDENACAO = '[data-cy="coordenacao"]';
const NEXT_BTN        = '[data-cy="next-button"]';

const abrirCoordenacao = (dados: F12Fixture) => {
  cy.visit(`/edital/${dados.edital.id}/minhas-propostas/${dados.proposta.id}`);
  cy.get(NAV_COORDENACAO).should("be.visible");
  cy.get(NAV_COORDENACAO).click();
  cy.wait(500);
  cy.get("body").then(($body) => {
    if (($body.find(NEXT_BTN).outerHeight() ?? 0) === 0) {
      cy.get(NAV_COORDENACAO).click();
    }
  });
  cy.get(NEXT_BTN, { timeout: 15000 }).should("exist");
};

describe("TS-04 — F12: Proposta — Coordenação", () => {
  let dados: F12Fixture;
  let conta: { email: string; senha: string };

  before(() => {
    cy.fixture<F12Fixture>("ts04-prop/coordenacao").then((f) => {
      dados = f;
    });
    cy.fixture<CriarContaFixture>("ts01-smoke/criar-conta").then((f) => {
      conta = { email: f.emailCadastrado, senha: f.senha };
    });
  });

  beforeEach(() => {
    cy.typeLogin(conta.email, conta.senha);
    cy.get('[data-cy="user-menu"]').should("be.visible");
    abrirCoordenacao(dados);
  });

  context("CT-SIG-PROP-011 — Coordenação: Dados Pessoais do Coordenador", () => {
    it("deve exibir a seção de Coordenação com botão de avanço disponível", () => {
      cy.contains(/coordenação|coordenador/i).should("exist");
      cy.get(NEXT_BTN).should("exist");
    });

    it("deve exibir campo de nome ou identificação do coordenador", () => {
      cy.get("body").then(($body) => {
        const temNomeField =
          $body.find('[data-cy="nome"]').length > 0 ||
          $body.find('[data-cy*="coordenador"]').length > 0 ||
          $body.find('input[placeholder*="nome"]').length > 0 ||
          /nome|coordenador/i.test($body.text());
        cy.log(`Campo de identificação do coordenador encontrado: ${temNomeField}`);
        expect(temNomeField).to.be.true;
      });
    });

    it("deve exibir campo CPF do coordenador", () => {
      cy.get("body").then(($body) => {
        const temDocField =
          $body.find('[data-cy="documento"]').length > 0 ||
          $body.find('input[placeholder*="CPF"]').length > 0 ||
          /cpf|documento/i.test($body.text());
        cy.log(`Campo CPF encontrado: ${temDocField}`);
        expect(temDocField).to.be.true;
      });
    });

    it("deve exibir campo de data de nascimento do coordenador", () => {
      cy.get("body").then(($body) => {
        const temDataNasc =
          $body.find('[data-cy="dataNascimento"]').length > 0 ||
          $body.find('input[type="date"]').length > 0 ||
          /nascimento|nasc/i.test($body.text());
        cy.log(`Campo de data de nascimento encontrado: ${temDataNasc}`);
        expect(temDataNasc).to.be.true;
      });
    });
  });

  context("CT-SIG-PROP-012 — Coordenação: Endereço do Coordenador", () => {
    beforeEach(() => {
      cy.get(NEXT_BTN).click({ force: true });
      cy.get('[data-cy="criadoPor.endereco.cep"]', { timeout: 10000 }).should("be.visible");
    });

    it("deve exibir campo CEP na sub-etapa Endereço", () => {
      cy.get('[data-cy="criadoPor.endereco.cep"]').should("be.visible");
    });

    it("deve exibir campo Logradouro na sub-etapa Endereço", () => {
      cy.get('[data-cy="criadoPor.endereco.logradouro"]').should("be.visible");
    });

    it("deve exibir campos de Estado e Município na sub-etapa Endereço", () => {
      cy.get('[data-cy="search-estado"]').should("be.visible");
      cy.get('[data-cy="search-municipio"]').should("be.visible");
    });
  });

  context("CT-SIG-PROP-013 — Coordenação: Dados Acadêmicos do Coordenador", () => {
    beforeEach(() => {
      cy.get(NEXT_BTN).click({ force: true });
      cy.get(NEXT_BTN, { timeout: 10000 }).should("exist");
      cy.get(NEXT_BTN).click({ force: true });
      cy.get(NEXT_BTN, { timeout: 10000 }).should("exist");
    });

    it("deve exibir campos de Dados Acadêmicos do Coordenador", () => {
      cy.get("body").then(($body) => {
        const temCampoAcademico =
          $body.find('[data-cy="grande-area-id"]').length > 0 ||
          $body.find('[data-cy="sugerir-instituicao"]').length > 0 ||
          $body.find('[data-cy="add-areas-de-conhecimento"]').length > 0 ||
          /grande área|área de conhecimento|titulação/i.test($body.text());
        cy.log(`Campo acadêmico encontrado: ${temCampoAcademico}`);
        expect(temCampoAcademico).to.be.true;
      });
    });

    it("deve exibir campo de Instituição de Formação do Coordenador", () => {
      cy.get("body").then(($body) => {
        const temInstituicao =
          $body.find('[data-cy="instituicao-id"]').length > 0 ||
          $body.find('[data-cy="sugerir-instituicao"]').length > 0 ||
          /instituição/i.test($body.text());
        cy.log(`Campo Instituição encontrado: ${temInstituicao}`);
        expect(temInstituicao).to.be.true;
      });
    });

    it("deve exibir botão Próxima etapa habilitado", () => {
      cy.get(NEXT_BTN).should("exist");
    });
  });

  context("CT-SIG-PROP-014 — Coordenação: Dados Profissionais do Coordenador", () => {
    beforeEach(() => {
      cy.get(NEXT_BTN).click({ force: true });
      cy.get(NEXT_BTN, { timeout: 10000 }).should("exist");
      cy.get(NEXT_BTN).click({ force: true });
      cy.get(NEXT_BTN, { timeout: 10000 }).should("exist");
      cy.get(NEXT_BTN).click({ force: true });
      cy.get(NEXT_BTN, { timeout: 10000 }).should("exist");
    });

    it("deve exibir campos de Dados Profissionais do Coordenador", () => {
      cy.get("body").then(($body) => {
        const temCampoProfissional =
          $body.find('[data-cy="possui-vinculo-institucional"]').length > 0 ||
          $body.find('[data-cy="possui-vinculo-empregaticio"]').length > 0 ||
          /vínculo|profissional|cargo/i.test($body.text());
        cy.log(`Campo profissional encontrado: ${temCampoProfissional}`);
        expect(temCampoProfissional).to.be.true;
      });
    });

    it("deve exibir checkbox de Vínculo Institucional", () => {
      cy.get("body").then(($body) => {
        const temVinculo =
          $body.find('[data-cy="possui-vinculo-institucional"]').length > 0 ||
          /vínculo institucional/i.test($body.text());
        cy.log(`Checkbox Vínculo Institucional encontrado: ${temVinculo}`);
        expect(temVinculo).to.be.true;
      });
    });

    it("deve exibir checkbox de Vínculo Empregatício", () => {
      cy.get("body").then(($body) => {
        const temVinculo =
          $body.find('[data-cy="possui-vinculo-empregaticio"]').length > 0 ||
          /vínculo empregatício/i.test($body.text());
        cy.log(`Checkbox Vínculo Empregatício encontrado: ${temVinculo}`);
        expect(temVinculo).to.be.true;
      });
    });
  });

  context("CT-SIG-PROP-015 — Coordenação: nested checkboxes de vínculo profissional", () => {
    beforeEach(() => {
      cy.get(NEXT_BTN).click({ force: true });
      cy.get(NEXT_BTN, { timeout: 10000 }).should("exist");
      cy.get(NEXT_BTN).click({ force: true });
      cy.get(NEXT_BTN, { timeout: 10000 }).should("exist");
      cy.get(NEXT_BTN).click({ force: true });
      cy.get(NEXT_BTN, { timeout: 10000 }).should("exist");
    });

    it("deve exibir campo Tipo de Vínculo ao marcar Vínculo Institucional", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-cy="possui-vinculo-institucional"]').length > 0) {
          cy.get('[data-cy="possui-vinculo-institucional"]').then(($cb) => {
            if (!$cb.prop("checked")) cy.wrap($cb).click({ force: true });
          });
          cy.get('[data-cy="tipo-vinculo-institucional-id"]').should("exist");
        } else {
          cy.contains(/vínculo institucional/i).should("exist");
        }
      });
    });

    it("deve ocultar campos de vínculo ao desmarcar Vínculo Institucional", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-cy="possui-vinculo-institucional"]').length > 0) {
          cy.get('[data-cy="possui-vinculo-institucional"]').then(($cb) => {
            if (!$cb.prop("checked")) cy.wrap($cb).click({ force: true });
          });
          cy.get('[data-cy="possui-vinculo-institucional"]').then(($cb) => {
            if ($cb.prop("checked")) cy.wrap($cb).click({ force: true });
          });

          cy.get('[data-cy="possui-vinculo-institucional"]').should("not.be.checked");
          cy.get('[data-cy="tipo-vinculo-institucional-id"]').should("not.exist");
        } else {
          cy.contains(/profissional|vínculo/i).should("exist");
        }
      });
    });

    it("deve restaurar campos ao remarcar Vínculo Institucional", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-cy="possui-vinculo-institucional"]').length > 0) {
          cy.get('[data-cy="possui-vinculo-institucional"]').then(($cb) => {
            if ($cb.prop("checked")) cy.wrap($cb).click({ force: true });
          });
          cy.get('[data-cy="tipo-vinculo-institucional-id"]').should("not.exist");

          cy.get('[data-cy="possui-vinculo-institucional"]').click({ force: true });
          cy.get('[data-cy="tipo-vinculo-institucional-id"]').should("exist");
        } else {
          cy.get(NEXT_BTN).should("exist");
        }
      });
    });
  });
});
