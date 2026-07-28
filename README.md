# Gerador de RPG

Plugin **desktop e offline** para Obsidian. Ele gera conteúdo original de fantasia medieval sem depender de uma conexão de rede.

## Funcionalidades atuais

O Milestone 2 mantém os seis geradores do Milestone 1:

- **NPCs**
- **Locais**
- **Missões**
- **Encontros**
- **Rumores**
- **Masmorra**

A **Masmorra** continua sendo temporária e usa cinco salas. Ela não tem mapa nem os recursos de uma masmorra completa. Essa expansão fica para o Milestone 3.

### Controles de geração

Os controles compartilhados aparecem para todos os geradores:

| Controle | Rótulos disponíveis |
| --- | --- |
| **Tom** | **Sombrio**, **Extravagante**, **Heroico**, **Misterioso**, **Aleatório** |
| **Ambiente** | **Terras selvagens**, **Florestas**, **Cidade**, **Litoral**, **Ruínas**, **Subterrâneo**, **Aleatório** |
| **Complexidade** | **Rápido**, **Detalhado**, **Aleatório** |

**Aleatório** escolhe um valor compatível quando o resultado é gerado. A escolha é resolvida de novo a cada clique em **Rerrolar**. Portanto, um rerrolar pode mudar o tom, o ambiente e a complexidade, mesmo que o controle continue mostrando **Aleatório**. Valores escolhidos explicitamente permanecem fixos.

Tom e ambiente restringem materialmente o conteúdo. Eles não são apenas etiquetas visuais. Todas as combinações dos controles são suportadas pelas tabelas locais e funcionam sem conexão. Ao fechar e reabrir a view, a sessão começa de novo e os controles retornam a **Aleatório**.

### Filtro de NPC

O gerador de **NPCs** também tem o controle **Ancestralidade**. Ele oferece 17 perfis: **Humano**, **Elfo**, **Anão**, **Halfling**, **Orc**, **Goblin**, **Infernis**, **Gigante**, **Quacho**, **Símio**, **Clank**, **Fauno**, **Fada**, **Fungril**, **Firbolg**, **Galapa** e **Katari**, além de **Aleatória**. Os outros controles continuam usando **Aleatório**.

A escolha filtra o perfil usado no NPC. O resultado informa a escolha de forma explícita nos parâmetros. Quando ela é aleatória, o valor resolvido aparece com o sufixo `(aleatório)`.

### Nível de detalhe

**Complexidade** controla o tamanho do resultado sem mudar o gerador selecionado:

| Gerador | **Rápido** | **Detalhado** |
| --- | --- | --- |
| **NPCs** | Nome, ancestralidade, papel, traço definidor e gancho imediato. | Acrescenta aparência, personalidade, motivação, complicação, segredo, relação e um possível companheiro. |
| **Locais** | Nome, tipo, atmosfera, característica e gancho. | Acrescenta habitantes, história, tensão atual, perigo, segredo e oportunidades. |
| **Missões** | Contratante, objetivo, local, complicação e recompensa. | Acrescenta contexto, etapas, oposição, escalada, consequência do fracasso e resolução alternativa. |
| **Encontros** | Situação, ameaça imediata, reviravolta e escolha significativa. | Acrescenta preparação, atores, escalada, interação ambiental, desfechos e consequências. |
| **Rumores** | Boato, verdade para o mestre e desdobramento. | Acrescenta fonte, variações, pistas, interessados, consequência da investigação e contexto. |
| **Masmorra** | Tema, visão geral e cinco salas narrativas. | Os mesmos cinco campos de sala com descrições mais desenvolvidas. |

Os nomes passam por validação antes de entrar no resultado. Os catálogos usam frases completas em pt-BR. Um modelo de campos compartilhado preserva a ordem e o conteúdo entre texto puro e Markdown. O resultado mantém o nível de detalhe da opção escolhida.

### Saída e fluxo de uso

Depois de escolher um gerador e os controles, **Gerar** mostra uma pré-visualização renderizada. A sessão mantém o resultado enquanto a view está aberta. **Rerrolar** cria outro resultado e faz uma nova resolução das opções aleatórias.

O resumo dos parâmetros de entrada fica visível no Markdown gerado como um callout:

```markdown
> [!info] Parâmetros
> Tom: Sombrio
> Ambiente: Florestas
> Complexidade: Detalhado
```

Para NPCs, o callout também inclui `Ancestralidade`. Se a escolha foi **Aleatório**, o valor exibido identifica isso, por exemplo `Tom: Sombrio (aleatório)`. A versão em **Texto puro** não usa sintaxe de Markdown. Ela mantém um bloco legível com `Parâmetros` e linhas como `Tom: Sombrio`. A verdade para o mestre aparece tanto no rumor rápido quanto no detalhado, com o mesmo valor. O companheiro compatível do NPC detalhado é opcional: o campo é omitido quando não há companheiro.

O resultado pode ser copiado em representações separadas pelas ações **Copiar texto** e **Copiar Markdown**:

- **Texto puro**, sem sintaxe de Markdown.
- **Markdown**, para preservar a formatação e o callout.

Também é possível usar **Inserir na nota** para inserir o resultado na nota Markdown editável que recebeu o foco mais recentemente. Essa operação não cria uma nota nova. O conteúdo inserido usa um título H2 (`##`), para funcionar como uma seção da nota existente.

A ação **Criar nota** salva o resultado como um documento Markdown independente. Essa versão usa um título H1 (`#`) e abre a nota em uma nova aba.

### Notas geradas

A pasta de saída é configurável em **Configurações → Gerador de RPG → Pasta de saída**. O valor vazio é o padrão e salva na raiz do vault. O caminho deve ser relativo ao vault. Pastas aninhadas são criadas automaticamente quando necessário.

Os nomes de arquivo são derivados do título do resultado, com caracteres inválidos tratados para formar um nome seguro. O plugin nunca sobrescreve uma entrada existente: em caso de colisão, acrescenta um sufixo como ` - 2` ao nome.

A sessão do gerador é efêmera. Resultados e estado da geração não são persistidos. Fechar e reabrir o gerador inicia uma sessão nova.

### Erros

O plugin informa falhas com avisos do Obsidian e não faz fallback silencioso. Isso inclui falhas ao copiar, ausência de uma nota Markdown editável focada para a inserção, caminho de saída inválido, conflito com um arquivo no caminho de uma pasta e falhas ao criar ou abrir uma nota. Um erro de pasta ou de criação não substitui nem sobrescreve conteúdo existente.

## Uso

1. Instale o plugin na pasta `.obsidian/plugins/obsidian-rpg-random-generator/` do seu vault.
2. Execute `npm install` e `npm run build` neste repositório, ou use os artefatos de uma release.
3. Ative **Gerador de RPG** em *Configurações → Plugins comunitários*.
4. Clique no ícone de dado no Ribbon ou use a Command Palette para abrir o gerador.
5. Escolha uma categoria e clique em **Gerar**.

## Desenvolvimento

```bash
npm install
npm run dev       # build com watch
npm run typecheck # verificação de tipos sem gerar artefatos
npm test          # testes automatizados
npm run check     # typecheck + testes + build de produção
```

`main.js` é um artefato gerado e versionado neste repositório. Nunca o edite manualmente. Faça alterações nos arquivos-fonte e use o build para regenerá-lo. O comando `npm run check` inclui o build de produção e pode modificar o `main.js` rastreado.

Os catálogos pt-BR autoritativos ficam em `src/catalogs/pt-BR/generated-content.ts`; `src/tables.ts` é apenas uma fronteira de compatibilidade. O motor de geração fica em `src/generators.ts`, e o modelo/renderizador estrutural compartilhado fica em `src/structured-output.ts`. Os tipos e os rótulos das opções ficam em `src/types.ts` e `src/options.ts`. A formatação do callout e dos parâmetros em texto puro fica em `src/formatters.ts`. Os perfis de nomes são separados por povo em `src/names.ts` para preservar estilos culturais distintos.

## Licença

MIT. O código e as tabelas deste repositório são originais.
