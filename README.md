# Gerador de RPG

Plugin desktop para Obsidian que gera rapidamente conteúdo original de fantasia medieval para sessões de RPG.

## O que ele gera

- NPCs
- Locais
- Missões
- Encontros
- Rumores
- Masmorras de cinco salas

O plugin funciona completamente offline. Os resultados são temporários e podem ser copiados ou salvos em uma nova nota dentro da pasta `Gerados/` do vault.

## Uso

1. Instale o plugin na pasta `.obsidian/plugins/obsidian-rpg-random-generator/` do seu vault.
2. Execute `npm install` e `npm run build` neste repositório, ou use os artefatos de uma release.
3. Ative **Gerador de RPG** em *Configurações → Plugins comunitários*.
4. Clique no ícone de dado no Ribbon ou use a Command Palette para abrir o gerador.
5. Escolha uma categoria e clique em **Gerar**.

O botão principal passa a ser **Rerrolar** depois da primeira geração. **Copiar** envia o texto para a área de transferência; **Criar nota** salva o resultado em `Gerados/` e abre a nota no painel principal.

## Desenvolvimento

```bash
npm install
npm run dev       # build com watch
npm run check     # testes + build de produção
```

Os dados ficam em `src/tables.ts` e o motor de templates em `src/generators.ts`. Os perfis de nomes são separados por povo em `src/names.ts` para preservar estilos culturais distintos.

## Licença

MIT. O código e as tabelas deste repositório são originais.

