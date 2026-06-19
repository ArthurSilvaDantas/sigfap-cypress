# Casos de Teste — Novo-SIG (SIGFAP)

**Projeto:** Verificação, Validação e Teste de Software 2026/1 — UFMS/FACOM  
**Sistema:** Novo-SIG (SIGFAP) — https://novo-sig.homolog.ledes.net/  
**Total de CTs:** 65  
**Técnicas:** Caixa Preta, Equivalência, Valor Limite, Grafo de Causa-Efeito, Data-Driven  

---

## Convenções

| Campo | Descrição |
|---|---|
| **ID** | CT-SIG-[MÓDULO]-[NNN] |
| **Módulos** | AUTH · PERF · EDIT · PROP · BLOC · PERS |
| **Prioridade** | Alta / Média / Baixa |
| **Técnica** | Técnica(s) de projeto utilizadas |
| **Rastreabilidade** | Seção do documento de Requisitos Novo-SIG |

**Credenciais de teste:**  
- Gestor: admin@sig.com / dev123  
- Proponente: teste.vvt.sigfap@gmail.com / Teste@2026  

---

## TS-01 — Autenticação (F-01, F-02)

---

### CT-SIG-AUTH-001 — Cadastro de conta: caminho feliz

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-01 — Criação de Conta |
| **Objetivo** | Verificar que um novo usuário consegue criar conta com dados válidos nos dois steps do cadastro. |
| **Prioridade** | Alta |
| **Pré-Condições** | Aplicação acessível. E-mail não cadastrado anteriormente no sistema. |
| **Dados de Entrada** | Nome: Ana Beatriz Silva · Data de Nascimento: 15/06/1995 · Sexo: Feminino · E-mail: ana.beatriz.vvt@sig.test · Senha: Teste@2026 · Confirmar Senha: Teste@2026 · Aceite de Termos: marcado |
| **Passos** | 1. Acessar /cadastro. 2. Preencher Nome, Data de Nascimento, Sexo, E-mail, Senha e Confirmação com dados válidos. 3. Clicar "Avançar". 4. Verificar exibição do Step 2 (Aceite de Termos). 5. Marcar checkbox "Li e aceitei os Termos de Uso". 6. Verificar que botão "Finalizar" está habilitado. 7. Clicar "Finalizar". |
| **Resultado Esperado** | Conta criada com sucesso. Sistema redireciona para login ou dashboard. Mensagem de confirmação exibida. |
| **Técnica** | Caixa Preta (Caminho Feliz) |
| **Rastreabilidade** | Módulo 2 — US-01 (Cadastro Inicial): Step 1 + Step 2 |

---

### CT-SIG-AUTH-002 — Senha não atende regras de complexidade

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-01 — Criação de Conta |
| **Objetivo** | Verificar que senhas que violam as regras de complexidade (mínimo 8 chars, 1 maiúscula, 1 especial, 1 número) são rejeitadas. |
| **Prioridade** | Alta |
| **Pré-Condições** | Aplicação acessível. |
| **Dados de Entrada** | Fixture `senhas-invalidas.json`: `["abc12!A", "abcdefgh1", "ABCDEFGH1", "Abcdefgh!"]` — respectivamente: 7 chars (min-1), sem maiúscula e sem especial, sem minúscula e sem especial, sem número. |
| **Passos** | Para cada senha do fixture: 1. Acessar /cadastro. 2. Preencher demais campos com dados válidos. 3. Preencher campo Senha com a senha do conjunto. 4. Clicar "Avançar". 5. Verificar mensagem de erro no campo Senha. |
| **Resultado Esperado** | Cada senha inválida exibe mensagem de erro de complexidade específica. Cadastro não avança para Step 2. |
| **Técnica** | Valor Limite (7 chars = min-1) + Equivalência (classes inválidas) + Data-Driven |
| **Rastreabilidade** | Módulo 2 — US-01: Senha 8–64 chars, mínimo 1 maiúscula, 1 especial, 1 número |

---

### CT-SIG-AUTH-003 — E-mail já cadastrado

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-01 — Criação de Conta |
| **Objetivo** | Verificar que o sistema rejeita tentativa de cadastro com e-mail já existente. |
| **Prioridade** | Alta |
| **Pré-Condições** | E-mail "teste.vvt.sigfap@gmail.com" já cadastrado no sistema. |
| **Dados de Entrada** | E-mail: teste.vvt.sigfap@gmail.com (já cadastrado) · Demais campos: válidos. |
| **Passos** | 1. Acessar /cadastro. 2. Preencher todos os campos do Step 1 com dados válidos, usando o e-mail já existente. 3. Clicar "Avançar". 4. Verificar resposta do sistema. |
| **Resultado Esperado** | Sistema exibe mensagem de erro informando que o e-mail já está em uso. Cadastro não prossegue. |
| **Técnica** | Equivalência (classe inválida — e-mail duplicado) |
| **Rastreabilidade** | Módulo 2 — US-01 (Cadastro Inicial): unicidade de e-mail |

---

### CT-SIG-AUTH-004 — Confirmação de senha divergente

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-01 — Criação de Conta |
| **Objetivo** | Verificar que o sistema rejeita cadastro quando "Confirmar Senha" não corresponde à "Senha". |
| **Prioridade** | Alta |
| **Pré-Condições** | Aplicação acessível. |
| **Dados de Entrada** | Senha: Teste@2026 · Confirmar Senha: Teste@2027 |
| **Passos** | 1. Acessar /cadastro. 2. Preencher demais campos com dados válidos. 3. Preencher Senha: "Teste@2026" e Confirmar Senha: "Teste@2027". 4. Clicar "Avançar". 5. Verificar mensagem de erro. |
| **Resultado Esperado** | Sistema exibe erro indicando que as senhas não coincidem. Step 2 não é exibido. |
| **Técnica** | Equivalência (classe inválida — senhas divergentes) |
| **Rastreabilidade** | Módulo 2 — US-01: Confirmar Senha deve ser idêntica à Senha |

---

### CT-SIG-AUTH-005 — Login com credenciais válidas

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-02 — Login |
| **Objetivo** | Verificar que usuário cadastrado consegue autenticar-se com credenciais corretas. |
| **Prioridade** | Alta |
| **Pré-Condições** | Usuário "teste.vvt.sigfap@gmail.com" / "Teste@2026" cadastrado e ativo. |
| **Dados de Entrada** | E-mail: teste.vvt.sigfap@gmail.com · Senha: Teste@2026 |
| **Passos** | 1. Acessar /login. 2. Preencher E-mail e Senha com credenciais válidas. 3. Clicar "Entrar". 4. Verificar redirecionamento. |
| **Resultado Esperado** | Usuário autenticado e redirecionado para a Home/Dashboard. Sessão persistida. |
| **Técnica** | Caixa Preta (Caminho Feliz) |
| **Rastreabilidade** | F-02 — Login |

---

### CT-SIG-AUTH-006 — Login com credenciais inválidas

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-02 — Login |
| **Objetivo** | Verificar que credenciais inválidas resultam em mensagem de erro sem revelar qual campo está incorreto. |
| **Prioridade** | Alta |
| **Pré-Condições** | Aplicação acessível. |
| **Dados de Entrada** | Fixture `credenciais-invalidas.json`: `[{"email":"naoexiste@sig.test","senha":"Teste@2026"}, {"email":"teste.vvt.sigfap@gmail.com","senha":"SenhaErrada1!"}, {"email":"emailinvalido","senha":"Teste@2026"}]` |
| **Passos** | Para cada credencial do fixture: 1. Acessar /login. 2. Preencher E-mail e Senha. 3. Clicar "Entrar". 4. Verificar mensagem de erro. |
| **Resultado Esperado** | Todas as combinações inválidas exibem mensagem de erro genérica (sem indicar qual campo está errado). Usuário permanece na tela de login. |
| **Técnica** | Equivalência (classe inválida) + Data-Driven |
| **Rastreabilidade** | F-02 — Login |

---

### CT-SIG-AUTH-007 — Login com campos vazios

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-02 — Login |
| **Objetivo** | Verificar validação de campos obrigatórios no formulário de login. |
| **Prioridade** | Média |
| **Pré-Condições** | Aplicação acessível. |
| **Dados de Entrada** | E-mail: (vazio) · Senha: (vazio) |
| **Passos** | 1. Acessar /login. 2. Deixar ambos os campos vazios. 3. Clicar "Entrar". 4. Verificar mensagens de validação. |
| **Resultado Esperado** | Sistema exibe mensagens de campo obrigatório para E-mail e Senha. Login não é processado. |
| **Técnica** | Equivalência (classe inválida — campos vazios) |
| **Rastreabilidade** | F-02 — Login |

---

### CT-SIG-AUTH-008 — Aceite de Termos obrigatório no cadastro

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-01 — Criação de Conta |
| **Objetivo** | Verificar que "Finalizar" permanece desabilitado sem aceite dos termos e que "Não aceito" redireciona para login sem criar conta. |
| **Prioridade** | Alta |
| **Pré-Condições** | Step 1 do cadastro preenchido com dados válidos. Step 2 (Aceite de Termos) visível. |
| **Dados de Entrada** | Checkbox "Li e aceitei os Termos de Uso": desmarcado |
| **Passos** | 1. Completar Step 1 com dados válidos e avançar. 2. No Step 2, verificar que botão "Finalizar" está desabilitado (atributo disabled). 3. Clicar "Não aceito". 4. Verificar redirecionamento. |
| **Resultado Esperado** | "Finalizar" desabilitado enquanto checkbox desmarcado. "Não aceito" redireciona para tela de login sem criar conta. |
| **Técnica** | Grafo de Causa-Efeito — Causa: checkbox=OFF → Efeito: Finalizar bloqueado |
| **Rastreabilidade** | Módulo 2 — US-01 Step 2: Aceite de Termos |

---

## TS-02 — Perfil do Usuário (F-03 a F-07)

> **Pré-condição global do TS-02:** Usuário autenticado via `cy.session()` antes de cada CT.

---

### CT-SIG-PERF-001 — Dados Pessoais: preenchimento válido

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-03 — Perfil (Dados Pessoais) |
| **Objetivo** | Verificar que o usuário consegue salvar Dados Pessoais com campos obrigatórios e opcionais corretos. |
| **Prioridade** | Média |
| **Pré-Condições** | Usuário autenticado. |
| **Dados de Entrada** | Nome: Ana Beatriz Silva · Nome Social: (vazio) · Data de Nascimento: 15/06/1995 · Raça/Cor: Branco(a) · País: Brasil · CPF: 529.982.247-25 |
| **Passos** | 1. Navegar para Perfil → Dados Pessoais. 2. Verificar que campo E-mail está em modo somente-leitura. 3. Preencher Nome e Data de Nascimento. 4. Selecionar Raça/Cor: Branco(a). 5. Selecionar País: Brasil. 6. Verificar que campo CPF aparece. 7. Preencher CPF válido. 8. Clicar "Salvar". |
| **Resultado Esperado** | Dados salvos com sucesso. Mensagem de confirmação exibida. Campo E-mail inalterado. |
| **Técnica** | Caixa Preta (Caminho Feliz) |
| **Rastreabilidade** | Módulo 2 — US-03 (Dados Pessoais): Nome (64, req), Data Nasc, Raça/Cor (opt), País (req), CPF (req se Brasil) |

---

### CT-SIG-PERF-002 — Nome acima do limite máximo de caracteres

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-03 — Perfil (Dados Pessoais) |
| **Objetivo** | Verificar comportamento do campo Nome nos limites máximos definidos (64 chars = válido, 65 chars = inválido). |
| **Prioridade** | Média |
| **Pré-Condições** | Usuário autenticado. |
| **Dados de Entrada** | Nome com 64 chars (máximo): `"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"` · Nome com 65 chars (max+1): `"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"` · Nome vazio: `""` |
| **Passos** | 1. Navegar para Dados Pessoais. 2. Preencher Nome com 64 chars → verificar aceito. 3. Preencher Nome com 65 chars → verificar comportamento (truncado ou erro). 4. Preencher Nome vazio → tentar salvar → verificar erro de obrigatório. |
| **Resultado Esperado** | 64 chars: aceito. 65 chars: truncado ou erro de limite exibido. Vazio: erro de campo obrigatório. |
| **Técnica** | Valor Limite (max=64, max+1=65) + Equivalência (vazio = classe inválida) |
| **Rastreabilidade** | Módulo 2 — US-03: Nome Completo max 64 chars, obrigatório |

---

### CT-SIG-PERF-003 — Data de nascimento inválida (futura)

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-03 — Perfil (Dados Pessoais) |
| **Objetivo** | Verificar que o sistema rejeita data de nascimento com valor futuro. |
| **Prioridade** | Média |
| **Pré-Condições** | Usuário autenticado. |
| **Dados de Entrada** | Data de Nascimento: 31/12/2099 |
| **Passos** | 1. Navegar para Dados Pessoais. 2. Preencher Data de Nascimento com data futura: 31/12/2099. 3. Clicar "Salvar". 4. Verificar mensagem de validação. |
| **Resultado Esperado** | Sistema exibe erro informando que data de nascimento não pode ser futura. Dados não salvos. |
| **Técnica** | Valor Limite (data atual = max, data futura = max+1) |
| **Rastreabilidade** | Módulo 2 — US-03: Data de Nascimento no formato DD/MM/AAAA |

---

### CT-SIG-PERF-004 — Endereço: CEP válido aciona autopreenchimento

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-04 — Perfil (Endereço) |
| **Objetivo** | Verificar que ao informar CEP válido os campos Logradouro, Bairro, Estado e Município são preenchidos automaticamente. |
| **Prioridade** | Média |
| **Pré-Condições** | Usuário autenticado. País = Brasil definido em Dados Pessoais. |
| **Dados de Entrada** | CEP: 79002-170 · Número: 123 · Complemento: Sala 1 (opcional) |
| **Passos** | 1. Navegar para Perfil → Endereço. 2. Digitar CEP: 79002-170. 3. Aguardar autopreenchimento. 4. Verificar campos Logradouro, Bairro, Estado e Município preenchidos. 5. Preencher Número: 123. 6. Preencher Complemento: Sala 1. 7. Clicar "Salvar". |
| **Resultado Esperado** | Logradouro, Bairro, Estado e Município preenchidos automaticamente e em modo somente-leitura. Número e Complemento editáveis. Dados salvos com sucesso. |
| **Técnica** | Caixa Preta (Caminho Feliz) |
| **Rastreabilidade** | Módulo 2 — US-04 (Endereço): CEP xxxxx-xxx → autopreenchimento |

---

### CT-SIG-PERF-005 — Endereço: CEP inválido ou inexistente

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-04 — Perfil (Endereço) |
| **Objetivo** | Verificar que CEPs com formato inválido ou sem correspondência exibem erro adequado. |
| **Prioridade** | Média |
| **Pré-Condições** | Usuário autenticado. |
| **Dados de Entrada** | Fixture `ceps-invalidos.json`: `["00000-000", "abcde-fgh", "790021700"]` — respectivamente: CEP inexistente, formato não numérico, sem hífen. |
| **Passos** | Para cada CEP do fixture: 1. Navegar para Endereço. 2. Digitar o CEP. 3. Aguardar resposta do sistema. 4. Verificar mensagem de erro. 5. Verificar que campos de endereço permanecem vazios. |
| **Resultado Esperado** | Cada CEP inválido ou inexistente exibe mensagem de erro específica. Campos de endereço não são preenchidos. |
| **Técnica** | Equivalência (classe inválida) + Data-Driven |
| **Rastreabilidade** | Módulo 2 — US-04: CEP no formato xxxxx-xxx, obrigatório |

---

### CT-SIG-PERF-006 — Dados Acadêmicos: preenchimento válido

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-05 — Perfil (Dados Acadêmicos) |
| **Objetivo** | Verificar que o usuário consegue salvar Dados Acadêmicos incluindo o campo obrigatório Grande Área. |
| **Prioridade** | Média |
| **Pré-Condições** | Usuário autenticado. |
| **Dados de Entrada** | Instituição: UFMS · Nível Acadêmico: Doutorado · Currículo Lattes: http://lattes.cnpq.br/0000000000000000 · Grande Área: Ciências Exatas e da Terra · Área: Ciência da Computação (opcional) |
| **Passos** | 1. Navegar para Perfil → Dados Acadêmicos. 2. Selecionar Instituição: UFMS. 3. Selecionar Nível Acadêmico: Doutorado. 4. Preencher campo Lattes. 5. Clicar "Adicionar Área de Conhecimento". 6. Selecionar Grande Área: Ciências Exatas e da Terra. 7. Selecionar Área: Ciência da Computação (opcional). 8. Confirmar adição. 9. Clicar "Salvar". |
| **Resultado Esperado** | Dados salvos com sucesso. Área de Conhecimento exibida na listagem com Grande Área e Área. |
| **Técnica** | Caixa Preta (Caminho Feliz) |
| **Rastreabilidade** | Módulo 2 — US-05 (Dados Acadêmicos): Instituição (opt), Nível Acadêmico (opt), Lattes (opt), Grande Área (obrigatória no bloco Área de Conhecimento) |

---

### CT-SIG-PERF-007 — Dados Profissionais: vínculo institucional e empregatício

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-06 — Perfil (Dados Profissionais) |
| **Objetivo** | Verificar que usuário com vínculo institucional e empregatício consegue salvar todos os campos profissionais, com Tempo calculado automaticamente. |
| **Prioridade** | Média |
| **Pré-Condições** | Usuário autenticado. |
| **Dados de Entrada** | Vínculo Institucional: marcado · Tipo de Vínculo: Servidor Público · Vínculo Empregatício: marcado · Início do Serviço: 01/03/2015 · Regime de Trabalho: Dedicação Exclusiva · Função/Cargo Atual: Analista de Sistemas · Início da Função: 01/07/2018 |
| **Passos** | 1. Navegar para Perfil → Dados Profissionais. 2. Marcar "Possui Vínculo Institucional". 3. Selecionar Tipo de Vínculo: Servidor Público. 4. Marcar "Possui Vínculo Empregatício". 5. Preencher Início do Serviço: 01/03/2015. 6. Verificar que campo "Tempo no Serviço" é calculado automaticamente e está bloqueado. 7. Selecionar Regime de Trabalho: Dedicação Exclusiva. 8. Preencher Função/Cargo: Analista de Sistemas. 9. Preencher Início da Função: 01/07/2018. 10. Verificar "Tempo na Função" calculado e bloqueado. 11. Clicar "Salvar". |
| **Resultado Esperado** | Dados salvos. Tempo no Serviço e Tempo na Função calculados automaticamente e somente-leitura. |
| **Técnica** | Caixa Preta (Caminho Feliz) |
| **Rastreabilidade** | Módulo 2 — US-06 (Dados Profissionais) |

---

### CT-SIG-PERF-008 — Documentos Pessoais: upload de arquivo válido

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-07 — Perfil (Documentos Pessoais) |
| **Objetivo** | Verificar que o fluxo de selecionar tipo de documento e fazer upload de arquivo válido funciona corretamente. |
| **Prioridade** | Média |
| **Pré-Condições** | Usuário autenticado. Arquivo `documento-valido.pdf` com tamanho < 3MB disponível em fixtures. |
| **Dados de Entrada** | Tipo de Documento: Identidade (ou tipo disponível no sistema) · Arquivo: documento-valido.pdf (< 3MB, PDF) |
| **Passos** | 1. Navegar para Perfil → Documentos Pessoais. 2. Selecionar tipo de documento no select-filter. 3. Verificar que área de upload aparece após seleção. 4. Fazer upload do arquivo `documento-valido.pdf`. 5. Verificar prévia ou nome do arquivo carregado. 6. Clicar "Salvar". |
| **Resultado Esperado** | Upload aceito. Documento listado associado ao tipo selecionado. |
| **Técnica** | Caixa Preta (Caminho Feliz) |
| **Rastreabilidade** | Módulo 2 — US-07 (Documentos Pessoais): select de tipo antes do upload, max 3MB |

---

### CT-SIG-PERF-009 — Documentos Pessoais: upload de tipo de arquivo inválido

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-07 — Perfil (Documentos Pessoais) |
| **Objetivo** | Verificar que arquivos em formatos não aceitos são rejeitados com mensagem de erro. |
| **Prioridade** | Média |
| **Pré-Condições** | Usuário autenticado. Tipo de documento selecionado. |
| **Dados de Entrada** | Fixture `tipos-invalidos.json`: arquivos com extensão `.exe`, `.txt`, `.zip` |
| **Passos** | 1. Navegar para Documentos Pessoais. 2. Selecionar tipo de documento. 3. Para cada arquivo inválido do fixture: tentar fazer upload. 4. Verificar mensagem de erro. |
| **Resultado Esperado** | Cada arquivo com formato inválido exibe mensagem de formato não suportado. Upload não é concluído. |
| **Técnica** | Equivalência (classe inválida) + Data-Driven |
| **Rastreabilidade** | Módulo 2 — US-07: formato do arquivo conforme tipo de documento |

---

### CT-SIG-PERF-010 — Dados Acadêmicos: Grande Área obrigatória bloqueia salvar

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-05 — Perfil (Dados Acadêmicos) |
| **Objetivo** | Verificar que não é possível adicionar Área de Conhecimento sem selecionar a Grande Área obrigatória. |
| **Prioridade** | Média |
| **Pré-Condições** | Usuário autenticado. Dialog "Adicionar Área de Conhecimento" aberto. |
| **Dados de Entrada** | Grande Área: (não selecionada) · Área: Ciência da Computação |
| **Passos** | 1. Navegar para Dados Acadêmicos. 2. Clicar "Adicionar Área de Conhecimento". 3. Deixar Grande Área sem seleção. 4. Tentar selecionar Área diretamente ou confirmar. 5. Verificar mensagem de validação. |
| **Resultado Esperado** | Sistema exibe erro de campo obrigatório para Grande Área. Área de Conhecimento não é adicionada. |
| **Técnica** | Grafo de Causa-Efeito — Causa: Grande Área = vazio → Efeito: confirmar bloqueado |
| **Rastreabilidade** | Módulo 2 — US-05: Grande Área obrigatória no bloco Área de Conhecimento |

---

### CT-SIG-PERF-011 — Dados Pessoais: CPF com dígito verificador inválido

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-03 — Perfil (Dados Pessoais) |
| **Objetivo** | Verificar que CPFs matematicamente inválidos são rejeitados pelo sistema. |
| **Prioridade** | Alta |
| **Pré-Condições** | Usuário autenticado. País = Brasil selecionado em Dados Pessoais. |
| **Dados de Entrada** | Fixture `cpfs-invalidos.json`: `["111.111.111-11", "000.000.000-00", "123.456.789-00", "999.999.999-99"]` |
| **Passos** | Para cada CPF do fixture: 1. Navegar para Dados Pessoais. 2. Garantir País = Brasil selecionado. 3. Preencher campo CPF com o valor do fixture. 4. Clicar "Salvar". 5. Verificar mensagem de erro. |
| **Resultado Esperado** | Cada CPF com dígito verificador inválido exibe mensagem de erro de validação. Dados não são salvos. |
| **Técnica** | Equivalência (classe inválida) + Data-Driven |
| **Rastreabilidade** | Módulo 2 — US-03: CPF no formato xxx.xxx.xxx-xx, validado por dígito verificador |

---

### CT-SIG-PERF-012 — Dados Pessoais: País → CPF condicional

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-03 — Perfil (Dados Pessoais) |
| **Objetivo** | Verificar que o campo CPF aparece somente quando País = Brasil é selecionado. |
| **Prioridade** | Média |
| **Pré-Condições** | Usuário autenticado. Dados Pessoais acessível. |
| **Dados de Entrada** | Iteração 1: País = Brasil · Iteração 2: País = Argentina |
| **Passos** | 1. Navegar para Dados Pessoais. 2. Selecionar País = Brasil. 3. Verificar que campo CPF é exibido e obrigatório. 4. Alterar País para Argentina. 5. Verificar que campo CPF não é exibido. |
| **Resultado Esperado** | País = Brasil: campo CPF visível e obrigatório. País ≠ Brasil: campo CPF oculto. |
| **Técnica** | Grafo de Causa-Efeito — Causa: País = Brasil → Efeito: CPF visível/obrigatório |
| **Rastreabilidade** | Módulo 2 — US-03: País → CPF condicional |

---

### CT-SIG-PERF-013 — Dados Acadêmicos: toggle Sugerir Instituição

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-05 — Perfil (Dados Acadêmicos) |
| **Objetivo** | Verificar que marcar "Sugerir Instituição" substitui o select por campos de texto livres para Nome e Sigla. |
| **Prioridade** | Média |
| **Pré-Condições** | Usuário autenticado. Dados Acadêmicos acessível. |
| **Dados de Entrada** | Sugerir Instituição: marcado · Nome da Instituição: "UFMS Pantanal" · Sigla: "UFMSP" |
| **Passos** | 1. Navegar para Dados Acadêmicos. 2. Verificar que select "Instituição" está visível. 3. Marcar checkbox "Sugerir Instituição". 4. Verificar que select "Instituição" foi ocultado. 5. Verificar que campos "Nome Instituição" e "Sigla" aparecem. 6. Preencher Nome: "UFMS Pantanal" e Sigla: "UFMSP". 7. Clicar "Salvar". |
| **Resultado Esperado** | Após marcar checkbox: select oculto, campos livres visíveis. Dados salvos com sucesso. |
| **Técnica** | Grafo de Causa-Efeito — Causa: Sugerir Instituição = ON → Efeito: select oculto, campos livres visíveis |
| **Rastreabilidade** | Módulo 2 — US-05: Sugerir Instituição checkbox |

---

### CT-SIG-PERF-014 — Dados Profissionais: nested checkboxes de vínculo

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-06 — Perfil (Dados Profissionais) |
| **Objetivo** | Verificar que os campos de Vínculo Empregatício só ficam visíveis quando ambos os checkboxes "Possui Vínculo Institucional" e "Possui Vínculo Empregatício" estão marcados. |
| **Prioridade** | Média |
| **Pré-Condições** | Usuário autenticado. Dados Profissionais acessível. Ambos os checkboxes desmarcados (estado inicial). |
| **Dados de Entrada** | Cenário 1: apenas Vínculo Institucional marcado · Cenário 2: ambos marcados · Cenário 3: desmarcar Vínculo Empregatício |
| **Passos** | 1. Verificar que campos de emprego estão ocultos (estado inicial). 2. Marcar "Possui Vínculo Institucional". 3. Verificar que Tipo de Vínculo aparece mas campos de emprego ainda ocultos. 4. Marcar "Possui Vínculo Empregatício". 5. Verificar que campos Início do Serviço, Regime de Trabalho, Função/Cargo e Início da Função aparecem. 6. Desmarcar "Possui Vínculo Empregatício". 7. Verificar que campos de emprego somem. |
| **Resultado Esperado** | Campos de emprego visíveis apenas com AMBOS os checkboxes marcados. Ocultos quando qualquer um é desmarcado. |
| **Técnica** | Grafo de Causa-Efeito (2 níveis — nested): Causa-1: Vínculo Institucional=ON + Causa-2: Vínculo Empregatício=ON → Efeito: campos emprego visíveis |
| **Rastreabilidade** | Módulo 2 — US-06 (Dados Profissionais): nested checkbox Vínculo Institucional → Vínculo Empregatício |

---

## TS-03 — Editais (F-08, F-09)

> **Pré-condição global do TS-03:** Usuário autenticado via `cy.session()`. Ao menos um edital ativo cadastrado pelo Gestor.

---

### CT-SIG-EDIT-001 — Listagem de editais disponíveis

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-08 — Listagem do Edital |
| **Objetivo** | Verificar que a página de listagem exibe editais ativos ordenados por data de criação (mais recente primeiro). |
| **Prioridade** | Alta |
| **Pré-Condições** | Usuário autenticado. Ao menos um edital com status "Ativo" cadastrado. |
| **Dados de Entrada** | N/A |
| **Passos** | 1. Acessar Home. 2. Clicar em "Editais" no menu de navegação. 3. Verificar que página de listagem é exibida. 4. Verificar presença de editais com status "Ativo". 5. Verificar que colunas "Nome do Edital" e "Ações" estão visíveis. 6. Verificar ordenação por data de criação decrescente. |
| **Resultado Esperado** | Listagem exibe editais ativos. Colunas corretas visíveis. Ordenação por criação mais recente primeiro. |
| **Técnica** | Caixa Preta |
| **Rastreabilidade** | Módulo 6 — US-07 (Gerenciar Editais): tabela com Nome + Ações, ordenação por data de criação |

---

### CT-SIG-EDIT-002 — Detalhe do edital com botão "Criar Proposta"

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-09 — Detalhe do Edital |
| **Objetivo** | Verificar que a tela de detalhe de edital vigente exibe as informações do edital e o botão "Criar Proposta" habilitado. |
| **Prioridade** | Alta |
| **Pré-Condições** | Usuário autenticado. Edital vigente (dentro do prazo) cadastrado. |
| **Dados de Entrada** | N/A |
| **Passos** | 1. Acessar listagem de editais. 2. Clicar em um edital vigente. 3. Verificar que tela de detalhe é exibida. 4. Verificar informações do edital visíveis. 5. Verificar presença e estado do botão "Criar Proposta". |
| **Resultado Esperado** | Tela de detalhe exibida com informações do edital. Botão "Criar Proposta" visível e habilitado. |
| **Técnica** | Caixa Preta |
| **Rastreabilidade** | Módulo 7 — US-01: botão "Criar Proposta" disponível em editais vigentes |

---

### CT-SIG-EDIT-003 — Edital fora do prazo: "Criar Proposta" desabilitado

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-09 — Detalhe do Edital |
| **Objetivo** | Verificar que o botão "Criar Proposta" está ausente ou desabilitado quando o edital está fora do prazo de submissão. |
| **Prioridade** | Alta |
| **Pré-Condições** | Usuário autenticado. Edital com prazo de submissão encerrado disponível no ambiente. |
| **Dados de Entrada** | N/A |
| **Passos** | 1. Acessar listagem de editais. 2. Clicar em edital fora do prazo de submissão. 3. Verificar tela de detalhe do edital. 4. Verificar estado do botão "Criar Proposta". |
| **Resultado Esperado** | Botão "Criar Proposta" ausente ou desabilitado. Sistema pode exibir mensagem indicando que o prazo de submissão encerrou. |
| **Técnica** | Grafo de Causa-Efeito — Causa: edital fora do prazo → Efeito: botão "Criar Proposta" bloqueado |
| **Rastreabilidade** | Módulo 7 — US-01: "Criar Proposta" disponível apenas dentro do prazo do edital |

---

## TS-04 — Propostas (F-10 a F-16)

> **Pré-condição global do TS-04:** Usuário autenticado como proponente via `cy.session()`. Edital "Edital 2026-0001 Sig Cypress" vigente disponível no ambiente de homologação. Proposta em andamento acessível via card na Home.

---

### Caracterização — Informações Iniciais

---

### CT-SIG-PROP-001 — Iniciar criação de proposta

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-10 — Criação de Proposta |
| **Objetivo** | Verificar que o fluxo Home → Editais → Detalhe → "Criar Proposta" inicia o formulário e preenche automaticamente o campo "Título do edital". |
| **Prioridade** | Alta |
| **Pré-Condições** | Usuário autenticado. Edital "Edital 2026-0001 Sig Cypress" vigente disponível. |
| **Dados de Entrada** | N/A |
| **Passos** | 1. Acessar Home. 2. Navegar para Editais. 3. Clicar no "Edital 2026-0001 Sig Cypress". 4. Clicar no botão "Criar Proposta". 5. Verificar que o formulário é iniciado no substep "Informações iniciais". 6. Verificar que campo "Título do edital" está preenchido com "Edital 2026-0001 Sig Cypress" e em modo somente-leitura. |
| **Resultado Esperado** | Formulário iniciado no substep "Informações iniciais". Campo "Título do edital" preenchido automaticamente e bloqueado para edição. |
| **Técnica** | Caixa Preta (Caminho Feliz) |
| **Rastreabilidade** | Módulo 7 — US-01 (7.1 Criar Proposta) |

---

### CT-SIG-PROP-002 — Informações Iniciais: caminho feliz

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-11 — Proposta Caracterização |
| **Objetivo** | Verificar que todos os campos do substep "Informações iniciais" aceitam dados válidos e permitem avançar para o próximo substep. |
| **Prioridade** | Alta |
| **Pré-Condições** | Proposta iniciada a partir do "Edital 2026-0001 Sig Cypress". Substep "Informações iniciais" visível. |
| **Dados de Entrada** | Título do projeto: "Sistemas de Monitoramento para Energias Renováveis" · Tipo de evento: Congresso Nacional · Estado de execução do evento: Mato Grosso do Sul · Município de execução do evento: Campo Grande · Duração do projeto em meses: 12 · Instituição executora: Universidade Federal do Mato Grosso do Sul/UFMS · Unidade executora: Faculdade de Computação/FACOM · Áreas de conhecimento: Grande Área = Ciências Exatas e da Terra |
| **Passos** | 1. Verificar que "Título do edital" exibe "Edital 2026-0001 Sig Cypress" em modo somente-leitura. 2. Preencher "Título do projeto". 3. Selecionar "Tipo de evento". 4. Selecionar "Estado de execução do evento". 5. Selecionar "Município de execução do evento". 6. Preencher "Duração do projeto em meses": 12. 7. Selecionar "Instituição executora": UFMS. 8. Selecionar "Unidade executora": FACOM. 9. Clicar "Adicionar" em "Áreas de conhecimento" e selecionar Grande Área. 10. Clicar "Próxima etapa". |
| **Resultado Esperado** | Todos os campos aceitos com dados válidos. Sistema avança para substep "Informações complementares". |
| **Técnica** | Caixa Preta (Caminho Feliz) |
| **Rastreabilidade** | Módulo 7 — US-02 (7.1.1.1 Informações Iniciais) |

---

### CT-SIG-PROP-003 — Informações Iniciais: campos obrigatórios vazios bloqueiam avanço

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-11 — Proposta Caracterização |
| **Objetivo** | Verificar que cada campo obrigatório das Informações Iniciais, quando vazio, impede o avanço e exibe mensagem de validação. |
| **Prioridade** | Alta |
| **Pré-Condições** | Substep "Informações iniciais" visível. |
| **Dados de Entrada** | Fixture `info-iniciais-invalidas.json`: `[{"campo":"Título do projeto","valor":""}, {"campo":"Duração do projeto em meses","valor":""}, {"campo":"Instituição executora","valor":null}]` |
| **Passos** | Para cada cenário do fixture: 1. Navegar para "Informações iniciais". 2. Preencher todos os campos obrigatórios com dados válidos, exceto o campo especificado no cenário. 3. Clicar "Próxima etapa". 4. Verificar mensagem de erro no campo em questão. 5. Verificar que o sistema permanece no substep atual. |
| **Resultado Esperado** | Cada campo obrigatório vazio gera mensagem de validação específica. Avanço para "Informações complementares" bloqueado enquanto há campos obrigatórios não preenchidos. |
| **Técnica** | Equivalência (classe inválida — campo vazio) + Data-Driven |
| **Rastreabilidade** | Módulo 7 — US-02: Título do projeto (req), Duração (req), Instituição executora (req) |

---

### CT-SIG-PROP-004 — Informações Iniciais: limite de caracteres do Título do Projeto

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-11 — Proposta Caracterização |
| **Objetivo** | Verificar o comportamento do campo "Título do projeto" nos pontos de fronteira do limite de 128 caracteres. |
| **Prioridade** | Média |
| **Pré-Condições** | Substep "Informações iniciais" visível. |
| **Dados de Entrada** | Fixture `titulo-limites.json`: `[{"chars":128,"esperado":"aceito"}, {"chars":129,"esperado":"truncado ou erro"}]` |
| **Passos** | 1. Navegar para "Informações iniciais". 2. Preencher "Título do projeto" com string de 128 caracteres. 3. Verificar que o valor é aceito (aceito = max válido). 4. Limpar o campo. 5. Preencher com string de 129 caracteres. 6. Verificar comportamento (campo trunca a entrada ou exibe mensagem de erro de limite). |
| **Resultado Esperado** | 128 chars (max): aceito normalmente. 129 chars (max+1): entrada truncada no campo ou mensagem de limite exibida. |
| **Técnica** | Valor Limite (max=128, max+1=129) + Data-Driven |
| **Rastreabilidade** | Módulo 7 — US-02: Título do Projeto max 128 chars |

---

### CT-SIG-PROP-005 — Informações Iniciais: limites de Duração do Projeto

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-11 — Proposta Caracterização |
| **Objetivo** | Verificar o comportamento do campo "Duração do projeto em meses" nos quatro pontos de fronteira do intervalo válido [1, 12]. |
| **Prioridade** | Alta |
| **Pré-Condições** | Substep "Informações iniciais" visível. Edital "Edital 2026-0001 Sig Cypress" com duração máxima de 12 meses. |
| **Dados de Entrada** | Fixture `duracao-limites.json`: `[{"meses":0,"esperado":"inválido (min-1)"}, {"meses":1,"esperado":"válido (min)"}, {"meses":12,"esperado":"válido (max)"}, {"meses":13,"esperado":"inválido (max+1)"}]` |
| **Passos** | Para cada valor do fixture: 1. Navegar para "Informações iniciais". 2. Preencher "Título do projeto" e demais campos obrigatórios com dados válidos. 3. Preencher "Duração do projeto em meses" com o valor especificado. 4. Clicar "Próxima etapa". 5. Verificar resultado conforme esperado. |
| **Resultado Esperado** | 0 meses: mensagem de erro (mínimo é 1). 1 mês: aceito. 12 meses: aceito. 13 meses: mensagem de erro (excede o máximo do edital). |
| **Técnica** | Valor Limite (min=1, min-1=0, max=12, max+1=13) + Data-Driven |
| **Rastreabilidade** | Módulo 7 — US-02: Duração mínima 1 mês, duração máxima = limite definido no edital |

---

### CT-SIG-PROP-006 — Informações Iniciais: Unidade Executora condicional por Instituição

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-11 — Proposta Caracterização |
| **Objetivo** | Verificar que o campo "Unidade executora" aparece somente quando a Instituição Executora selecionada possui unidades cadastradas no sistema. |
| **Prioridade** | Média |
| **Pré-Condições** | Substep "Informações iniciais" visível. UFMS possui unidades cadastradas (FACOM, ESAN etc.). |
| **Dados de Entrada** | Cenário 1: Instituição executora = UFMS (com unidades) · Cenário 2: Instituição executora = instituição sem unidades cadastradas |
| **Passos** | 1. Navegar para "Informações iniciais". 2. Selecionar "Instituição executora" = UFMS. 3. Verificar que campo "Unidade executora" aparece com opções disponíveis (FACOM, ESAN etc.). 4. Alterar "Instituição executora" para uma que não possui unidades. 5. Verificar que campo "Unidade executora" fica oculto ou sem opções. |
| **Resultado Esperado** | Instituição com unidades (UFMS): campo "Unidade executora" visível e populado. Instituição sem unidades: campo "Unidade executora" ausente ou vazio. |
| **Técnica** | Grafo de Causa-Efeito — Causa: Instituição com unidades cadastradas → Efeito: "Unidade executora" visível |
| **Rastreabilidade** | Módulo 7 — US-02: Unidade executora depende de unidades da instituição selecionada |

---

### Caracterização — Informações Complementares

---

### CT-SIG-PROP-007 — Informações Complementares: caminho feliz

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-11 — Proposta Caracterização |
| **Objetivo** | Verificar que as duas perguntas obrigatórias do "Edital 2026-0001 Sig Cypress" em "Informações complementares" são exibidas com os tipos corretos e aceitam respostas válidas. |
| **Prioridade** | Alta |
| **Pré-Condições** | Proposta em andamento. Substep "Informações complementares" visível. |
| **Dados de Entrada** | Pergunta 1 (rádio — porte da empresa): selecionar "Micro - Faturamento (ano) de R$ 81.000,01 até R$ 360.000,00" · Pergunta 2 (texto, 10–20 chars): "Texto valido" (12 chars) |
| **Passos** | 1. Navegar para "Informações complementares". 2. Verificar que Pergunta 1 é do tipo rádio com opções: Grande, Média, MEI, Micro, Pequena, Startup. 3. Selecionar "Micro - Faturamento (ano) de R$ 81.000,01 até R$ 360.000,00". 4. Verificar que Pergunta 2 é campo de texto com contador "0/20". 5. Preencher Pergunta 2 com "Texto valido" (12 chars). 6. Clicar "Próxima etapa". |
| **Resultado Esperado** | Ambas as perguntas exibidas com seus tipos corretos. Respostas aceitas. Sistema avança para substep "Abrangência". |
| **Técnica** | Caixa Preta (Caminho Feliz) |
| **Rastreabilidade** | Módulo 7 — US-03 (7.1.1.2 Informações Complementares) |

---

### CT-SIG-PROP-008 — Informações Complementares: pergunta obrigatória sem resposta bloqueia avanço

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-11 — Proposta Caracterização |
| **Objetivo** | Verificar que o avanço para "Abrangência" é bloqueado quando perguntas obrigatórias de "Informações complementares" não têm resposta. |
| **Prioridade** | Alta |
| **Pré-Condições** | Substep "Informações complementares" visível. Nenhuma pergunta respondida. |
| **Dados de Entrada** | Pergunta 1: (nenhuma opção selecionada) · Pergunta 2: (vazio) |
| **Passos** | 1. Navegar para "Informações complementares". 2. Não responder nenhuma das perguntas. 3. Clicar "Próxima etapa". 4. Verificar mensagens de validação. 5. Verificar que o sistema permanece no substep atual. |
| **Resultado Esperado** | Sistema exibe mensagens de campo obrigatório para as perguntas sem resposta. Avanço para "Abrangência" bloqueado. |
| **Técnica** | Equivalência (classe inválida — resposta vazia em campo obrigatório) |
| **Rastreabilidade** | Módulo 7 — US-03: perguntas marcadas com (*) são obrigatórias |

---

### CT-SIG-PROP-009 — Informações Complementares: limites de caracteres da Pergunta 2

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-11 — Proposta Caracterização |
| **Objetivo** | Verificar o comportamento do campo texto da Pergunta 2 nos quatro pontos de fronteira do intervalo válido [10, 20] caracteres. |
| **Prioridade** | Média |
| **Pré-Condições** | Substep "Informações complementares" visível. Pergunta 1 já respondida. |
| **Dados de Entrada** | Fixture `complementares-limites.json`: `[{"chars":9,"esperado":"inválido (min-1)"}, {"chars":10,"esperado":"válido (min)"}, {"chars":20,"esperado":"válido (max)"}, {"chars":21,"esperado":"inválido (max+1)"}]` |
| **Passos** | Para cada valor do fixture: 1. Navegar para "Informações complementares". 2. Preencher Pergunta 1 com opção válida. 3. Preencher Pergunta 2 com string do tamanho especificado. 4. Clicar "Próxima etapa". 5. Verificar resultado conforme esperado. |
| **Resultado Esperado** | 9 chars: mensagem de erro (mínimo 10). 10 chars: aceito. 20 chars: aceito. 21 chars: mensagem de erro (máximo 20) ou campo trunca a entrada. |
| **Técnica** | Valor Limite (min=10, min-1=9, max=20, max+1=21) + Data-Driven |
| **Rastreabilidade** | Módulo 7 — US-03: Pergunta 2 — Mínimo 10, Máximo 20 caracteres |

---

### Caracterização — Abrangência

---

### CT-SIG-PROP-010 — Abrangência: campo opcional permite avanço vazio e adição de item

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-11 — Proposta Caracterização |
| **Objetivo** | Verificar que "Abrangência" não é obrigatório (avanço permitido com tabela vazia) e que adições de Estado/Município são corretamente exibidas na tabela. |
| **Prioridade** | Média |
| **Pré-Condições** | Substep "Abrangência" visível. Tabela exibindo "0-0 de 0". |
| **Dados de Entrada** | Cenário sem abrangência: tabela vazia. Cenário com abrangência: Estado = Mato Grosso do Sul · Município = Campo Grande. |
| **Passos** | 1. Navegar para "Abrangência". 2. Verificar que a tabela (colunas: Estado · Município · Ações) está vazia ("0-0 de 0"). 3. Clicar "Próxima etapa" sem adicionar item. 4. Verificar que o sistema avança para "Dados pessoais" (Coordenação) sem erro. 5. Retornar para "Abrangência". 6. Clicar "Adicionar". 7. Selecionar Estado: Mato Grosso do Sul. 8. Selecionar Município: Campo Grande. 9. Confirmar. 10. Verificar que a linha aparece na tabela ("1-1 de 1"). |
| **Resultado Esperado** | Tabela vazia não bloqueia avanço. Após adição, linha com Estado e Município corretos aparece na tabela. |
| **Técnica** | Caixa Preta |
| **Rastreabilidade** | Módulo 7 — US-04 (7.1.1.3 Abrangência): tabela Estado/Município, não obrigatório |

---

### Coordenação

---

### CT-SIG-PROP-011 — Coordenação: Dados Pessoais do coordenador (integração)

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-12 — Proposta Coordenação |
| **Objetivo** | Verificar que o substep "Dados pessoais" da Coordenação exibe os dados do perfil do coordenador e permite salvá-los no contexto da proposta. |
| **Prioridade** | Alta |
| **Pré-Condições** | Proposta em andamento. Substep "Dados pessoais" (Coordenação) visível. |
| **Dados de Entrada** | Nome*: Ana Beatriz Silva · Sexo: Feminino · País: Brasil · Data de nascimento*: 15/06/1995 · Telefone celular: +55 67 99999-0001 · Raça/Cor: Branco(a) · CPF: 529.982.247-25 · Nome social: (vazio) |
| **Passos** | 1. Navegar para Coordenação — "Dados pessoais". 2. Verificar que campo E-mail está em modo somente-leitura (preenchido com e-mail do usuário logado). 3. Preencher Nome*, Data de nascimento*, Telefone celular, selecionar Sexo, País = Brasil, Raça/Cor e CPF. 4. Clicar "Próxima etapa". 5. Verificar mensagem de sucesso "Dados do usuário atualizados com sucesso". |
| **Resultado Esperado** | Dados pessoais salvos com sucesso. Toast de sucesso exibido. Sistema avança para substep "Endereço". |
| **Técnica** | Caixa Preta (integração — verifica que dados do perfil são utilizados e salvos no contexto da proposta) |
| **Rastreabilidade** | Módulo 7 — US-06 (7.1.2.1 Dados pessoais do coordenador) |

---

### CT-SIG-PROP-012 — Coordenação: Endereço do coordenador (integração)

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-12 — Proposta Coordenação |
| **Objetivo** | Verificar que o substep "Endereço" da Coordenação permite preencher o endereço com autopreenchimento por CEP e salvar no contexto da proposta. |
| **Prioridade** | Alta |
| **Pré-Condições** | Proposta em andamento. Substep "Endereço" (Coordenação) visível. |
| **Dados de Entrada** | CEP*: 79002-170 · Logradouro*: (autopreenchido) · Número: 100 · Complemento: (vazio) · Bairro*: (autopreenchido) · Estado: (autopreenchido) · Município: (autopreenchido) |
| **Passos** | 1. Navegar para Coordenação — "Endereço". 2. Digitar CEP: 79002-170. 3. Aguardar autopreenchimento de Logradouro*, Bairro*, Estado e Município. 4. Verificar que esses campos ficam em modo somente-leitura após autopreenchimento. 5. Preencher Número: 100. 6. Clicar "Próxima etapa". 7. Verificar mensagem de sucesso. |
| **Resultado Esperado** | CEP válido dispara autopreenchimento de Logradouro, Bairro, Estado e Município. Dados salvos com sucesso. Sistema avança para "Dados acadêmicos". |
| **Técnica** | Caixa Preta (integração) |
| **Rastreabilidade** | Módulo 7 — US-07 (7.1.2.2 Endereço do coordenador) |

---

### CT-SIG-PROP-013 — Coordenação: Dados Acadêmicos do coordenador (integração)

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-12 — Proposta Coordenação |
| **Objetivo** | Verificar que o substep "Dados acadêmicos" da Coordenação permite preencher e salvar informações acadêmicas no contexto da proposta. |
| **Prioridade** | Alta |
| **Pré-Condições** | Proposta em andamento. Substep "Dados acadêmicos" (Coordenação) visível. |
| **Dados de Entrada** | Sigla/Instituição: UFMS · Sigla/Unidade: FACOM · Nível acadêmico: Doutorado · Currículo Lattes: http://lattes.cnpq.br/0000000000000000 · LinkedIn: (vazio) · Áreas de conhecimento: Grande Área = Ciências Exatas e da Terra |
| **Passos** | 1. Navegar para Coordenação — "Dados acadêmicos". 2. Selecionar Sigla/Instituição: UFMS. 3. Selecionar Sigla/Unidade: FACOM. 4. Selecionar Nível acadêmico: Doutorado. 5. Preencher Currículo Lattes. 6. Clicar "Adicionar" em Áreas de conhecimento e selecionar Grande Área. 7. Clicar "Próxima etapa". 8. Verificar mensagem de sucesso. |
| **Resultado Esperado** | Dados acadêmicos salvos com sucesso. Toast de sucesso exibido. Sistema avança para "Dados profissionais". |
| **Técnica** | Caixa Preta (integração) |
| **Rastreabilidade** | Módulo 7 — US-08 (7.1.2.3 Dados acadêmicos do coordenador) |

---

### CT-SIG-PROP-014 — Coordenação: Dados Profissionais do coordenador (integração)

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-12 — Proposta Coordenação |
| **Objetivo** | Verificar que o substep "Dados profissionais" da Coordenação permite preencher vínculo institucional e empregatício e salvar no contexto da proposta. |
| **Prioridade** | Alta |
| **Pré-Condições** | Proposta em andamento. Substep "Dados profissionais" (Coordenação) visível. |
| **Dados de Entrada** | Possuo vínculo institucional: marcado · Tipo de vínculo: Servidor Público · Possuo vínculo empregatício: marcado · Início de serviço*: 01/01/2020 · Regime de trabalho: Dedicação Exclusiva · Função/Cargo*: Professora · Início de função/cargo*: 01/01/2020 |
| **Passos** | 1. Navegar para Coordenação — "Dados profissionais". 2. Marcar "Possuo vínculo institucional". 3. Selecionar Tipo de vínculo: Servidor Público. 4. Marcar "Possuo vínculo empregatício". 5. Preencher Início de serviço*: 01/01/2020. 6. Selecionar Regime de trabalho: Dedicação Exclusiva. 7. Preencher Função/Cargo*: Professora. 8. Preencher Início de função/cargo*: 01/01/2020. 9. Clicar "Próxima etapa". 10. Verificar toast de sucesso. |
| **Resultado Esperado** | Dados profissionais salvos com sucesso. Toast "Dados do usuário atualizados com sucesso" exibido. Sistema avança para "Descrição" (Apresentação). |
| **Técnica** | Caixa Preta (integração) |
| **Rastreabilidade** | Módulo 7 — US-09 (7.1.2.4 Dados profissionais do coordenador) |

---

### CT-SIG-PROP-015 — Coordenação: Dados Profissionais — nested checkboxes de vínculo

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-12 — Proposta Coordenação |
| **Objetivo** | Verificar que os campos de Vínculo Empregatício (Início de serviço, Regime de trabalho, Função/Cargo, Início de função/cargo) só ficam visíveis quando ambos os checkboxes "Possuo vínculo institucional" e "Possuo vínculo empregatício" estão marcados. |
| **Prioridade** | Média |
| **Pré-Condições** | Substep "Dados profissionais" (Coordenação) visível. Ambos os checkboxes desmarcados. |
| **Dados de Entrada** | Cenário 1: apenas "Possuo vínculo institucional" marcado · Cenário 2: ambos marcados · Cenário 3: desmarcar "Possuo vínculo empregatício" |
| **Passos** | 1. Verificar que campos de emprego estão ocultos. 2. Marcar "Possuo vínculo institucional". 3. Verificar que "Tipo de vínculo" aparece mas campos de emprego permanecem ocultos. 4. Marcar "Possuo vínculo empregatício". 5. Verificar que campos Início de serviço*, Regime de trabalho, Função/Cargo* e Início de função/cargo* aparecem. 6. Desmarcar "Possuo vínculo empregatício". 7. Verificar que campos de emprego somem novamente. |
| **Resultado Esperado** | Campos de emprego visíveis apenas com AMBOS os checkboxes marcados. Desmarcando "Vínculo empregatício" os campos somem. |
| **Técnica** | Grafo de Causa-Efeito (2 níveis nested): Causa-1: Vínculo Institucional=ON E Causa-2: Vínculo Empregatício=ON → Efeito: campos emprego visíveis |
| **Rastreabilidade** | Módulo 7 — US-09: campos de vínculo empregatício condicionais a ambos os checkboxes |

---

### Apresentação — Descrição

---

### CT-SIG-PROP-016 — Descrição: caminho feliz

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-13 — Proposta Apresentação |
| **Objetivo** | Verificar que as duas perguntas do substep "Descrição" são exibidas com os tipos corretos e aceitam respostas válidas. |
| **Prioridade** | Alta |
| **Pré-Condições** | Proposta em andamento. Substep "Descrição" (Apresentação) visível. |
| **Dados de Entrada** | Pergunta 1 (rádio): selecionar "Opção 1" · Pergunta 2 (texto, 10–20 chars): "Descricao ok" (12 chars) |
| **Passos** | 1. Navegar para Apresentação — "Descrição". 2. Verificar que Pergunta 1 é do tipo rádio com opções "Opção 1" e "Opção 2". 3. Selecionar "Opção 1". 4. Verificar que Pergunta 2 é campo de texto com contador "0/20". 5. Preencher Pergunta 2 com "Descricao ok" (12 chars). 6. Clicar "Próxima etapa". |
| **Resultado Esperado** | Ambas as perguntas exibidas com seus tipos. Respostas aceitas. Sistema avança para "Indicadores de produção". |
| **Técnica** | Caixa Preta (Caminho Feliz) |
| **Rastreabilidade** | Módulo 7 — US-11 (7.1.3.1 Descrição) |

---

### CT-SIG-PROP-017 — Descrição: perguntas obrigatórias sem resposta bloqueiam avanço

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-13 — Proposta Apresentação |
| **Objetivo** | Verificar que o avanço para "Indicadores de produção" é bloqueado quando as perguntas obrigatórias de "Descrição" não têm resposta. |
| **Prioridade** | Alta |
| **Pré-Condições** | Substep "Descrição" visível. Nenhuma pergunta respondida. |
| **Dados de Entrada** | Pergunta 1: (nenhuma opção selecionada) · Pergunta 2: (vazio) |
| **Passos** | 1. Navegar para "Descrição". 2. Não responder nenhuma das perguntas. 3. Clicar "Próxima etapa". 4. Verificar mensagens de validação para cada pergunta obrigatória. 5. Verificar que o sistema permanece no substep "Descrição". |
| **Resultado Esperado** | Sistema exibe mensagem de campo obrigatório para as perguntas sem resposta. Avanço bloqueado. |
| **Técnica** | Equivalência (classe inválida — resposta vazia em campo obrigatório) |
| **Rastreabilidade** | Módulo 7 — US-11: perguntas marcadas com (*) são obrigatórias |

---

### CT-SIG-PROP-018 — Descrição: limites de caracteres da Pergunta 2

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-13 — Proposta Apresentação |
| **Objetivo** | Verificar o comportamento do campo texto da Pergunta 2 de "Descrição" nos quatro pontos de fronteira do intervalo [10, 20] caracteres. |
| **Prioridade** | Média |
| **Pré-Condições** | Substep "Descrição" visível. Pergunta 1 já respondida. |
| **Dados de Entrada** | Fixture `descricao-limites.json`: `[{"chars":9,"esperado":"inválido"}, {"chars":10,"esperado":"válido"}, {"chars":20,"esperado":"válido"}, {"chars":21,"esperado":"inválido"}]` |
| **Passos** | Para cada valor do fixture: 1. Navegar para "Descrição". 2. Preencher Pergunta 1 com opção válida. 3. Preencher Pergunta 2 com string do tamanho especificado. 4. Clicar "Próxima etapa". 5. Verificar resultado. |
| **Resultado Esperado** | 9 chars: mensagem de erro (mínimo 10). 10 chars: aceito. 20 chars: aceito. 21 chars: mensagem de erro (máximo 20) ou entrada truncada. |
| **Técnica** | Valor Limite (min=10, min-1=9, max=20, max+1=21) + Data-Driven |
| **Rastreabilidade** | Módulo 7 — US-11: Pergunta 2 — Mínimo 10, Máximo 20 caracteres |

---

### Apresentação — Indicadores de Produção

---

### CT-SIG-PROP-019 — Indicadores de Produção: caminho feliz

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-13 — Proposta Apresentação |
| **Objetivo** | Verificar que o substep "Indicadores de produção" exibe a tabela correta e aceita valores numéricos positivos. |
| **Prioridade** | Média |
| **Pré-Condições** | Substep "Indicadores de produção" visível. |
| **Dados de Entrada** | Tabela Produção Bibliográfica: Qtde. Nacional = 2 · Qtde. Internacional = 1 |
| **Passos** | 1. Navegar para Apresentação — "Indicadores de produção". 2. Verificar que a tabela exibe colunas: Produção Bibliográfica · Qtde. Nacional · Qtde. Internacional. 3. Preencher Qtde. Nacional: 2. 4. Preencher Qtde. Internacional: 1. 5. Clicar "Próxima etapa". |
| **Resultado Esperado** | Tabela aceita valores numéricos positivos. Sistema avança para substep "Membros". |
| **Técnica** | Caixa Preta (Caminho Feliz) |
| **Rastreabilidade** | Módulo 7 — US-10 (7.1.3.2 Indicadores de produção) |

---

### CT-SIG-PROP-020 — Indicadores de Produção: valor inválido (negativo ou não numérico)

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-13 — Proposta Apresentação |
| **Objetivo** | Verificar que a tabela de Indicadores de produção rejeita valores negativos ou não numéricos. |
| **Prioridade** | Média |
| **Pré-Condições** | Substep "Indicadores de produção" visível. |
| **Dados de Entrada** | Qtde. Nacional: -1 · Qtde. Internacional: "abc" |
| **Passos** | 1. Navegar para "Indicadores de produção". 2. Preencher Qtde. Nacional com -1. 3. Clicar "Próxima etapa". 4. Verificar mensagem de validação. 5. Limpar o campo. 6. Preencher Qtde. Internacional com "abc". 7. Clicar "Próxima etapa". 8. Verificar mensagem de validação. |
| **Resultado Esperado** | Valor negativo exibe mensagem de erro (quantidade não pode ser negativa). Valor não numérico exibe mensagem de tipo inválido. Avanço bloqueado em ambos os casos. |
| **Técnica** | Equivalência (classes inválidas: negativo, não numérico) |
| **Rastreabilidade** | Módulo 7 — US-10: quantidades devem ser inteiros não negativos |

---

### Apresentação — Membros

---

### CT-SIG-PROP-021 — Membros: adicionar membro existente gera convite pendente

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-13 — Proposta Apresentação |
| **Objetivo** | Verificar que adicionar um pesquisador existente cria linha na tabela com status de convite "Pendente" e que o Coordenador já está pré-listado com status "Aceito". |
| **Prioridade** | Alta |
| **Pré-Condições** | Substep "Membros" visível. Coordenador já listado na tabela. Outro usuário com conta ativa no sistema disponível para ser convidado. |
| **Dados de Entrada** | Campo "Nome do pesquisador": nome ou e-mail de usuário existente no sistema |
| **Passos** | 1. Navegar para Apresentação — "Membros". 2. Verificar que a tabela (colunas: Nome · Instituição · Convite · Data de convite · Data de aceite · Função do membro · Ações) exibe o Coordenador com status "Aceito" e função "Coordenador". 3. Preencher campo "Nome do pesquisador" com nome de usuário existente. 4. Clicar "ADICIONAR". 5. Verificar que nova linha aparece na tabela com status de convite "Pendente". |
| **Resultado Esperado** | Novo membro adicionado com status "Pendente". Tabela exibe colunas corretas. Coordenador permanece com status "Aceito" e função "Coordenador". |
| **Técnica** | Caixa Preta (Caminho Feliz) |
| **Rastreabilidade** | Módulo 7 — US-12 (7.1.3.3 Membros): convite Pendente, tabela de membros |

---

### CT-SIG-PROP-022 — Membros: pesquisador inexistente exibe erro

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-13 — Proposta Apresentação |
| **Objetivo** | Verificar que tentar adicionar um pesquisador cujo nome/e-mail não existe no sistema exibe mensagem de erro adequada. |
| **Prioridade** | Média |
| **Pré-Condições** | Substep "Membros" visível. |
| **Dados de Entrada** | Campo "Nome do pesquisador": "Pesquisador Inexistente XYZ" (usuário que não existe no sistema) |
| **Passos** | 1. Navegar para Apresentação — "Membros". 2. Preencher campo "Nome do pesquisador" com nome inexistente. 3. Clicar "ADICIONAR". 4. Verificar resposta do sistema. |
| **Resultado Esperado** | Sistema exibe mensagem de erro informando que o pesquisador não foi encontrado. Nenhuma linha adicionada à tabela. |
| **Técnica** | Equivalência (classe inválida — pesquisador não encontrado) |
| **Rastreabilidade** | Módulo 7 — US-12: pesquisador deve possuir conta ativa no sistema |

---

### CT-SIG-PROP-023 — Membros: função do Coordenador é imutável

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-13 — Proposta Apresentação |
| **Objetivo** | Verificar que a função "Coordenador" na linha do coordenador da tabela de membros não pode ser alterada. |
| **Prioridade** | Média |
| **Pré-Condições** | Substep "Membros" visível. Coordenador listado na tabela com função "Coordenador". |
| **Dados de Entrada** | Linha do Coordenador na tabela: função "Coordenador" |
| **Passos** | 1. Navegar para Apresentação — "Membros". 2. Localizar a linha do Coordenador na tabela. 3. Tentar alterar o campo "Função do membro" do Coordenador. 4. Verificar se o campo está desabilitado, somente-leitura ou ausente de opção de edição. |
| **Resultado Esperado** | Campo "Função do membro" do Coordenador está bloqueado para edição. Função "Coordenador" imutável. |
| **Técnica** | Grafo de Causa-Efeito — Causa: membro é Coordenador → Efeito: campo função somente-leitura |
| **Rastreabilidade** | Módulo 7 — US-12: função do Coordenador não pode ser alterada |

---

### Apresentação — Atividades

---

### CT-SIG-PROP-024 — Atividades: adicionar atividade válida

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-13 — Proposta Apresentação |
| **Objetivo** | Verificar que clicar "Adicionar" e preencher os campos de uma atividade com dados válidos insere a linha na tabela de atividades. |
| **Prioridade** | Alta |
| **Pré-Condições** | Substep "Atividades" visível. Proposta com ao menos um membro além do Coordenador (para o campo Responsável/Membro). |
| **Dados de Entrada** | Título da atividade: "Levantamento de requisitos" · Mês de início: 1 · Duração em meses: 3 · Responsável: Coordenador · Membro: (membro disponível) |
| **Passos** | 1. Navegar para Apresentação — "Atividades". 2. Clicar no botão "Adicionar". 3. Preencher Título: "Levantamento de requisitos". 4. Selecionar Mês de início: 1. 5. Selecionar Duração em meses: 3. 6. Selecionar Responsável. 7. Selecionar Membro. 8. Confirmar. 9. Verificar que linha aparece na tabela com colunas: Título · Mês de início · Duração em meses · Responsável · Membro · Ações. |
| **Resultado Esperado** | Atividade adicionada e listada na tabela com os valores corretos nas colunas. |
| **Técnica** | Caixa Preta (Caminho Feliz) |
| **Rastreabilidade** | Módulo 7 — US-13 (7.1.3.4 Atividades) |

---

### CT-SIG-PROP-025 — Atividades: campo obrigatório vazio bloqueia adição

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-13 — Proposta Apresentação |
| **Objetivo** | Verificar que tentar adicionar uma atividade sem preencher o campo obrigatório "Título" exibe mensagem de erro e não insere a linha na tabela. |
| **Prioridade** | Média |
| **Pré-Condições** | Substep "Atividades" visível. Diálogo de adição de atividade aberto. |
| **Dados de Entrada** | Título: (vazio) · Mês de início: 1 · Duração em meses: 2 |
| **Passos** | 1. Navegar para "Atividades". 2. Clicar "Adicionar". 3. Deixar o campo Título vazio. 4. Preencher Mês de início e Duração. 5. Tentar confirmar. 6. Verificar mensagem de validação no campo Título. |
| **Resultado Esperado** | Sistema exibe mensagem de campo obrigatório para Título. Atividade não é inserida na tabela. |
| **Técnica** | Equivalência (classe inválida — campo obrigatório vazio) |
| **Rastreabilidade** | Módulo 7 — US-13: Título da atividade é obrigatório |

---

### CT-SIG-PROP-026 — Atividades: visualização de atividades cadastradas

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-13 — Proposta Apresentação |
| **Objetivo** | Verificar que o substep "Visualização de atividades" exibe corretamente as atividades adicionadas no substep anterior. |
| **Prioridade** | Média |
| **Pré-Condições** | Substep "Visualização de atividades" visível. Ao menos uma atividade adicionada no substep "Atividades". |
| **Dados de Entrada** | N/A |
| **Passos** | 1. Após adicionar ao menos uma atividade no substep "Atividades", avançar para "Visualização de atividades". 2. Verificar que as atividades adicionadas são exibidas na visualização. 3. Verificar que os dados de cada atividade (Título, Mês de início, Duração, Responsável, Membro) estão corretos. 4. Clicar "Próxima etapa". |
| **Resultado Esperado** | Todas as atividades cadastradas são exibidas corretamente na visualização. Sistema avança para "Faixa de financiamento" (Orçamento). |
| **Técnica** | Caixa Preta |
| **Rastreabilidade** | Módulo 7 — US-13: visualização de atividades após cadastro |

---

### Apresentação — Orçamento

---

### CT-SIG-PROP-027 — Orçamento: Faixa de financiamento

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-13 — Proposta Apresentação |
| **Objetivo** | Verificar que o substep "Faixa de financiamento" exibe o campo de seleção e permite avançar após seleção válida. |
| **Prioridade** | Média |
| **Pré-Condições** | Substep "Faixa de financiamento" (Orçamento) visível. |
| **Dados de Entrada** | Faixa de financiamento: primeira opção disponível no select |
| **Passos** | 1. Navegar para Orçamento — "Faixa de financiamento". 2. Verificar que campo "Faixa de financiamento" é um select com opções disponíveis. 3. Selecionar uma faixa de financiamento. 4. Clicar "Próxima etapa". |
| **Resultado Esperado** | Faixa selecionada com sucesso. Sistema avança para substep "Serviços de terceiros". |
| **Técnica** | Caixa Preta (Caminho Feliz) |
| **Rastreabilidade** | Módulo 7 — US-14 (7.1.3.5 Orçamento — Faixa de financiamento) |

---

### CT-SIG-PROP-028 — Orçamento: Serviços de terceiros

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-13 — Proposta Apresentação |
| **Objetivo** | Verificar que o substep "Serviços de terceiros" exibe a tabela correta e permite adicionar um item de serviço. |
| **Prioridade** | Média |
| **Pré-Condições** | Substep "Serviços de terceiros" (Orçamento) visível. |
| **Dados de Entrada** | Especificação: "Consultoria técnica" · Tipo: primeiro tipo disponível · Mês: 1 · Contrapartida: 0 · Valor total: 5000,00 |
| **Passos** | 1. Navegar para Orçamento — "Serviços de terceiros". 2. Verificar que a tabela exibe colunas: Especificação · Tipo · Mês · Contrapartida · Valor total. 3. Adicionar um item de serviço preenchendo os campos obrigatórios. 4. Verificar que o item aparece na tabela. 5. Clicar "Próxima etapa". |
| **Resultado Esperado** | Item de serviço adicionado e listado na tabela com os valores corretos. Sistema avança para "Bolsa". |
| **Técnica** | Caixa Preta (Caminho Feliz) |
| **Rastreabilidade** | Módulo 7 — US-14: Orçamento — Serviços de terceiros |

---

### CT-SIG-PROP-029 — Orçamento: Bolsa

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-13 — Proposta Apresentação |
| **Objetivo** | Verificar que o substep "Bolsa" exibe a tabela correta e permite adicionar um item de bolsa. |
| **Prioridade** | Média |
| **Pré-Condições** | Substep "Bolsa" (Orçamento) visível. |
| **Dados de Entrada** | Modalidade e nível: primeira modalidade disponível · Quantidade: 1 · Duração: 6 · Valor bolsa: 1000,00 · Contrapartida: 0 · Valor total: 6000,00 |
| **Passos** | 1. Navegar para Orçamento — "Bolsa". 2. Verificar que a tabela exibe colunas: Modalidade e nível · Quantidade · Duração · Valor bolsa · Contrapartida · Valor total. 3. Adicionar um item de bolsa preenchendo os campos obrigatórios. 4. Verificar que o item aparece na tabela. 5. Clicar "Próxima etapa". |
| **Resultado Esperado** | Item de bolsa adicionado e listado na tabela com valores corretos. Sistema avança para "Consolidação". |
| **Técnica** | Caixa Preta (Caminho Feliz) |
| **Rastreabilidade** | Módulo 7 — US-14: Orçamento — Bolsa |

---

### CT-SIG-PROP-030 — Orçamento: Consolidação e Solicitado à Fundação

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-13 — Proposta Apresentação |
| **Objetivo** | Verificar que os substeps "Consolidação" e "Solicitado à fundação" exibem os totais calculados a partir dos itens de orçamento inseridos e permitem avançar. |
| **Prioridade** | Média |
| **Pré-Condições** | Substeps de Orçamento anteriores preenchidos com ao menos um item cada. Substep "Consolidação" visível. |
| **Dados de Entrada** | N/A |
| **Passos** | 1. Navegar para Orçamento — "Consolidação". 2. Verificar que a tabela exibe colunas: Nome · R$. 3. Verificar que os totais de Serviços de terceiros e Bolsa são exibidos. 4. Clicar "Próxima etapa". 5. Navegar para "Solicitado à fundação". 6. Verificar que a tabela exibe colunas: Rubrica · T1 · T2 · T3 · T4 · Total por ano. 7. Clicar "Próxima etapa". |
| **Resultado Esperado** | "Consolidação" exibe totais por categoria calculados automaticamente. "Solicitado à fundação" exibe distribuição por rubrica e período. Sistema avança para substep "Documentos pessoais" (Anexos). |
| **Técnica** | Caixa Preta |
| **Rastreabilidade** | Módulo 7 — US-14: Orçamento — Consolidação e Solicitado à fundação |

---

### Anexos

---

### CT-SIG-PROP-031 — Anexos: Documentos pessoais — upload válido

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-14 — Proposta Anexos |
| **Objetivo** | Verificar que o substep "Documentos pessoais" aceita seleção de tipo de documento e upload de arquivo PDF válido. |
| **Prioridade** | Alta |
| **Pré-Condições** | Substep "Documentos pessoais" (Anexos 1/2) visível. Arquivo `documento-valido.pdf` (< 3MB) disponível em fixtures. |
| **Dados de Entrada** | Selecione uma opção: tipo disponível no select · Arquivo: documento-valido.pdf (PDF, < 3MB) |
| **Passos** | 1. Navegar para Anexos — "Documentos pessoais". 2. Selecionar tipo de documento no campo "Selecione uma opção". 3. Verificar que área de upload "Arraste e solte seu arquivo ou selecione o arquivo" aparece. 4. Fazer upload de `documento-valido.pdf`. 5. Verificar que o arquivo aparece em "Arquivos anexados". 6. Clicar "Próxima etapa". |
| **Resultado Esperado** | Upload aceito. Arquivo listado em "Arquivos anexados". Sistema avança para "Documentos da proposta". |
| **Técnica** | Caixa Preta (Caminho Feliz) |
| **Rastreabilidade** | F-14 — Proposta Anexos: Documentos pessoais |

---

### CT-SIG-PROP-032 — Anexos: Documentos pessoais — formato de arquivo inválido

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-14 — Proposta Anexos |
| **Objetivo** | Verificar que arquivos em formatos não aceitos são rejeitados com mensagem de erro no substep "Documentos pessoais". |
| **Prioridade** | Média |
| **Pré-Condições** | Substep "Documentos pessoais" visível. Tipo de documento selecionado. |
| **Dados de Entrada** | Fixture `tipos-invalidos.json`: arquivos com extensão `.exe`, `.txt`, `.zip` |
| **Passos** | Para cada arquivo do fixture: 1. Navegar para Anexos — "Documentos pessoais". 2. Selecionar tipo de documento. 3. Tentar fazer upload do arquivo inválido. 4. Verificar mensagem de erro. 5. Verificar que "Arquivos anexados" permanece vazio. |
| **Resultado Esperado** | Cada arquivo com formato inválido exibe mensagem de formato não suportado. Upload não é concluído. |
| **Técnica** | Equivalência (classe inválida — formato não aceito) + Data-Driven |
| **Rastreabilidade** | F-14 — Proposta Anexos: apenas formatos aceitos pelo sistema |

---

### CT-SIG-PROP-033 — Anexos: Documentos da proposta — upload válido

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-14 — Proposta Anexos |
| **Objetivo** | Verificar que o substep "Documentos da proposta" aceita seleção de tipo e upload de arquivo PDF válido. |
| **Prioridade** | Alta |
| **Pré-Condições** | Substep "Documentos da proposta" (Anexos 2/2) visível. Arquivo `proposta-curriculo.pdf` (< 3MB) disponível em fixtures. |
| **Dados de Entrada** | Selecione uma opção: tipo disponível no select · Arquivo: proposta-curriculo.pdf (PDF, < 3MB) |
| **Passos** | 1. Navegar para Anexos — "Documentos da proposta". 2. Selecionar tipo de documento no campo "Selecione uma opção". 3. Fazer upload de `proposta-curriculo.pdf` na área "Arraste e solte seu arquivo ou selecione o arquivo". 4. Verificar que o arquivo aparece em "Arquivos anexados". 5. Clicar "Próxima etapa". |
| **Resultado Esperado** | Upload aceito. Arquivo listado em "Arquivos anexados". Sistema avança para "Visualização da proposta" (Finalização). |
| **Técnica** | Caixa Preta (Caminho Feliz) |
| **Rastreabilidade** | F-14 — Proposta Anexos: Documentos da proposta |

---

### CT-SIG-PROP-034 — Anexos: Documentos da proposta — formato de arquivo inválido

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-14 — Proposta Anexos |
| **Objetivo** | Verificar que arquivos em formatos não aceitos são rejeitados com mensagem de erro no substep "Documentos da proposta". |
| **Prioridade** | Média |
| **Pré-Condições** | Substep "Documentos da proposta" visível. Tipo de documento selecionado. |
| **Dados de Entrada** | Fixture `tipos-invalidos.json`: arquivos com extensão `.exe`, `.txt`, `.zip` |
| **Passos** | Para cada arquivo do fixture: 1. Navegar para Anexos — "Documentos da proposta". 2. Selecionar tipo de documento. 3. Tentar fazer upload do arquivo inválido. 4. Verificar mensagem de erro. 5. Verificar que "Arquivos anexados" permanece vazio. |
| **Resultado Esperado** | Cada arquivo com formato inválido exibe mensagem de formato não suportado. Upload não é concluído. |
| **Técnica** | Equivalência (classe inválida — formato não aceito) + Data-Driven |
| **Rastreabilidade** | F-14 — Proposta Anexos: apenas formatos aceitos pelo sistema |

---

### Finalização

---

### CT-SIG-PROP-035 — Finalização: Visualização da proposta exibe todas as seções

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-15 — Proposta Finalização |
| **Objetivo** | Verificar que o substep "Visualização da proposta" exibe o resumo estruturado com todas as seções e os dados preenchidos refletidos corretamente. |
| **Prioridade** | Alta |
| **Pré-Condições** | Proposta com todos os substeps preenchidos até Anexos. Substep "Visualização da proposta" (Finalização 1/2) visível. |
| **Dados de Entrada** | N/A |
| **Passos** | 1. Navegar para Finalização — "Visualização da proposta". 2. Verificar presença da seção "1. CARACTERIZAÇÃO" com: 1.1 Informações iniciais (Título do edital, Título do projeto, Tipo de evento, Estado de execução, Município, Coordenador, E-mail, Duração, Instituição executora, Unidade executora, Áreas de conhecimento) e 1.2 Informações complementares. 3. Verificar presença da seção "2. DADOS DO COORDENADOR" com: 2.1 Dados pessoais · 2.2 Endereço · 2.3 Dados acadêmicos · 2.4 Dados profissionais. 4. Verificar presença da seção "3. PLANO DE TRABALHO" com: 3.1 Descrição. 5. Clicar "Próxima etapa". |
| **Resultado Esperado** | Todas as seções exibidas com os dados preenchidos. Informações consistentes com o que foi inserido nos substeps anteriores. Sistema avança para "Termo de aceite". |
| **Técnica** | Caixa Preta |
| **Rastreabilidade** | F-15 — Proposta Finalização: substep Visualização da proposta |

---

### CT-SIG-PROP-036 — Finalização: Termo de aceite habilita submissão

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-15 — Proposta Finalização |
| **Objetivo** | Verificar que o botão "Próxima etapa" (submeter) permanece desabilitado com o checkbox desmarcado e é habilitado após marcar "Li e estou de acordo com o termo de aceite". |
| **Prioridade** | Alta |
| **Pré-Condições** | Substep "Termo de aceite" (Finalização 2/2) visível. Checkbox desmarcado (estado inicial). |
| **Dados de Entrada** | Checkbox "Li e estou de acordo com o termo de aceite": desmarcado → marcado |
| **Passos** | 1. Navegar para Finalização — "Termo de aceite". 2. Verificar que o texto do termo declara aceite de condições, prazos e obrigações do edital. 3. Verificar que botão "Próxima etapa" está desabilitado com checkbox desmarcado. 4. Marcar o checkbox "Li e estou de acordo com o termo de aceite". 5. Verificar que botão "Próxima etapa" é habilitado. |
| **Resultado Esperado** | "Próxima etapa" desabilitado com checkbox desmarcado. Após marcar o checkbox, "Próxima etapa" é habilitado. |
| **Técnica** | Grafo de Causa-Efeito — Causa: checkbox "Li e estou de acordo..." = ON → Efeito: "Próxima etapa" habilitado |
| **Rastreabilidade** | F-15 — Proposta Finalização: substep Termo de aceite |

---

### CT-SIG-PROP-037 — Submissão da proposta com sucesso

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-16 — Verificação e Submissão |
| **Objetivo** | Verificar que clicar "Próxima etapa" após aceitar o termo altera o status da proposta para "Submetida" e exibe confirmação de sucesso. |
| **Prioridade** | Alta |
| **Pré-Condições** | Proposta completa com todos os substeps preenchidos. Checkbox do Termo de aceite marcado. Botão "Próxima etapa" habilitado. |
| **Dados de Entrada** | N/A |
| **Passos** | 1. No substep "Termo de aceite", com checkbox marcado, clicar "Próxima etapa". 2. Confirmar submissão no modal de confirmação (se exibido). 3. Verificar status da proposta na listagem. 4. Verificar mensagem de confirmação de sucesso. |
| **Resultado Esperado** | Status da proposta alterado para "Submetida". Mensagem de sucesso exibida. Proposta aparece com status atualizado na listagem da Home. |
| **Técnica** | Caixa Preta (Caminho Feliz) |
| **Rastreabilidade** | F-16 — Verificação de Pendências e Submissão |

---

### CT-SIG-PROP-038 — Submissão bloqueada com campos obrigatórios pendentes

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-16 — Verificação e Submissão |
| **Objetivo** | Verificar que o sistema identifica pendências e bloqueia a submissão quando campos obrigatórios de substeps anteriores não foram preenchidos. |
| **Prioridade** | Alta |
| **Pré-Condições** | Proposta com ao menos um campo obrigatório não preenchido (ex.: "Título do projeto" vazio na Caracterização). |
| **Dados de Entrada** | Título do projeto: (vazio) |
| **Passos** | 1. Iniciar proposta deixando "Título do projeto" vazio. 2. Tentar avançar diretamente até o substep de submissão. 3. Verificar que o sistema identifica pendências nos substeps anteriores. 4. Verificar que o botão de submissão não está disponível ou está desabilitado. 5. Verificar que a lista de pendências é exibida ao usuário. |
| **Resultado Esperado** | Sistema lista as pendências (campos obrigatórios não preenchidos). Submissão bloqueada até resolução das pendências. |
| **Técnica** | Caixa Preta (Caminho Negativo) |
| **Rastreabilidade** | F-16 — Verificação de Pendências: todos os campos obrigatórios devem estar preenchidos |

---

## TS-05 — Pós-submissão (F-17, F-18)

> **Pré-condição global do TS-05:** Usuário autenticado via `cy.session()`. Proposta com status "Submetida" existente.

---

### CT-SIG-BLOC-001 — Bloqueio de edição após submissão da proposta

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-17 — Bloqueio pós-submissão |
| **Objetivo** | Verificar que campos da proposta ficam em modo somente-leitura após submissão e que não é possível editá-los. |
| **Prioridade** | Média |
| **Pré-Condições** | Proposta com status "Submetida". |
| **Dados de Entrada** | N/A |
| **Passos** | 1. Acessar proposta com status "Submetida". 2. Tentar editar campo Título do Projeto. 3. Tentar alterar Duração em Meses. 4. Tentar alterar Instituição Executora. 5. Verificar presença ou ausência de botões de edição. |
| **Resultado Esperado** | Todos os campos da proposta submetida estão em modo somente-leitura. Botões de edição ausentes ou desabilitados. Nenhuma alteração é persistida. |
| **Técnica** | Caixa Preta |
| **Rastreabilidade** | F-17 — Bloqueio pós-submissão |

---

### CT-SIG-PERS-001 — Persistência de dados do perfil entre sessões

| Campo | Valor |
|---|---|
| **Funcionalidade** | F-18 — Persistência de dados |
| **Objetivo** | Verificar que dados salvos no perfil persistem corretamente após logout e novo login. |
| **Prioridade** | Média |
| **Pré-Condições** | Usuário com Dados Pessoais preenchidos e salvos (Nome, CPF, País, Data de Nascimento). |
| **Dados de Entrada** | N/A |
| **Passos** | 1. Verificar e anotar valores salvos em Dados Pessoais. 2. Fazer logout. 3. Fazer login novamente com as mesmas credenciais. 4. Navegar para Perfil → Dados Pessoais. 5. Verificar que todos os campos têm os mesmos valores anotados no passo 1. |
| **Resultado Esperado** | Todos os dados do perfil persistem entre sessões. Nenhum campo foi resetado ou alterado após logout/login. |
| **Técnica** | Caixa Preta |
| **Rastreabilidade** | F-18 — Persistência de dados |

---

## Matriz de Rastreabilidade (resumo)

| Funcionalidade | CTs |
|---|---|
| F-01 — Criação de Conta | AUTH-001, AUTH-002, AUTH-003, AUTH-004, AUTH-008 |
| F-02 — Login | AUTH-005, AUTH-006, AUTH-007 |
| F-03 — Perfil: Dados Pessoais | PERF-001, PERF-002, PERF-003, PERF-011, PERF-012 |
| F-04 — Perfil: Endereço | PERF-004, PERF-005 |
| F-05 — Perfil: Dados Acadêmicos | PERF-006, PERF-010, PERF-013 |
| F-06 — Perfil: Dados Profissionais | PERF-007, PERF-014 |
| F-07 — Perfil: Documentos Pessoais | PERF-008, PERF-009 |
| F-08 — Listagem do Edital | EDIT-001 |
| F-09 — Detalhe do Edital | EDIT-002, EDIT-003 |
| F-10 — Criação de Proposta | PROP-001 |
| F-11 — Proposta Caracterização | PROP-002, PROP-003, PROP-004, PROP-005, PROP-006, PROP-007, PROP-008, PROP-009, PROP-010 |
| F-12 — Proposta Coordenação | PROP-011, PROP-012, PROP-013, PROP-014, PROP-015 |
| F-13 — Proposta Apresentação | PROP-016, PROP-017, PROP-018, PROP-019, PROP-020, PROP-021, PROP-022, PROP-023, PROP-024, PROP-025, PROP-026, PROP-027, PROP-028, PROP-029, PROP-030 |
| F-14 — Proposta Anexos | PROP-031, PROP-032, PROP-033, PROP-034 |
| F-15 — Proposta Finalização | PROP-035, PROP-036 |
| F-16 — Verificação e Submissão | PROP-037, PROP-038 |
| F-17 — Bloqueio pós-submissão | BLOC-001 |
| F-18 — Persistência de dados | PERS-001 |

**Total: 65 casos de teste**  
*(AUTH: 8 · PERF: 14 · EDIT: 3 · PROP: 38 · BLOC: 1 · PERS: 1)*

---

## Fixtures necessários

| Arquivo | Conteúdo |
|---|---|
| `senhas-invalidas.json` | Array de senhas que violam regras de complexidade (7 chars, sem maiúscula, sem especial, sem número) |
| `credenciais-invalidas.json` | Array de `{email, senha}` com combinações inválidas |
| `cpfs-invalidos.json` | Array de CPFs com dígito verificador inválido |
| `ceps-invalidos.json` | Array de CEPs inválidos (inexistentes e fora do formato) |
| `tipos-invalidos.json` | Array de nomes de arquivo com extensões inválidas (`.exe`, `.txt`, `.zip`) |
| `info-iniciais-invalidas.json` | Array de `{campo, valor}` para campos obrigatórios de Informações Iniciais |
| `titulo-limites.json` | Array de `{chars, esperado}` para os limites do campo Título do Projeto (128 e 129 chars) |
| `duracao-limites.json` | Array de `{meses, esperado}` para os limites de Duração (0, 1, 12, 13 meses) |
| `complementares-limites.json` | Array de `{chars, esperado}` para os limites da Pergunta 2 de Complementares (9, 10, 20, 21 chars) |
| `descricao-limites.json` | Array de `{chars, esperado}` para os limites da Pergunta 2 de Descrição (9, 10, 20, 21 chars) |
| `documento-valido.pdf` | PDF < 3MB para upload em Documentos Pessoais e Anexos |
| `proposta-curriculo.pdf` | PDF < 3MB para upload em Documentos da proposta |
