# Notas de Campo do Lab

As cinco notas de IDs `1` a `5` em `src/content/notes.ts` vieram do conteúdo
inicial do projeto, commit `e3dfdda`. Posteriormente, foram extraídas de
`src/context/BlogContext.tsx` para esse arquivo no commit `0dc117a`.

Esses registros não possuem fontes ou referências cadastradas. Incluem relatos
de pesquisa em firmware, honeypots, protocolos, ransomware e modelos de IA,
com autores genéricos; um deles contém `CVE-2023-XXXX`. Não há evidência
cadastrada que permita tratá-los como pesquisas realizadas pelo OT-SEC.
Todos permanecem com `published: false` para preservar o histórico editorial,
sem integrar as notas públicas ou o JavaScript distribuído.

As páginas públicas usam as notas do repositório selecionadas durante o build.
Cópias e edições locais do navegador continuam no painel, sem repor registros
retirados de publicação. Nenhum dado local é apagado por essa mudança.

Para publicar uma nota real, registre o conteúdo e suas referências verificáveis
(`sourceName` e `sourceUrl`), confira a autoria e a correspondência entre a fonte
e as afirmações, e só então marque `published: true` no repositório e publique
um novo build. O campo de publicação não substitui a revisão das fontes.

Sem notas publicadas, a home oculta toda a seção. Quando houver notas reais
revisadas e publicadas, o mesmo layout volta a ser exibido automaticamente.
