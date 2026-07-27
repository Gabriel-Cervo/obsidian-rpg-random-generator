# Gerador de RPG

Plugin **desktop e offline** para Obsidian. Ele gera conteúdo original de fantasia medieval sem depender de uma conexão de rede.

## Funcionalidades atuais

O Milestone 1 oferece seis geradores:

- NPCs
- Locais
- Missões
- Encontros
- Rumores
- Masmorras

O gerador de masmorras ainda usa o formato atual de cinco salas. A expansão desse formato fica para o Milestone 3 e não faz parte das funcionalidades atuais.

Depois de escolher uma categoria, **Gerar** mostra uma pré-visualização renderizada do resultado. A sessão mantém o resultado enquanto o gerador está aberto. **Rerrolar** cria outro resultado da categoria selecionada.

O resultado pode ser copiado em representações separadas:

- **Texto puro**, sem sintaxe de Markdown.
- **Markdown**, para preservar a formatação.

Também é possível inserir o resultado na nota Markdown editável que recebeu o foco mais recentemente. Essa operação não cria uma nota nova. O conteúdo inserido usa um título H2 (`##`), para funcionar como uma seção da nota existente.

A ação de criar uma nota salva o resultado como um documento Markdown independente. Essa versão usa um título H1 (`#`) e abre a nota em uma nova aba.

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

Os dados ficam em `src/tables.ts` e o motor de templates em `src/generators.ts`. Os perfis de nomes são separados por povo em `src/names.ts` para preservar estilos culturais distintos.

## Licença

MIT. O código e as tabelas deste repositório são originais.
